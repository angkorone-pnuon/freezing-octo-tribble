var startX, endX;
var leftLimit = 0;
var optionWidth;
var changeWidth;
var scrollVal = leftLimit;
var pindex = 1;
//var flags;
//var topics;
//var evalId = -1;
//function $$(id) {
//	return document.getElementById(id);
//}

function slLoaded() {
    leftLimit = 0;
    optionWidth = $(".photo_cont").width() - 40;
    $("#slider").css("height", optionWidth * 0.75 + 80);
    changeWidth = optionWidth + 40;
    scrollVal = leftLimit;
    //    $(".canvas_cont").css("width", optionWidth);
    //    $(".canvas_cont").css("height", optionWidth * 0.75);
    changeDisplay();

    document.getElementById("slider").addEventListener("touchstart",
			touchStart, false);
    document.getElementById("slider").addEventListener("touchmove", touchMove,
			false);
    document.getElementById("slider").addEventListener("touchend", touchEnd,
			false);

    function touchStart(event) {

        var touch = event.touches[0];
        startX = touch.pageX;
        endX = 0;
    }

    function touchMove(event) {
        var touch = event.touches[0];
        endX = (startX - touch.pageX);
    }

    function leftMove() {
        var offset = scrollVal - changeWidth;
        var CanLength = $(".canvas_cont").length - 1;
        if (offset >= leftLimit - CanLength * changeWidth) {
            $("#slider").css("margin-left", offset + "px");
            scrollVal = scrollVal - changeWidth;
            pindex++;
            changeDisplay();

        }
    }

    function rightMove() {
        var offset = scrollVal + changeWidth;
        if (offset <= leftLimit) {
            $("#slider").css("margin-left", offset + "px");
            scrollVal = scrollVal + changeWidth;
            pindex--;
            changeDisplay();

        }
    }

    function touchEnd(event) {
        if (endX > 0) {
            leftMove();
        } else if (endX < 0) {
            rightMove();
        }
    }
}

window.onload = slLoaded;


function changeDisplay() {
    var PanLength = $(".canvas_cont").length;
    if (PanLength == 0 || pindex <= 1) {
        $("#left_move").css("display", "none");
    }
    else {
        $("#left_move").css("display", "block");
    }

    if (PanLength == 0 || pindex >= PanLength) {
        if (PanLength > 0 && pindex > PanLength) {
            moveLeft();
        }
        $("#right_move").css("display", "none");
    }
    else {
        $("#right_move").css("display", "block");
    }
}

function moveLeft() {
    var offset = scrollVal + changeWidth;
    if (offset <= leftLimit) {
        $("#slider").css("margin-left", offset + "px");
        scrollVal = scrollVal + changeWidth;
        pindex--;
        changeDisplay();
    }
}
function moveRight() {
    var offset = scrollVal - changeWidth;
    var CanLength = $(".canvas_cont").length - 1;
    if (offset >= leftLimit - CanLength * changeWidth) {
        $("#slider").css("margin-left", offset + "px");
        scrollVal = scrollVal - changeWidth;
        pindex++;
        changeDisplay();
    }
}

