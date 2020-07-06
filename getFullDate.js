module.exports = {
    getFullDate: function(){
        let getFullDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

        return getFullDate;
    }
};
