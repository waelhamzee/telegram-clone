let jwt = require("jsonwebtoken");
// let UserHelper = require("../helpers/UserHelper");
module.exports = async function (req, res, next) {

    let token = req.headers['token'];
    // const timeout = await UserHelper.getSessionTimeout();
    const timeout = 999999

    console.log("checking jwt..."+req.useragent.isMobile);
    jwt.verify(token, _config("jwt.secret"),
        {expiresIn: timeout}, async function(error, decoded) {

        if (error) return next(error);
            if (!decoded) return res.forbidden();

            const userid = decoded._id;
            
            console.log("user id ...."+userid);
            req.userid = userid;
            next();

    });

};
