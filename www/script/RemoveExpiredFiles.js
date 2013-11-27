document.addEventListener("deviceready", function () {
    var today = new Date();
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getDirectory("SurveyDataBak", { create: false, exclusive: false }, function (dirEntry) {
            var directoryReader = dirEntry.createReader();
            directoryReader.readEntries(function (entries) {
                for (var i = entries.length - 1; i >= 0; i--) {
                    var fileEntry = entries[i];
                    fileEntry.file(function (file) {
                        var lastModifiedDate = new Date(file.lastModifiedDate);
                        if (fileExpired(lastModifiedDate)) {

                        }
                        //lastModifiedDate.setDate(lastModifiedDate.getDate() + 30);
                        //if (lastModifiedDate.getTime() <= new Date().getTime()) {
                        //    fileEntry.remove();
                        //}
                    }, fail);
                }
            }, fail);
        }, fail);
    }, fail);
});

function fileExpired(lastModifiedDate) {
    var today = new Date();

    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDay = today.getDay();
    var tDays = (tYear * 12 + tMonth) * 30 + tDay;

    var iYear = lastModifiedDate.getFullYear();
    var iMonth = lastModifiedDate.getMonth();
    var iDay = lastModifiedDate.getDay();
    var iDays = (iYear * 12 + iMonth) * 30 + iDay;
    //return tDays - iDays > 30;
    return true;
}

function fileRemove(filePath, fileName) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
        fileSystem.root.getFile(filePath, { create: false, exclusive: false }, function (fileEntry) {
            fileEntry.remove(function () { }, function () {});
        }, fail);
    }, fail);
}

function fail() {
    //sAlert("Error");
    sAlert("Error");
}