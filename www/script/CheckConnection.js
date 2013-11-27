var CheckConnection = (function () {
    //basic servver config
    //var cisco_interface_server = 'http://cpesp.certissecurity.com/IPad/MobileInterface/Interface.aspx';
    var cisco_interface_server = 'http://192.168.17.90:8098/MobileInterface/Interface.aspx';
    var upload_photo_path = 'http://192.168.17.90:8098/UploadFile.aspx';

    var connect_server = false;
    var connect_server_end = false;
    var time_out;
    var xmlHttpConnect = GetXmlHttpObject();

    //Get xml http object
    function GetXmlHttpObject() {
        var xmlHttp = null;
        try {
            // Firefox, Opera 8.0+, Safari
            xmlHttp = new XMLHttpRequest();
        }
        catch (e) {
            // Internet Explorer
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        return xmlHttp;
    }

    //check the iPad client whether connect to the internet
    function checkClientConnectInternet() {
        var networkState = navigator.connection.type;
        var states = {};
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.NONE] = 'No network connection';
        //sAlert("Connection Type: " + states[networkState]);
        var connectInternet = states[networkState] == states[Connection.NONE] ? false : true;
        return connectInternet;
    }
    function connectToServer(xmlhttp, _method, _url, _param, _callback) {
        if (typeof xmlhttp == 'undefined') return;
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                _callback(xmlhttp);
            }
        }
        xmlhttp.open(_method, _url, true);
        xmlhttp.send(null);
    }
    function connected(request) {
        connect_server = request.responseText == "Interface Address Access Success!";
        connect_server_end = true;
        if (time_out) {
            clearTimeout(time_out);
        }
    }
    function connecttoFail() {
        if (xmlHttpConnect) {
            xmlHttpConnect.abort();
        }
        connect_server = false;
        connect_server_end = true;
        clearTimeout(time_out);
    }

    //connect to Cisco iPad Server

    //connect to Cisco iPad Server
    function connect_Cisco_iPad_Server() {
        if (xmlHttpConnect) {
            if (checkClientConnectInternet) {
                connectToServer(xmlHttpConnect, "POST", cisco_interface_server, null, connected);
                time_out = setTimeout(connecttoFail, 10000);
            }
            else {
                connect_server = false;
                connect_server_end = true;
                //sAlert("The client can not connect to the internet.");
            }
        }
        else {
            connect_server = false;
            connect_server_end = true;
            sAlert("Init xmlhttprequest fail.");
        }
    }

    var connectCiscoServer = connect_Cisco_iPad_Server();

    var nSceonds_CheckConnect = 0;
    var iID_CheckConnect = 0;

    return {
        CiscoInterfaceServer: function () {
            return cisco_interface_server;
        },
        UploadPhotoPath: function () {
            return upload_photo_path;
        },
        XmlHttpConnect: function () {
            //return xmlHttpConnect;
            return GetXmlHttpObject();
        },
        ConnectServer: function () {//checkConnection use for the iPad client
            return connect_server;
        },
        ajaxFileRequest: function (filePath, handleStateChange, bAsync) {//Ajax read file information
            if (xmlHttpConnect == null) {
                //sAlert('您的浏览器不支持Ajax！');
                sAlert('Your browser does not support Ajax！');
                return
            }
            xmlHttpConnect.open("GET", filePath, bAsync);
            xmlHttpConnect.onreadystatechange = handleStateChange;
            xmlHttpConnect.setRequestHeader("CONTENT-TYPE", "application/json");
            xmlHttpConnect.send();
        },
        ajaxHttpRequest: function (xmlHttp, responseBody, handleStateChange, bAsync, timeout, onTimeout) { //Ajax httpRequest server information
            if (xmlHttp == null) {
                //sAlert('您的浏览器不支持Ajax！');
                sAlert('Your browser does not support Ajax！');
                return
            }
            xmlHttp.open("POST", cisco_interface_server, bAsync);
            xmlHttp.timeout = timeout;
            xmlHttp.ontimeout = onTimeout;
            xmlHttp.onreadystatechange = handleStateChange;
            xmlHttp.setRequestHeader("CONTENT-TYPE", "application/json");
            xmlHttp.send(responseBody);
        },
        ajax: function (xmlhttp, _method, _url, _param, _callback) { //Ajax Request
            if (typeof xmlhttp == 'undefined') return;
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    _callback(xmlhttp);
                }
            }
            xmlhttp.open(_method, _url, true);
            if (_method == "POST") {
                xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlhttp.setRequestHeader("Content-Length", _param.length);
                xmlhttp.send(_param);
            }
            else {
                xmlhttp.send(null);
            }
        }
    }
})();