module.exports = {

    /**
     * The runtime "environment" of your app is either typically
     * 'development' or 'production'.
     */

    env: process.env.NODE_ENV || 'development', // production

    /**
     * The application base url
     */

    url: 'http://localhost:3061',

    /**
     * The `port` setting determines which TCP port your app will be deployed on.
     */

    port: process.env.PORT || 3061,

    /**
     * The application base url
     */

    imageurl: 'http://localhost:3061/upload',

    /**
     * Enabling trust proxy will have the following impact:
     * The value of req.hostname is derived from the value set in the X-Forwarded-Host header, which can be set by the client or by the proxy.
     * X-Forwarded-Proto can be set by the reverse proxy to tell the app whether it is https or http or even an invalid name. This value is reflected by req.protocol.
     * The req.ip and req.ips values are populated with the list of addresses from X-Forwarded-For.
     */

    trust_proxy: true,

    /**
     * The x-powered-by header key
     */

    x_powered_by: 'sam',

    /**
     * View engine to use for your app's server-side views
     */

    view_engine: "ejs",

    /**
     * The views directory path
     */

    views: require('path').join(__basepath, 'app/views'),

    /**
     * The api url prefix
     */

    api_prefix: "api",

    /**
     * The upload folder path
     */

    upload_path: "upload/",

    local_upload_path: "public/upload/",
    websiteurl: 'http://localhost:3061',

    pagination_limit: 10,
    csvuploadpath : "./",
    // gmail login info for sending mail
    gmailfrom : "gradeheroapp@gmail.com",
    gmailpass: "qwerty!123",
    // secret for session token
    secret : "893c53d48ecf4d609bcec71b220f2fff",


    // push android
    androidsecret : "AAAAodorcNg:APA91bH7Gi2U-D9TCjWdB1NAIYEhj7YdCoDgXV9b0rBh15KKbsCIa4om2uSvsyLYlEeOOkwkn7iI1ZTgaODTgOO8_i9oHlDfb-icpH13WTMHO_T7JkAHlSOF-dizUO3MTsyy4NsFuchM",

    // push ios,
    keyId : 'JW4BZQG758',
    teamId : 'B3JGZ4R98Q',
    topic : '', // appbundle




};

