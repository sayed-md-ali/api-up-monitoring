/*
 * Title: notification library
 * Description: Important utility functions
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/21/2020
 *
 */

// dependencies
const https = require('https');
const querystring = require('querystring');
const {twilio} = require('./environments');

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
    
    if(userPhone && userMessage ){
        let payload ={
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMessage
        }
        let stringData = querystring.stringify(payload);

        const requestObject ={
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSID}/Messages.json`,
            auth: `${twilio.accountSID}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const req = https.request(requestObject, (res)=>{
            if(res.statusCode === 200 || 201){
                callback(false)
            }else{
                console.log(`there is a problem with ${res.statusCode}`)
            }
        })

        req.on('error', (err)=>{
            callback(err)
        })
        req.write(stringData);
        req.end()

    }else{
        callback('Given parameters were missing or invalid');
    }

}

module.exports = notifications;