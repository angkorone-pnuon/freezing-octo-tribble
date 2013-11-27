var xmlHttpDownload = CheckConnection.XmlHttpConnect();

var http_request_question_list = new Array();
var http_question_request_length = 0;
var http_question_response_length = 0;


//check upload the history data to server
var nSeconds_DownloadQuestions = 0;
var iID_DownloadQuestions = 0;

var RedownloadVersion = false;
var DownloadQuestionEnded = false;
var DownloadQuestionFailed = false;

function DownloadQuestionsEnded() {
    iID_DownloadQuestions = setInterval(function () {
        nSeconds_DownloadQuestions += 3;
        //sAlert("waitting download data...");
        if (http_request_question_list.length == 0) {
            nSeconds_DownloadQuestions = 0;
            DownloadQuestionEnded = true;
            clearInterval(iID_DownloadQuestions);
            return;
        }
        if (http_question_response_length == http_request_question_list.length) {
            DownloadQuestionEnded = true;
            for (var i = 0; i < http_request_question_list.length; i++) {
                if (http_request_question_list[i].Response != 1) {
                    DownloadQuestionFailed = true;
                    break;
                }
            }
            nSeconds_DownloadQuestions = 0;
            clearInterval(iID_DownloadQuestions);
            return;
        }
        if (DownloadQuestionEnded) {
            nSeconds_DownloadQuestions = 0;
            clearInterval(iID_DownloadQuestions);
            return;
        }
        if (nSeconds_DownloadQuestions >= 30) { //30s
            DownloadQuestionEnded = true;
            DownloadQuestionFailed = true;
            nSeconds_DownloadQuestions = 0;
            clearInterval(iID_DownloadQuestions);
            return;
        }
    }, 3000);
}

function RedownloadQuestionVersion() {
    RedownloadVersion = true;
    DownloadQuestionEnded = false;
    DownloadQuestionFailed = false;

    nSeconds_DownloadQuestions = 0;
    //RedownloadVersion the question version information.
    for (var i = 0; i < http_request_question_list.length; i++) {
        if (http_request_question_list[i].Response != 0) {
            continue;
        }
        //ajaxHttpRequest: function (responseBody, handleStateChange, bAsync)
        var requestId = http_request_question_list[i].RequestID;
        var responseBody = http_request_question_list[i].ResponseBody;
        var bAsync = false;
        var handleStateChange = function () {
            handleStateChange_requestVersionData(requestId);
        }
        var timeout = 10000;
        var onTimeOut = function () {
            //TODO...
        }
        CheckConnection.ajaxHttpRequest(xmlHttpDownload, responseBody, handleStateChange, bAsync, timeout, onTimeOut);
    }
}

function getFileName(file_content) {//get file name by file content type
    var result = null;
    for (var key in JSON.parse(file_content)) { //get response file type
        if (key != "response_id" && key != "response_msg") {
            result = key;
            break;
        }
    }
    return result;
}
function getFilePath(fileName) {//get file path in the system by file name
    var result = null;
    switch (fileName) {
        case "Department": //get_department
            result = "DataSource/Department.txt";
            break;
        case "CheckingCategroy": //get_checking_category
            result = "DataSource/CheckingCategroy.txt";
            break;
        case "CheckingLevel": //get_checking_level
            result = "DataSource/CheckingLevel.txt";
            break;
        case "Sector": //get_sector
            result = "DataSource/Sector.txt";
            break;
        case "Site": //get_site
            result = "DataSource/Site.txt";
            break;
        case "EO": //get_eo
            result = "DataSource/EO.txt";
            break;
        case "QuestionSection": //get_question_section
            result = "DataSource/QuestionSection.txt";
            break;
        case "Question": //get_question
            result = "DataSource/Question.txt";
            break;
        default:
            //case "URAInterviewee": //get_ura_interviewee 
            //    result = "DataSource/URAInterviewee.txt"; 
            break;
    }
    return result;
}

function updateDownloadList(request_id, category_id, response) {
    http_question_response_length++;
    for (var i = 0; i < http_request_question_list.length; i++) {
        if (http_request_question_list[i].RequestID == request_id
            && http_request_question_list[i].CategoryID == category_id) {
            http_request_question_list[i].Response = response;
            break;
        }
    }
}

//Backup the "DataSource" to "DataSource_Backups"
function backup_DataSource() {//backup the Directory "DataSource"
    //    //Remove all files from "DataSource_Backups"
    //    removeFiles("DataSource_Backups");

    //    //Backup all files in "DataSource" to "DataSource_Backups"
    //    var backupLength_Success = 0;
    //    var backupLength_Fail = 0;
    //    //BackupFiles: function (fromDirectory, toDirectory, successHandle, failedHandle, useCapture)
    //    var successHandle = function () {
    //        backupLength_Success += 1;
    //    }
    //    var failedHandle = function () {
    //        backupLength_Fail += 1;
    //    }
    //    var useCapture = true;
    //    FileOperation.BackupFiles("DataSource", "DataSource_Backups", successHandle, failedHandle, useCapture);

    //    var backupLength = FileOperation.GetBackupLength();
}

//Recover the "DataSource" by "DataSource_Backups"
function recover_DataSource() {//recover the Directory "DataSource" by Directory "DataSource_Backups"
    //    //Remove all files from "DataSource"
    //    removeFiles("DataSource");

    //    //recover all files in "DataSource" with "DataSource_Backups"
    //    var recoverLength_Success = 0;
    //    var successHandle_Fail = function () {
    //        recoverLength_Success += 1;
    //    }
    //    var failedHandle = function () {
    //        successHandle_Fail += 1;
    //    }
    //    FileOperation.BackupFiles("DataSource_Backups", "DataSource", successHandle, failedHandle, true);
    //    var recoverLength = FileOperation.GetBackupLength();
}

//Remove file from local system
function removeFiles(directory) {//remove the files in the Directory by with filePath
    //    var removeLength_Success = 0;
    //    var successHandle_Fail = function () {
    //        removeLength_Success += 1;
    //    }
    //    var failedHandle = function () {
    //        successHandle_Fail += 1;
    //    }
    //    var useCapture = true;
    //    //RemoveFiles: function (directory, successHandle, failedHandle, useCapture);
    //    FileOperation.RemoveFiles(directory, successHandle, failedHandle, useCapture);
    //    var removeLength = FileOperation.GetRemoveLength();
}

//Request the question version information
function requestQuestionVersion(user_token) {//HttpRequest the lastest version information
    var request_question_version = { Type: "get_question_pool_version", RequestID: "get_question_pool_version", CategoryID: -1, Response: -1 };
    http_request_question_list.push(request_question_version);
    var version_ResponseBody = '{"request_id":"get_question_pool_version","token":"' + user_token + '"}';
    var handle_GetQuestionVersion = function () {
        if (xmlHttpDownload.status != 200 && xmlHttpDownload.status != 0) {
            return;
        }
        if (xmlHttpDownload.readyState.toString() != '4') {
            return;
        }
        var responseText = xmlHttpDownload.responseText;
        if (JSON.parse(responseText).response_id != '1') {
            updateDownloadList("get_question_pool_version", -1, 0);
            sAlert("Get the lastest version data failed!");
            return;
        }
        //Get question pool version successfully
        updateDownloadList("get_question_pool_version", -1, 1);
        question_version = JSON.parse(window.localStorage.getItem("question_version"));
        if (question_version == null) {
            //store the question version and get lastest version data
            StoreQuestionVersion(responseText);
            return;
        }
        var questionNewVersion = JSON.parse(responseText);
        if (question_version.question_pool_version >= questionNewVersion.question_pool_version) {
            DownloadQuestionEnded = true;
            DownloadQuestionFailed = false;
            return;
        }
        var confirmCallback = function (buttonIndex) {
            if (buttonIndex == 1) {
                //store the question version and get lastest version data
                StoreQuestionVersion(responseText);
            }
            else {
                DownloadQuestionEnded = true;
                DownloadQuestionFailed = false;
            }
        }
        sConfirm("Find new question version,upload the lastest version data?", confirmCallback);
    }
    //ajaxHttpRequest: function (responseBody, handleStateChange, bAsync)
    var timeout = 10000;
    var onTimeOut = function () {
        //TODO...
    }
    CheckConnection.ajaxHttpRequest(xmlHttpDownload, version_ResponseBody, handle_GetQuestionVersion, false, timeout, onTimeOut);
}

//1、backup the "DataSource";
//2、write file: store the question_version information; 
//3、request lastest question version information.
function StoreQuestionVersion(versionMsg) {
    //TODO ...
    backup_DataSource();

    window.localStorage.question_version = versionMsg;
    question_version = JSON.parse(versionMsg);

    updateQuestionVersion(versionMsg);
}

function updateQuestionVersion(fileContent) {
    //write file: store the question_version information
    //FileWrite: function (filePath, fileContent, appended, onWriteEnd, onError, useCapture);
    var filePath = "DataSource/QuestionVersion.txt";
    var onWriteEnd = function () {
        //download the lastest version data from the service
        getLastestQuestionVersion();
    }
    var onError = function () {
        //TODO ...
        sAlert("Write question version file failed.");
    }
    var useCapture = true;
    FileOperation.FileWrite(filePath, fileContent, false, onWriteEnd, onError, useCapture);
}

//Get lastest question version information:
function getLastestQuestionVersion() {
    var loginUser = JSON.parse(window.localStorage.login_user);
    var login_user_token = loginUser.token;
    var bAsync = false;
    requestVersionData("get_department", login_user_token, bAsync);
    requestVersionData("get_checking_category", login_user_token, bAsync);
    requestVersionData("get_checking_level", login_user_token, bAsync);
    requestVersionData("get_sector", login_user_token, bAsync);
    requestVersionData("get_site", login_user_token, bAsync);
    requestVersionData("get_question_section", login_user_token, bAsync);
    //requestVersionData("get_eo", login_user_token, bAsync);
    //requestVersionData("get_ura_interviewee", login_user_token, false);
}

//send httpRequest to Cisco-iPad server for request the new version data
function requestVersionData(request_id, user_token, bAsync) {
    var version_ResponseBody = '{"request_id":"' + request_id + '","token":"' + user_token + '"}';

    var request_question_download = { Type: "request_question_download", RequestID: request_id, ResponseBody: version_ResponseBody, CategoryID: -1, Response: -1 };
    http_request_question_list.push(request_question_download);
    http_question_request_length += 1;

    //ajaxHttpRequest: function (responseBody, handleStateChange, bAsync)
    var handle_GetVersionData = function () {
        handleStateChange_requestVersionData(request_id);
    }

    var timeout = 10000;
    var onTimeOut = function () {
        //TODO...
    }
    CheckConnection.ajaxHttpRequest(xmlHttpDownload, version_ResponseBody, handle_GetVersionData, bAsync, timeout, onTimeOut);
}

function handleStateChange_requestVersionData(request_id) {
    if (xmlHttpDownload.status != 200 && xmlHttpDownload.status != 0) {
        return;
    }
    if (xmlHttpDownload.readyState.toString() != '4') {
        return;
    }
    var file_content = xmlHttpDownload.responseText;
    if (JSON.parse(file_content).response_id != "1") {
        updateDownloadList(request_id, -1, 0);
        return;
    }
    var fileInfo = JSON.parse(file_content);
    var fileName = getFileName(file_content);
    var filePath = getFilePath(fileName);

    if (fileName == null || filePath == null) {
        updateDownloadList(request_id, -1, 0);
        sAlert("Get lastest version data ,unknow file name in the response result!");
        return;
    }
    //write file: store the lastest version data in file
    //FileWrite: function (filePath, fileContent, appended, onWriteEnd, onError, useCapture)
    var useCapture = true;
    var onWriteEnd = function () {
        updateDownloadList(request_id, -1, 1);
    }
    var onError = function () {
        updateDownloadList(request_id, -1, 0);
        sAlert("Write file question version failed");
    }
    FileOperation.FileWrite(filePath, file_content, false, onWriteEnd, onError, useCapture);

    //get questions by CheckingCategroyId
    if (fileName == "CheckingCategroy") {
        var checkingCategory = JSON.parse(file_content).CheckingCategroy;
        for (var i = 0; i < checkingCategory.length; i++) {
            var request_question_download = { Type: "request_question_download", RequestID: "get_question", CategoryID: checkingCategory[i].checking_categroyid, Response: -1 };
            http_request_question_list.push(request_question_download);
            http_question_request_length++;

            //ajaxHttpRequest: function (responseBody, handleStateChange, bAsync)
            var version_ResponseBody = '{"request_id":"get_question","checking_category_id":"' + checkingCategory[i].checking_categroyid + '","token":"' + login_user.token + '"}';
            var handle_GetQuestionData = function () {
                handleStateChange_requestQuestionData("get_question", checkingCategory[i].checking_categroyid);
            }
            var timeout = 10000;
            var onTimeOut = function () {
                //TODO...
            }
            CheckConnection.ajaxHttpRequest(xmlHttpDownload, version_ResponseBody, handle_GetQuestionData, false, timeout, onTimeOut);
        }
    }
}

function handleStateChange_requestQuestionData(request_id, categroy_id) {
    if (xmlHttpDownload.status != 200 && xmlHttpDownload.status != 0) {
        return;
    }
    if (xmlHttpDownload.readyState.toString() != '4') {
        return;
    }
    var file_content = xmlHttpDownload.responseText;
    if (JSON.parse(file_content).response_id != "1") {
        updateDownloadList(request_id, categroy_id, 0);
        return;
    }
    var fileType = "Question_" + JSON.parse(file_content).checking_category_id;
    var filePath = "DataSource/Question_" + categroy_id + ".txt";
    //write file: store the questions data in file
    //FileWrite: function (filePath, fileContent, appended, onWriteEnd, onError, useCapture)
    var useCapture = true;
    var onWriteEnd = function () {
        updateDownloadList(request_id, categroy_id, 1);
    }
    var onError = function () {
        updateDownloadList(request_id, categroy_id, 0);
        sAlert("Write question data to file failed.");
    }
    FileOperation.FileWrite(filePath, file_content, false, onWriteEnd, onError, useCapture);
}