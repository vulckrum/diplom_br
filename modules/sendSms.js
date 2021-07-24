const config = require('../config.json');
const request = require('request');



function sendSms(phone,text){
    //https://sms.ru/sms/send?api_id=2467B670-EE5A-9442-9099-192CDF16A26D&to=380971159596&msg=hello
    //https://sms.ru/sms/send?api_id=${config.smsApiKey}&to=${phone}&msg=${text}

    request(`https://sms.ru/sms/send?api_id=${config.smsApiKey}&to=${phone}&msg=${text}`, { json: false }, (err, res, body) => {

      });

}


module.exports.sendSms = sendSms