var sAlertClose = false;
var msgTitle = "Compliance Survey";

function sAlert(message) {
    navigator.notification.alert(message, function () { }, msgTitle);
}

function sConfirm(message, confirmCallback) {
    navigator.notification.confirm(message, confirmCallback, msgTitle)
}
		