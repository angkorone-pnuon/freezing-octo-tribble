var uploadDataBakFileIndex = 0;
var responseDataBakFileIndex = 0;
var getDataBakListSuccess = false;

//check upload survey data bak to server
var nSeconds_SurveryDataBak = 0;
var iID_SurveryDataBak = 0;

var SurveryDataBakEnded = false;
var SurveryDataBakFailed = false;

function uploadDataBakEnded() {
    nSeconds_SurveryDataBak = 0;
    iID_SurveryDataBak = setInterval(function () {
        //sAlert("waitting upload dataBaks...");
        nSeconds_SurveryDataBak += 3;
        if (getDataBakListSuccess) {
            if (uploadDataBakFileIndex == 0 || uploadDataBakFileIndex == responseDataBakFileIndex) {
                nSeconds_SurveryDataBak = 0;
                SurveryDataBakEnded = true;
                clearInterval(iID_SurveryDataBak);
            }
        }
        if (nSeconds_SurveryDataBak >= 30) {//waitting 30s
            nSeconds_SurveryDataBak = 0;
            SurveryDataBakEnded = false;
            SurveryDataBakFailed = true;
            clearInterval(iID_SurveryDataBak);
        }
    }, 3000);
}

document.addEventListener("deviceready", function () {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory("SurveyDataBak", { create: false, exclusive: false }, function (dirEntry) {
            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(function (entries) {
                uploadDataBakFileIndex = entries.length;
                getDataBakListSuccess = true;
                //upload file survey dataBaks: replace function uploadAllDataBakFile
                for (var i = 0; i < entries.length; i++) {
                    var fileEntry = entries[i];
                    uploadDataBakFile(fileEntry);
                }
            }, uploadDataBakFailed);
        }, uploadDataBakFailed);
    }, uploadDataBakFailed);
}, false);

function uploadDataBakFailed() {
    uploadDataBakFileIndex = 0;
    responseDataBakFileIndex = 0;
    getDataBakListSuccess = true;
}

//upload file operation
function uploadDataBakFile(fileEntry) {
    //TransferFile: function (fileURI, encodeUri, successHandle, failedHandle, options, useCapture)
    var imageURI = fileEntry.fullPath;
    var fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    if (!imageURI)
        return;

    var uploadUri = CheckConnection.UploadPhotoPath();

    var params = {};
    params.value1 = "SurveyDataBak"; //on Cisco-iPad server path

    var options = new FileUploadOptions();
    options.fileKey = "recFile";
    options.fileName = fileName;
    options.mimeType = "text/plain";
    options.params = params;

    var transferSuccess = function (r) {
        if (JSON.parse(r.response).response_id == 1) {
            //sAlert("upload dataBak success.");
            backupDataBakFile(fileName);
        }
        else {			
            //TODO ...
			responseDataBakFileIndex++;
            //sAlert("Warning: " + JSON.parse(r.response).response_msg);
        }
    }
    var transferFail = function () {
        //sAlert("Warning: upload dataBak failed.");
        responseDataBakFileIndex++;
    }

    var databakTransfer = new FileTransfer();
    databakTransfer.upload(imageURI, encodeURI(uploadUri), transferSuccess, transferFail, options);
    //var useCapture = true;
    //FileOperation.TransferFile(imageURI, uploadUri, transferSuccess, transferFail, options, useCapture)
}

function backupDataBakFile(fileName) {
    var filePath = "SurveyDataBak/" + fileName; //on Cisco-iPad client path
    var parentPath = "Backups";
    var successHandle = function () {
        //sAlert("dataBak backup success");
        responseDataBakFileIndex++;
    }
    var failedHandle = function () {
        //sAlert("dataBak backup failed");
        responseDataBakFileIndex++;
    }
    var useCapture = true;
    FileOperation.FileMoveTo(filePath, parentPath, successHandle, failedHandle, useCapture);
}


