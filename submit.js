var dateWasManuallySet = false;

// html elements
var storeElem = document.getElementById('submit-store');
var shiftElem = document.getElementById('submit-shift');
shiftElem.addEventListener('change', setTodayToYesterdayIf3rdShift);
var dateElem = document.getElementById('submit-date');
dateElem.addEventListener('change', () => {
    dateWasManuallySet = true;
});

function jsDateToHtmlDate(jsdate) {
    var day = String(jsdate.getDate()).padStart(2, '0');
    var month = String(jsdate.getMonth() + 1).padStart(2, '0');
    var year = jsdate.getFullYear();
    return year + '-' + month + '-' + day;
}

// Handles timezone discrepencies from passing a date as a string
// when making a Date object (ex "2023-11-21")
// This function takes a YYYY-MM-DD format to work correctly
function htmlDateToJsDate(htmldate) {
    vals = htmldate.split('-', 3);
    var year = vals[0];
    var month = vals[1];
    var day = vals[2];
    return new Date(year, month, day);
}

function setDateElemToToday() {
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();

    dateElem.value = year + '-' + month + '-' + day;
    
    // if 3rd shift, try to correct the time to the previous day, but only if it's late into the shift (early in the morning)
    if (today.getHours() < 12) {
        setTodayToYesterdayIf3rdShift();
    }
}

function initSubmitStuff() {
    if (!dateWasManuallySet) {
        setDateElemToToday();
    }
}

function isDateToday() {
    var today = new Date();
    var formatted = jsDateToHtmlDate(today);
    console.log(formatted);
    console.log(dateElem.value);
    return dateElem.value === jsDateToHtmlDate(today);
}

function subtractOneDay(dateInputValue) {
    var date = htmlDateToJsDate(dateInputValue);
    date.setDate(date.getDate() - 1);
    return jsDateToHtmlDate(date);
}

// If on 3rd shift it will set the date to the previous day
function setTodayToYesterdayIf3rdShift() {
    if (shiftElem.value === '3rd' && isDateToday() && !dateWasManuallySet) {
        
        dateElem.value = subtractOneDay(dateElem.value);
        console.log("yep");
    }
    console.log("nope");
}