/* *******************************************************************************************************************************************
public function addEventListener(type:String, listener:Function, useCapture:Boolean = false, priority:int = 0, useWeakReference:Boolean = false):void
1��type:String 
�¼������͡�
2��listener:Function 
�������¼������¼��ĺ����� �˺���������� Event ������Ϊ��Ψһ�Ĳ��������Ҳ��ܷ����κν����������ʾ����ʾ�� �������η� function ������(evt:Event):void
3��useCapture:Boolean (default = false) 
����ǣ�������¼������ĸ��������������ʱ�������׶Σ�����׶Ρ�Ŀ��׶κ�ð�ݽ׶Ρ�˳��Ϊ������׶Σ����ڵ㵽�ӽڵ����Ƿ�����˼�����������Ŀ��׶Σ�Ŀ�걾����ð�ݽ׶Σ�Ŀ�걾�����ڵ㣩���˴��Ĳ���ȷ���������������ڲ���׶Ρ�Ŀ��׶λ���ð�ݽ׶Ρ� ����� useCapture ����Ϊ true����������ֻ�ڲ���׶δ����¼���������Ŀ���ð�ݽ׶δ����¼��� ���useCapture Ϊ false����������ֻ��Ŀ���ð�ݽ׶δ����¼��� Ҫ�����������׶ζ������¼������������ addEventListener��һ�ν� useCapture ����Ϊ true���ڶ����ٽ�useCapture ����Ϊ false�� 
4��priority:int (default = 0) 
�¼������������ȼ��� ���ȼ���һ�������ŵ� 32 λ����ָ���� ����Խ�����ȼ�Խ�ߡ� ���ȼ�Ϊ n �������������������ȼ�Ϊ n -1 ��������֮ǰ�õ����� �������������������������ͬ�����ȼ����������ǵ����˳����д��� Ĭ�����ȼ�Ϊ 0�� 
5��useWeakReference:Boolean (default = false) 
ȷ������������������ǿ���ã����������á� ǿ���ã�Ĭ��ֵ���ɷ�ֹ�����������������������ա� ��������û�д����á�

public function removeEventListener(type:String, listener:Function):void

Used for iPad client local system file operation: create basic directory; 
read file as text; write file; file move to; file copy to; file remove.
******************************************************************************************************************************************* */

var FileOperation = (function () {
    //Create Directory Path
    function CreateDirectory(directory, useCapture) {
        document.addEventListener("deviceready", function () {
            onDeviceReady_CreateDirectory(directory);
        }, useCapture);
    }

    function onDeviceReady_CreateDirectory(directory) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            if (!fileSystem.root.getDirectory(directory)) {
                fileSystem.root.getDirectory(directory, { create: true }, function (dirEntry) {
                    //document.removeEventListener("deviceready",onDeviceReady_CreateDirectory);
                }, ErrorHandler);
            }
        }, ErrorHandler);
    }

    //ReadFileAsText: onDeviceReady Handler
    function onDeviceReady_ReadFileAsText(filePath, onLoadend, onError) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getFile(filePath, null, function (fileEntry) {
                fileEntry.file(function (file) {
                    var FileReader = cordova.require('cordova/plugin/FileReader');
                    var reader = new FileReader();
                    //onloadstart: Called when the read starts..(Function) 
                    //onprogress: Called while reading the file, reports progress (progess.loaded/progress.total)..(Function) -NOT SUPPORTED
                    //onload: Called when the read has successfully completed. (Function) 
                    //onabort: Called when the read has been aborted. For instance, by invoking the abort() method..(Function) 
                    //onerror: Called when the read has failed..(Function) 
                    //onloadend: Called when the request has completed (either in success or failure)..(Function)
                    reader.onloadend = onLoadend;
                    reader.onerror = onError;
                    reader.readAsText(file);
                }, onError);
            }, onError);
        }, ErrorHandler);
    }

    //ReadAndCreateFileAsText: onDeviceReady Handler
    function onDeviceReady_ReadAndCreateFileAsText(filePath, onLoadend, onError) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
                fileEntry.file(function (file) {
                    var FileReader = cordova.require('cordova/plugin/FileReader');
                    var reader = new FileReader();
                    //onloadstart: Called when the read starts..(Function) 
                    //onprogress: Called while reading the file, reports progress (progess.loaded/progress.total)..(Function) -NOT SUPPORTED
                    //onload: Called when the read has successfully completed. (Function) 
                    //onabort: Called when the read has been aborted. For instance, by invoking the abort() method..(Function) 
                    //onerror: Called when the read has failed..(Function) 
                    //onloadend: Called when the request has completed (either in success or failure)..(Function)
                    reader.onloadend = onLoadend;
                    reader.onerror = onError;
                    reader.readAsText(file);
                }, ErrorHandler);
            }, ErrorHandler);
        }, ErrorHandler);
    }

    //FileWrite: onDeviceReady Handler
    function onDeviceReady_FileWrite(filePath, fileContent, appended, onWriteEnd, onError) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getFile(filePath, { create: true, exclusive: false }, function (fileEntry) {
                fileEntry.createWriter(function (writer) {
                    //onwritestart: Called when the write starts. . (Function) 
                    //onprogress: Called while writing the file, reports progress (progess.loaded/progress.total). (Function) -NOT SUPPORTED
                    //onwrite: Called when the request has completed successfully. (Function) 
                    //onabort: Called when the write has been aborted. For instance, by invoking the abort() method. (Function) 
                    //onerror: Called when the write has failed. (Function) 
                    //onwriteend: Called when the request has completed (either in success or failure). (Function)
                    writer.onwriteend = onWriteEnd;
                    writer.onerror = onError;
                    if (appended) {
                        writer.seek(writer.length);
                        writer.write("##-##-##" + fileContent);
                    }
                    else {
                        writer.seek(0);
                        writer.write(fileContent, false);
                    }
                }, ErrorHandler);
            }, ErrorHandler);
        }, ErrorHandler);
    }

    //FileMoveTo: onDeviceReady Handler
    function onDeviceReady_FileMoveTo(filePath, parentPath, successHandle, failedHandle) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            //File move to parentPath
            var onGetDirectoryWin = function (parentDirectory) {
                fileSystem.root.getFile(filePath, { create: true, exclusive: false },
                                        function (fileEntry) {
                                            var fileName = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                                            fileEntry.moveTo(parentDirectory, fileName, successHandle, failedHandle);
                                        }, ErrorHandler);
            }
            fileSystem.root.getDirectory(parentPath,
                                        { create: true, exclusive: false },
                                        onGetDirectoryWin,
                                        failedHandle);

        }, ErrorHandler);
    }

    //FileCopyTo: onDeviceReady Handler
    function onDeviceReady_FileCopyTo(filePath, parentPath, successHandle, failedHandle) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            //File Copy to parentPath
            var onGetDirectoryWin = function (parentDirectory) {
                fileSystem.root.getFile(filePath, { create: true, exclusive: false },
                                        function (fileEntry) {
                                            var fileName = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                                            fileEntry.copyTo(parentDirectory, fileName, successHandle, failedHandle);
                                        },
                                        ErrorHandler);
            }

            fileSystem.root.getDirectory(parentPath,
                                        { create: true, exclusive: false },
                                        onGetDirectoryWin,
                                        failedHandle);
        }, ErrorHandler);
    }

    //FileRemove: onDeviceReady Handler
    function onDeviceReady_FileRemove(filePath, successHandle, failedHandle) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            //File remove from the local system
            var onGetFileWin = function (fileEntry) {
                fileEntry.remove(successHandle, failedHandle);
            }
            fileSystem.root.getFile(filePath, { create: true, exclusive: false }, onGetFileWin, failedHandle);
        }, ErrorHandler);
    }

    var remove_length = 0;
    //RemoveFiles: onDeviceReady Handler
    function onDeviceReady_RemoveFiles(directory, successHandle, failedHandle) {
        remove_length = 0;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
		function (fileSystem) {
		    fileSystem.root.getDirectory(directory, { create: false, exclusive: false },
				function (dirEntry) {
				    var directoryReader = dirEntry.createReader();
				    directoryReader.readEntries(function (entries) {
				        remove_length = entries.length;
				        for (var i = 0; i < entries.length; i++) {
				            var fileEntry = entries[i];
				            fileEntry.remove(successHandle, failedHandle);
				        }
				    }, ErrorHandler);
				}, ErrorHandler);
		}, ErrorHandler);
    }

    var backup_length = 0;
    function onDeviceReady_BackupFiles(fromDirectory, toDirectory, successHandle, failedHandle) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
		function (fileSystem) {
		    var _toDirectory = fileSystem.root.getDirectory(toDirectory, { create: true, exclusive: false });
		    fileSystem.root.getDirectory(fromDirectory, { create: false, exclusive: false },
				function (dirEntry) {
				    var directoryReader = dirEntry.createReader();
				    directoryReader.readEntries(function (entries) {
				        backup_length = entries.length;
				        for (var i = 0; i < entries.length; i++) {
				            var fileEntry = entries[i];
				            var fileName = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
				            fileEntry.moveTo(_toDirectory, fileName, successHandle, failedHandle);
				        }
				    }, ErrorHandler);
				}, ErrorHandler);
		}, ErrorHandler);
    }

    function ErrorHandler(error) {
        var msg = 'An error occured: ';
        /*
        FileError.NOT_FOUND_ERR
        FileError.SECURITY_ERR
        FileError.ABORT_ERR
        FileError.NOT_READABLE_ERR
        FileError.ENCODING_ERR
        FileError.NO_MODIFICATION_ALLOWED_ERR
        FileError.INVALID_STATE_ERR
        FileError.SYNTAX_ERR
        FileError.INVALID_MODIFICATION_ERR
        FileError.QUOTA_EXCEEDED_ERR
        FileError.TYPE_MISMATCH_ERR
        FileError.PATH_EXISTS_ERR
        */
        switch (error.code) {
            case FileError.NOT_FOUND_ERR:
                msg += 'File or directory not found';
                break;
            case FileError.NOT_READABLE_ERR:
                msg += 'File or directory not readable';
                break;
            case FileError.PATH_EXISTS_ERR:
                msg += 'File or directory already exists';
                break;
            case FileError.TYPE_MISMATCH_ERR:
                msg += 'Invalid filetype';
                break;
            default:
                msg += 'Unknown Error';
                break;
        }
        sAlert("Error Code: " + error.code + ". " + msg);
    }

    return {
        CreateBasicDirectory: function () {//Create Basic Directory for Cisco-iPad system
            CreateDirectory("DataSource", true);
            CreateDirectory("DataSource_Backups", true);
            CreateDirectory("Photos", true);
            CreateDirectory("SurveyData", true);
            CreateDirectory("SurveyDataBak", true);
            CreateDirectory("Backups", true);
            CreateDirectory("SurveyPhotos", true);
            CreateDirectory("SurveySketchs", true);
            CreateDirectory("SurveySignature", true);
        },
        ReadFileAsText: function (filePath, onLoadEnd, onError, useCapture) {//Read local system file by the filePath
            document.addEventListener("deviceready", function () {
                onDeviceReady_ReadFileAsText(filePath, onLoadEnd, onError);
            }, useCapture);
        },
        ReadAndCreateFileAsText: function (filePath, onLoadEnd, onError, useCapture) {//Read local system file from filePath;if the file is not exits,create the file
            document.addEventListener("deviceready", function () {
                onDeviceReady_ReadAndCreateFileAsText(filePath, onLoadEnd, onError);
            }, useCapture);
        },
        FileWrite: function (filePath, fileContent, appended, onWriteEnd, onError, useCapture) {//Write infomation to local system file
            document.addEventListener("deviceready", function () {
                onDeviceReady_FileWrite(filePath, fileContent, appended, onWriteEnd, onError);
            }, useCapture);
        },
        FileMoveTo: function (filePath, parentPath, successHandle, failedHandle, useCapture) {//Move file from the local system by filePath
            document.addEventListener("deviceready", function () {
                onDeviceReady_FileMoveTo(filePath, parentPath, successHandle, failedHandle);
            }, useCapture);
        },
        FileCopyTo: function (filePath, parentPath, successHandle, failedHandle, useCapture) {//Copy file from the local system by filePath
            document.addEventListener("deviceready", function () {
                onDeviceReady_FileCopyTo(filePath, parentPath, successHandle, failedHandle);
            }, useCapture);
        },
        FileRemove: function (filePath, successHandle, failedHandle, useCapture) {//Remove file from the local system by filePath
            document.addEventListener("deviceready", function () {
                onDeviceReady_FileRemove(filePath, successHandle, failedHandle);
            }, useCapture);
        },
        RemoveFiles: function (directory, successHandle, failedHandle, useCapture) {//Remove files from directory path
            document.addEventListener("deviceready", function () {
                onDeviceReady_RemoveFiles(directory, successHandle, failedHandle);
            }, useCapture);
        },
        GetRemoveLength: function () {//Return remove directory files length
            return remove_length;
        },
        BackupFiles: function (fromDirectory, toDirectory, successHandle, failedHandle, useCapture) {
            document.addEventListener("deviceready", function () {
                onDeviceReady_BackupFiles(fromDirectory, toDirectory, successHandle, failedHandle);
            }, useCapture);
        },
        GetBackupLength: function () {//Return backup files length
            return backup_length;
        },
        TransferFile: function (fileURI, uploadUri, successHandle, failedHandle, options, useCapture) {//upload file to Cisco-iPad server
            alert("1.fileURI: " + fileURI + "; fileName: " + options.fileName);
            document.addEventListener("deviceready", function () {
                alert("2.");
                var uploadTransfer = new FileTransfer();
                alert("3.");
                uploadTransfer.upload(fileURI, encodeURI(uploadUri), successHandle, failedHandle, options);
                alert("4.");
            }, useCapture);
            alert("5.");
        },
        FileErrorHandler: function (error) {//File Error Handle Function
            ErrorHandler(error);
        },
        ReadFileForMainPage: function () {//Used for iPad client : used this function before goto MainPage.html
            var readLength = 0;
            var fileCheckingCategroy = "DataSource/CheckingCategroy.txt";
            this.ReadFileAsText(fileCheckingCategroy, function (evt) {
                readLength += 1;
                window.localStorage.all_checking_category = $.trim(evt.target.result);
            }, function () {
                sAlert("get checking categroy failed from the file.");
            }, true);

            var fileCheckingLevel = "DataSource/CheckingLevel.txt";
            this.ReadFileAsText(fileCheckingLevel, function (evt) {
                readLength += 1;
                window.localStorage.all_checking_level = $.trim(evt.target.result);
            }, function () {
                sAlert("get checking level failed from the file.");
            }, true);

            var fileSector = "DataSource/Sector.txt";
            this.ReadFileAsText(fileSector, function (evt) {
                readLength += 1;
                window.localStorage.all_sector = $.trim(evt.target.result);
            }, function () {
                sAlert("get sector failed from the file.");
            }, true);

            var fileSite = "DataSource/Site.txt";
            this.ReadFileAsText(fileSite, function (evt) {
                readLength += 1;
                window.localStorage.all_site = $.trim(evt.target.result);
            }, function () {
                sAlert("get site address failed from the file.");
            }, true);

            var nSeconds_GetBasic = 0;
            var iID_GetBasic = setInterval(function () {
                nSeconds_GetBasic += 2;
                if (readLength == 4 || iID_GetBasic > 20) {
                    nSeconds_GetBasic = 0;
                    clearInterval(iID_GetBasic);
                }
            }, 500);
        }
    }
})();