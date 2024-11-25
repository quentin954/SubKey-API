const addDurationToDate = (date, durationSeconds) => {
    const newDate = new Date(date);
    newDate.setSeconds(newDate.getSeconds() + durationSeconds);
    return newDate;
};

module.exports = { addDurationToDate };