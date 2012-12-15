//-------------------------------------------------------------------------------
// Dependencies
//-------------------------------------------------------------------------------

//@Export('DateUtil')

var bugpack = require('bugpack');


//-------------------------------------------------------------------------------
// BugPack
//-------------------------------------------------------------------------------


//-------------------------------------------------------------------------------
// Declare Class
//-------------------------------------------------------------------------------

var DateUtil = {};


//-------------------------------------------------------------------------------
// Static Variables
//-------------------------------------------------------------------------------

/**
 * @enum {String}
 */
DateUtil.monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

//-------------------------------------------------------------------------------
// Static Methods
//-------------------------------------------------------------------------------

/**
 * @param {Date} date
 * @return {string}
 */
DateUtil.getAMPM = function(date) {
    if (date.getHours() < 12) {
        return "AM";
    }
    return "PM";
};

/**
 * @param {Date} date
 * @return {string}
 */
DateUtil.getHour12HourClock = function(date) {
    var hours = date.getHours();
    if (hours === 0) {
        return 12;
    } else if (hours <= 12) {
        return hours;
    }
    return (hours - 12);
};

/**
 * @param {Date} date
 * @return {string}
 */
DateUtil.getMonthName = function(date) {
    return DateUtil.monthNames[date.getMonth()];
};

/**
 * @param {Date} fromDate
 * @param {Date} toDate
 * @return {number}
 */
DateUtil.getNumberMinutesAgo = function(fromDate, toDate) {
    var fromUTC = fromDate.getTime();
    var toUTC = toDate.getTime();
    var numberMinutesAgo = Math.floor((toUTC - fromUTC) / (1000 * 60));
    return numberMinutesAgo;
};


//-------------------------------------------------------------------------------
// Exports
//-------------------------------------------------------------------------------

bugpack.export(DateUtil);
