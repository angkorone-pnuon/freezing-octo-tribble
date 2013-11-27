var uploadSketchsFileIndex = 0;
var responseSketchsFileIndex = 0;
var getSketchListSuccess = false;

//check upload survey data bak to server
var nSeconds_SurverySketchs = 0;
var iID_SurverySketchs = 0;

var SurverySketchsEnded = false;
var SurverySketchsFailed = false;

function uploadSketchsEnded() {
    nSeconds_SurverySketchs = 0;
    iID_SurverySketchs = setInterval(function () {
        //sAlert("waitting upload sketchs...");
        nSeconds_SurverySketchs += 3;
        if (getSketchListSuccess) {
            if (uploadSketchsFileIndex == 0 || uploadSketchsFileIndex == responseSketchsFileIndex) {
                nSeconds_SurverySketchs = 0;
                SurverySketchsEnded = true;
                clearInterval(iID_SurverySketchs);
            }
        }
        if (nSeconds_SurverySketchs >= 30) {//waitting 30s
            nSeconds_SurverySketchs = 0;
            SurverySketchsEnded = false;
            SurverySketchsFailed = true;
            clearInterval(iID_SurverySketchs);
        }
    }, 3000);
}

document.addEventListener("deviceready", function () {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory("SurveySketchs", { create: false, exclusive: false }, function (dirEntry) {
            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(function (entries) {
                uploadSketchsFileIndex = entries.length;
                getSketchListSuccess = true;
                //upload file survey sketchs: replace function uploadAllSketchFile
                for (var i = 0; i < entries.length; i++) {
                    var fileEntry = entries[i];
                    uploadSketchFile(fileEntry);
                }
            }, uploadSketchFailed);
        }, uploadSketchFailed);
    }, uploadSketchFailed);
}, false);

function uploadSketchFailed() {
    uploadSketchsFileIndex = 0;
    responseSketchsFileIndex = 0;
    getSketchListSuccess = true;
}

//upload file operation
function uploadSketchFile(fileEntry) {
    //TransferFile: function (fileURI, encodeUri, successHandle, failedHandle, options, useCapture)
    var imageURI = fileEntry.fullPath;
    var fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    if (!imageURI)
        return;

    var uploadUri = CheckConnection.UploadPhotoPath();

    var params = {};
    params.value1 = "SurveySketchs"; //on Cisco-iPad server path

    var options = new FileUploadOptions();
    options.fileKey = "recFile";
    options.fileName = fileName;
    options.mimeType = "text/plain";
    options.params = params;

    var transferSuccess = function (r) {
        if (JSON.parse(r.response).response_id == 1) {
            //sAlert("upload sketch success.");
            backupSketchFile(fileName);
        }
        else {
            //TODO ...
            responseSketchsFileIndex++;
            //sAlert("Warning: " + JSON.parse(r.response).response_msg);
        }
    }
    var transferFail = function () {
        //sAlert("upload sketch failed.");
        responseSketchsFileIndex++;
    }

    var sketchsTransfer = new FileTransfer();
    sketchsTransfer.upload(imageURI, encodeURI(uploadUri), transferSuccess, transferFail, options);
    //var useCapture = true;
    //FileOperation.TransferFile(imageURI, uploadUri, transferSuccess, transferFail, options, useCapture)
}

function backupSketchFile(fileName) {
    var filePath = "SurveySketchs/" + fileName; //on Cisco-iPad client path
    var parentPath = "Backups";
    var successHandle = function () {
        //sAlert("sketch backup success");
        responseSketchsFileIndex++;
    }
    var failedHandle = function () {
        //sAlert("sketch backup failed");
        responseSketchsFileIndex++;
    }
    var useCapture = true;
    FileOperation.FileMoveTo(filePath, parentPath, successHandle, failedHandle, useCapture);
}


