/**
 * Date Module
 */

// Exports date formatted: DayOfWeek, Month Day of Month
// Example: Sunday, May 1
exports.getDateWithDay = () => {
    const currentDate = new Date();
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };

    return currentDate.toLocaleDateString("en-US", options);
}


// Exports only Day of Week
// Example: Sunday
exports.getDayOfWeek = () => {
    const currentDate = new Date();
    const options = {
        weekday: 'long',
    };

    return currentDate.toLocaleDateString("en-US", options);
}

// Exports formatted date: Month, Day, Year
// Example: May 1, 2022
exports.getDate = () => {
    const currentDate = new Date();
    const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    return currentDate.toLocaleDateString("en-US", options);
};