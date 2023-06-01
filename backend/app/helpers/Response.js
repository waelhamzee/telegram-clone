module.exports = {

    ok: function (res, data = undefined) {
        let response = {};
        response.data = data;
        response.status = 200;
        response.success = true;
        return res.json(response);
    },
    notOk: function (res, message = undefined) {
        let response = {};
        response.message = message; // string
        response.status = 200;
        response.success = false;
        return res.json(response);
    },
    notOkWithOption: function (res, message = undefined,key,value) {
        let response = {};
        response.message = message;
        response.status = 200;
        response.success = false;
        response[key] =value;
        return res.json(response);
    },


};
