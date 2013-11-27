var uploadPhotosFileIndex = 0;
var responsePhotosFileIndex = 0;
var getPhotoListSuccess = false;

//check upload survey photos to server
var nSeconds_SurveryPhotos = 0;
var iID_SurveryPhotos = 0;

var SurveryPhotosEnded = false;
var SurveryPhotosFailed = false;

function uploadPhotosEnded() {
    nSeconds_SurveryPhotos = 0;
    iID_SurveryPhotos = setInterval(function () {
        //sAlert("waitting upload photos...");
        nSeconds_SurveryPhotos += 3;
        //sAlert("waitting survery photos...");
        if (getPhotoListSuccess) {
            if (uploadPhotosFileIndex == 0 || uploadPhotosFileIndex == responsePhotosFileIndex) {
                nSeconds_SurveryPhotos = 0;
                SurveryPhotosEnded = true;
                clearInterval(iID_SurveryPhotos);
            }
        }
        if (nSeconds_SurveryPhotos >= 30) {//waitting 30s
            nSeconds_SurveryPhotos = 0;
            SurveryPhotosEnded = false;
            SurveryPhotosFailed = true;
            clearInterval(iID_SurveryPhotos);
        }
    }, 3000);
}

document.addEventListener("deviceready", function () {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory("SurveyPhotos", { create: false, exclusive: false }, function (dirEntry) {
            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(function (entries) {
                uploadPhotosFileIndex = entries.length;
                getPhotoListSuccess = true;
                //upload survey photos file: replace the function uploadAllPhotoFile
                for (var i = 0; i < entries.length; i++) {
                    var fileEntry = entries[i];
                    uploadPhotoFile(fileEntry);
                }
            }, uploadFailed);
        }, uploadFailed);
    }, uploadFailed);
}, false);

function uploadFailed() {
    uploadPhotosFileIndex = 0;
    responsePhotosFileIndex = 0;
    getPhotoListSuccess = true;
}

//upload file operation
function uploadPhotoFile(fileEntry) {


    //TransferFile: function (fileURI, encodeUri, successHandle, failedHandle, options, useCapture)
    var imageURI = fileEntry.fullPath;
    var fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    if (!imageURI)
        return;
    var uploadUri = CheckConnection.UploadPhotoPath();
    var params = {};
    params.value1 = "SurveyPhotos"; //on Cisco-iPad server path

    var options = new FileUploadOptions();
    options.fileKey = "recFile";
    options.fileName = fileName;
    options.mimeType = "image/jpeg";
    options.params = params;

    var transferSuccess = function (r) {
        if (JSON.parse(r.response).response_id == 1) {
            //sAlert("upload photo success.");
            backupPhotoFile(fileName);
        }
        else {
            //TODO ...
            responsePhotosFileIndex++;
            //sAlert("Warning: " + JSON.parse(r.response).response_msg);
        }
    }
    var transferFail = function () {
        //sAlert("Warning: upload photo failed.");
        responsePhotosFileIndex++;
    }
    var photosTransfer = new FileTransfer();
    photosTransfer.upload(imageURI, encodeURI(uploadUri), transferSuccess, transferFail, options);
    //var useCapture = true;
    //FileOperation.TransferFile(imageURI, uploadUri, transferSuccess, transferFail, options, useCapture);
}

function backupPhotoFile(fileName) {
    var filePath = "SurveyPhotos/" + fileName; //on Cisco-iPad client path
    var parentPath = "Backups";
    var successHandle = function () {
        //TODO ...
        //sAlert("photo backup success");
        responsePhotosFileIndex++;
    }
    var failedHandle = function () {
        //sAlert("photo backup failed");
        responsePhotosFileIndex++;
    }
    var useCapture = true;
    FileOperation.FileMoveTo(filePath, parentPath, successHandle, failedHandle, useCapture);
}


