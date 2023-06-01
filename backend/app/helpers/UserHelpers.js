let _ = require('lodash');

let Security = require("../helpers/Security");


module.exports =  {

    getSessionTimeout:async function () {
        const data  = await Settings.findOne().lean().exec();
        let timeout = _config("jwt.expires")
        if(data){
            timeout= data.session*60; // return number in seconds
        }
        return parseInt(timeout);
    },

    sendVerificationAccount:async function (phone,activationcode,msg = "Verify Your account , Your activation code is : ") {
        console.log("phone",phone,activationcode);
        return;
        SmsService.sendsms(msg+activationcode,phone);
    },


};
