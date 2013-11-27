/* *******************************************************************************************************************************************
public function addEventListener(type:String, listener:Function, useCapture:Boolean = false, priority:int = 0, useWeakReference:Boolean = false):void
1、type:String 
事件的类型。
2、listener:Function 
侦听到事件后处理事件的函数。 此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，如以下示例所示： 访问修饰符 function 函数名(evt:Event):void
3、useCapture:Boolean (default = false) 
这里牵扯到“事件流”的概念。侦听器在侦听时有三个阶段：捕获阶段、目标阶段和冒泡阶段。顺序为：捕获阶段（根节点到子节点检查是否调用了监听函数）→目标阶段（目标本身）→冒泡阶段（目标本身到根节点）。此处的参数确定侦听器是运行于捕获阶段、目标阶段还是冒泡阶段。 如果将 useCapture 设置为 true，则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。 如果useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。 要在所有三个阶段都侦听事件，请调用两次 addEventListener，一次将 useCapture 设置为 true，第二次再将useCapture 设置为 false。 
4、priority:int (default = 0) 
事件侦听器的优先级。 优先级由一个带符号的 32 位整数指定。 数字越大，优先级越高。 优先级为 n 的所有侦听器会在优先级为 n -1 的侦听器之前得到处理。 如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。 默认优先级为 0。 
5、useWeakReference:Boolean (default = false) 
确定对侦听器的引用是强引用，还是弱引用。 强引用（默认值）可防止您的侦听器被当作垃圾回收。 弱引用则没有此作用。

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