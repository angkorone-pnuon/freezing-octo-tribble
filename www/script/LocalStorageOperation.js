/* ********************************************************************************************************************************************
Used for iPad client to Clear Local System localStorage
******************************************************************************************************************************************** */

var LocalStorageOperation = (function () {
    return {
        clearAllOfLocalStorage: function () {//Clear all local storage in this local system
            var storage = window.localStorage;
            for (var i = 0; i < storage.length; i++) {
                var key = storage.key(i);
				window.localStorage[key] = null;
            }
        },
        clearLocalStorage: function (storageName) {//Clear local storage by storage name
			var storage = window.localStorage;
            for (var i = 0; i < storage.length; i++) {
                if(storage.key(i) == storageName) {
					window.localStorage[storageName] = null;
					break;
				}				
            }
        },
        clearLocalStorage_MainPage: function () {//Clear local storage in MainPage.html
            /*
            In the index.html & download.html,there will create the localStorage: this localStorages can't clear
            login_user & app_version & question_version
		
            In main page,there will create the localStorages: this localStorage should clear
            categoryList & checkingCategory & checkingLevel & checkingSector & checkingAddress
            sumarry_id & sumarry_date & onsiteSurveySections & onsiteSurveySectionStatus
            individualSurveySections & individualSurveySectionStatus
            */
            var storage = window.localStorage;
            for (var i = 0; i < storage.length; i++) {
                var key = storage.key(i);
                switch (key) {
                    case "login_user":
                    case "app_version":
                    case "question_version":
                    case "all_checking_category":
                    case "all_checking_level":
                    case "all_sector":
                    case "all_site":
                        break;
                    default:
						window.localStorage[key] = null;
                        break;
                }
            }
        },
        clearLocalStorage_ActiveEO: function () {//Clear local storage in ActiveEOList.html
            /* 
            In activeEo page,there will create the localStorage: EOentry & finishedEO.
            The EOentry will be used by the page IndividualSurveyData.html, so it should be clear in this page.
		
            The finishedEO can't be clear,it's used for record the eo who is finished.
            And when we start the next individual survey there will be use the localStorages individualSurveySections and individualSurveySectionStatus &individualSurveyResult 
            so there will change the status of individualSurveySectionStatus and clear individualSurveyResult
            * */
            var storage = window.localStorage;
            for (var i = 0; i < storage.length; i++) {
                var key = storage.key(i);
                switch (key) {
                    case "EOentry":
                    case "individualSurveyResult":
                    case "active_employee":
						window.localStorage[key] = null;
                        break;
                    case "individualSurveySectionStatus":
                        var surveySectionStatus = JSON.parse(window.localStorage.getItem("individualSurveySectionStatus"));
                        for (var index = 0; index < surveySectionStatus.individualSurveySectionStatus.length; index++) {
                            surveySectionStatus.individualSurveySectionStatus[index].question_section_isdone = "0";
                            surveySectionStatus.individualSurveySectionStatus[index].question_section_flag_no = "0";
                            surveySectionStatus.individualSurveySectionStatus[index].question_section_display = "none";
                        }
                        window.localStorage.individualSurveySectionStatus = JSON.stringify(surveySectionStatus);
                        break;
                    default:
                        break;
                }
            }
        },
        clearLocalStorage_Interviewee: function () {//Clear local storage in  ActiveIntervieweeList.html
            //TODO
        }
    }
})();