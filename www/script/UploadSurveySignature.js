var uploadSignaturesFileIndex = 0;
var responseSignaturesFileIndex = 0;
var getSignatureListSuccess = false;

//check upload survey data bak to server
var nSeconds_SurverySignatures = 0;
var iID_SurverySignatures = 0;

var SurverySignaturesEnded = false;
var SurverySignaturesFailed = false;

function uploadSignaturesEnded() {
    nSeconds_SurverySignatures = 0;
    iID_SurverySignatures = setInterval(function () {
        nSeconds_SurverySignatures += 3;
        //sAlert("waitting upload signatures...");
        if (getSignatureListSuccess) {
            if (uploadSignaturesFileIndex == 0 || uploadSignaturesFileIndex == responseSignaturesFileIndex) {
                nSeconds_SurverySignatures = 0;
                SurverySignaturesEnded = true;
                clearInterval(iID_SurverySignatures);
            }
        }
        if (nSeconds_SurverySignatures >= 30) {//waitting 40s
            nSeconds_SurverySignatures = 0;
            SurverySignaturesEnded = false;
            SurverySignaturesFailed = true;
            clearInterval(iID_SurverySignatures);
        }
    }, 3000);
}

document.addEventListener("deviceready", function () {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory("SurveySignature", { create: false, exclusive: false }, function (dirEntry) {
            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(function (entries) {
                uploadSignaturesFileIndex = entries.length;
                getSignatureListSuccess = true;
                //upload file survey sketchs: replace function uploadAllSignatureFile
                for (var i = 0; i < entries.length; i++) {
                    var fileEntry = entries[i];
                    uploadSignatureFile(fileEntry);
                }
            }, uploadSignatureFailed);
        }, uploadSignatureFailed);
    }, uploadSignatureFailed);
}, false);

function uploadSignatureFailed() {
    uploadSignaturesFileIndex = 0;
    responseSignaturesFileIndex = 0;
    getSignatureListSuccess = true;
}

//upload file operation
function uploadSignatureFile(fileEntry) {
    //TransferFile: function (fileURI, encodeUri, successHandle, failedHandle, options, useCapture)
    var imageURI = fileEntry.fullPath;
    var fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
    if (!imageURI)
        return;

    var uploadUri = CheckConnection.UploadPhotoPath();

    var params = {};
    params.value1 = "SurveySignature"; //on Cisco-iPad server path

    var options = new FileUploadOptions();
    options.fileKey = "recFile";
    options.fileName = fileName;
    options.mimeType = "text/plain";
    options.params = params;

    var transferSuccess = function (r) {
        if (JSON.parse(r.response).response_id == 1) {
            //sAlert("Warning: upload signature success.");
            backupSignatureFile(fileName);
        }
        else {
            //TODO ...
			responseSignaturesFileIndex++;
            //sAlert("Warning: " + JSON.parse(r.response).response_msg);
        }
    }
    var transferFail = function () {
        //sAlert("Warning: upload signature failed.");
        responseSignaturesFileIndex++;
    }
    var signatureTransfer = new FileTransfer();
    signatureTransfer.upload(imageURI, encodeURI(uploadUri), transferSuccess, transferFail, options);
    //var useCapture = true;
    //FileOperation.TransferFile(imageURI, uploadUri, transferSuccess, transferFail, options, useCapture)
}

function backupSignatureFile(fileName) {
    var filePath = "SurveySignature/" + fileName; //on Cisco-iPad client path
    var parentPath = "Backups";
    var successHandle = function () {
        //sAlert("signature backup success");
        responseSignaturesFileIndex++;
    }
    var failedHandle = function () {
        //sAlert("signature backup failed");
        responseSignaturesFileIndex++;
    }
    var useCapture = true;
    FileOperation.FileMoveTo(filePath, parentPath, successHandle, failedHandle, useCapture);
}

