var xmlHttpSurveyData = CheckConnection.XmlHttpConnect();
var loginUser = JSON.parse(window.localStorage.login_user);

var http_upload_request_length = 0;
var http_upload_response_length = 0;
var http_request_upload_list = new Array(); //object type: { Type: type, FileName: fileName, Response: -1 }
var getListSuccess = false;

function AddUploadList(type, fileName) {
    http_upload_request_length++;
    var file_upload_request = { Type: type, FileName: fileName, Response: -1 };
    http_request_upload_list.push(file_upload_request);
}
function updateUploadList(type, fileName, response) {
    http_upload_response_length++;
    for (var i = 0; i < http_request_upload_list.length; i++) {
        if (http_request_upload_list[i].Type == type
            && http_request_upload_list[i].FileName == fileName) {
            http_request_upload_list[i].Response = response;
            break;
        }
    }
}

//check upload the history data to server
var nSeconds_SurveryData = 0;
var iID_SurveryData = 0;

var SurveryDataEnded = false;
var SurveryDataFailed = false;

function uploadSurveryDataEnded() {
    nSeconds_SurveryData = 0;
    iID_SurveryData = setInterval(function () {
        nSeconds_SurveryData += 3;
        //sAlert("waitting upload survery data...");
        if (getListSuccess) {
            if (http_request_upload_list.length == 0 || http_upload_response_length == http_request_upload_list.length) {
                nSeconds_SurveryData = 0;
                SurveryDataEnded = true;
                clearInterval(iID_SurveryData);
            }
        }
        if (SurveryDataEnded) {
            nSeconds_SurveryData = 0;
            SurveryDataEnded = true;
            clearInterval(iID_SurveryData);
        }
        if (nSeconds_SurveryData >= 30) {//waitting 30s
            nSeconds_SurveryData = 0;
            SurveryDataEnded = true;
            SurveryDataFailed = true;
            clearInterval(iID_SurveryData);
        }
    }, 3000);
}

document.addEventListener("deviceready", function () {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory("SurveyData", { create: false, exclusive: false }, function (dirEntry) {
            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    var fileEntry = entries[i];
                    var filePath = fileEntry.fullPath;
                    var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
                    AddUploadList("survey_data_upload", fileName);
                } //end get file entry from the entries(for).
                getListSuccess = true;
                //Upload survey data to server 

                uploadSurveyDataToServer();
            }, FileOperation.FileErrorHandler);
        }, FileOperation.FileErrorHandler);
    }, FileOperation.FileErrorHandler);
}, false);

function uploadSurveyDataToServer() {
    if (http_request_upload_list.length == 0) {
        return;
    }
    //check login user whether expired;
    //if is expired then relogin to server;if login then upload file to cisco-iPad server.
    //if not expired then upload file to cisco-iPad server
    loginUser = JSON.parse(window.localStorage.login_user);
    //check login_user is expired
    //CheckConnection.ajaxHttpRequest: function (responseBody, handleStateChange, bAsync)
    var verify_token_response_body = '{ "request_id": "verify_token", "token": "' + loginUser.token + '" }';

    var timeout = 10000;
    var onTimeOut = function () {
        //TODO...
    }
    CheckConnection.ajaxHttpRequest(xmlHttpSurveyData, verify_token_response_body, Handle_VerifyToken, false, timeout, onTimeOut);
}

function Handle_VerifyToken() {
    if (xmlHttpSurveyData.status != 200 && xmlHttpSurveyData.status != 0) {
        return;
    }
    if (JSON.parse(xmlHttpSurveyData.responseText).response_id == '1') {
        if (xmlHttpSurveyData.readyState.toString() == '4') {
            uploadSurveryDataList();
        }
        return;
    }
    //login_user token is Expired, user relogin to server.
    loginUser = JSON.parse(window.localStorage.login_user);
    var user_loginid = loginUser.user_info.user_loginid;
    var password = loginUser.user_info.password;
    var relogin_response_body = '{"request_id":"login","pass_word":"' + password + '","user_account_id":"' + user_loginid + '","app_type":"ipad","device_id":"1235ABC4532","client_app_version":"1.0"}';
    var timeout = 10000;
    var onTimeOut = function () {
        //TODO...
    }
    CheckConnection.ajaxHttpRequest(xmlHttpSurveyData, relogin_response_body, Handle_Relogin, false, timeout, onTimeOut);
}

function Handle_Relogin() {
    if (xmlHttpSurveyData.status != 200 && xmlHttpSurveyData.status != 0) {
        return;
    }
    if (JSON.parse(xmlHttpSurveyData.responseText).response_id != '1') {//relogin failed,do nothing.
        SurveryDataEnded = true;
        SurveryDataFailed = true;
        return;
    }
    //relogin success,update the login user and upload survery data to cisco-iPad server.
    var newToken = JSON.parse(xmlHttpSurveyData.responseText).token;
    var old_user = JSON.parse(window.localStorage.login_user);
    old_user.token = newToken;
    window.localStorage.login_user = JSON.stringify(old_user);
    loginUser = JSON.parse(window.localStorage.login_user);
    //upload survery data to cisco-iPad server.
    uploadSurveryDataList();
}
//get survey data file successfully,and upload file information to server

function uploadSurveryDataList() {
    for (var i = 0; i < http_request_upload_list.length; i++) {
        http_upload_request_length++;
        var filePath = "SurveyData/" + http_request_upload_list[i].FileName;
        var onLoadEnd = function (evt) {
            Handle_GotSurveryDataFile(evt);
        }
        var onError = function () {
            updateUploadList("survey_data_upload", http_request_upload_list[i].FileName, 0);
            //sAlert("get survey data file failed..");
        }
        var useCapture = true;
        FileOperation.ReadFileAsText(filePath, onLoadEnd, onError, useCapture);
    }
}

function Handle_GotSurveryDataFile(evt) {
    var name = evt.target.fileName;
    var fileName = name.substr(name.lastIndexOf('/') + 1);
    var filePath = "SurveyData/" + fileName;

    //if the survery data is empty data,remove the survey data file. 
    if (evt.target.result == 'upload onsite survey data: null.') {
        setTimeout(function () {
            //remove the empty file
            //FileRemove: function (filePath, successHandle, failedHandle, useCapture)
            var successHandle = function () {
                updateUploadList("survey_data_upload", fileName, 1);
            }
            var failedHandle = function () {
                updateUploadList("survey_data_upload", fileName, 0);
            }
            var useCapture = true;
            FileOperation.FileRemove(filePath, successHandle, failedHandle, useCapture);
        }, 1000);
        return;
    }

    //begin upload history data to server:give the user_token to the response body
    loginUser = JSON.parse(window.localStorage.login_user);
    var uploadContent = JSON.parse(evt.target.result);
    uploadContent.token = loginUser.token;
    var file_upload_response_body = JSON.stringify(uploadContent);
    //send the file content to cisco-iPad server

    var timeout = 10000;
    var onTimeOut = function () {
        //TODO...
    }
    CheckConnection.ajaxHttpRequest(xmlHttpSurveyData, file_upload_response_body, function () {
        Handle_UploadSurveyData(filePath, fileName);
    }, false, timeout, onTimeOut); //bSynac is true ???
}

function Handle_UploadSurveyData(filePath, fileName) {
    if (xmlHttpSurveyData.status != 200 && xmlHttpSurveyData.status != 0) {
        return;
    }
    var responseText = xmlHttpSurveyData.responseText;
    if (responseText == "[null]" || JSON.parse(responseText).response_id != '1') {
        updateUploadList("survey_data_upload", fileName, 0);
        return;
    }
    switch (xmlHttpSurveyData.readyState.toString()) {
        case '4':
            var parentPath = "SurveyDataBak";
            var successHandle = function () {
                updateUploadList("survey_data_upload", fileName, 1);
            }
            var failedHandle = function () {
                updateUploadList("survey_data_upload", fileName, 0);
            }
            var useCapture = true;
            FileOperation.FileMoveTo(filePath, parentPath, successHandle, failedHandle, useCapture);
            break;
        default:
            break;
    }
}