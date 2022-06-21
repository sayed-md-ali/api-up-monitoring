/*
 * Title: notification library
 * Description: Important utility functions
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/21/2020
 *
 */

// dependencies
const https = require('https');


// module scaffolding

const notifications = {}

//send sms to using twillo api

notifications.sendTwilioSms = (phone, message, callback) =>{
    //input validation

    const userPhone = typeof (phone) === 'string' 
                        && phone.trim().length === 11 
                        ? phone
                        : false;
    const userMessage = typeof (message) === 'string'
                        && message.trim().length > 0 
                        && message.trim().length <1600
                        ? message
                        :false;
            

}

module.exports = notifications;