const moment = require('moment');

function formatMessage(username, text){
    return {
        username,
        text,
        time:moment().format('MMM D , h:mm a')
    }
}

module.exports = formatMessage;