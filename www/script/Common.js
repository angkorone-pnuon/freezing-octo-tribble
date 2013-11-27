/* ********************************************************************************************************************************************
Create New Guid & Get New Random String & Date().Format & Sort The select.options & Ajax Request
******************************************************************************************************************************************** */
function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
//NewGuid use for the iPad client to Create New Guid
function NewGuid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

//NewGuid use for the iPad client to Create Random String
function GetRandomString(len) {
    len = len || 32;
    //var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

//Date type format to string
Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//Sort select.options by value asc
function sortSelect(oSel) {
    var ln = oSel.options.length;
    var arrVal = new Array();
    var arrTxt = new Array();
    for (var i = 0; i < ln; i++) {
        //arr[i] = oSel.options[i].text;
        arrVal[i] = oSel.options[i].value;
    }
    arrVal.sort();
    // clear all the options from the Select
    for (i = 0; i < arrVal.length; i++) {
        var len = oSel.options.length;
        while (len--) {
            if (oSel.options[len].value == arrVal[i]) {
                arrTxt[i] = oSel.options[len].text;
                oSel.options.remove(len);
            }
        }
    }
    var firstValue = null;
    for (i = 0; i < arrVal.length; i++) {
        if (i == 0) {
            firstValue = JSON.parse('{"id":"' + arrVal[i] + '","value":"' + arrTxt[i] + '"}');
        }
        oSel.add(new Option(arrTxt[i], arrVal[i]));
    }
    return firstValue;
}