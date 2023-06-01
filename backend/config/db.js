module.exports = {

    /**
     * The database connection string
     */


   url: 'mongodb://localhost/telegram_clone',
   // url: 'mongodb://db_gradehero:dbgfe2dwdwdwvx2143radehero@143.244.161.79/db_gradehero',


    options: {

        /**
         * This is a mongoose-specific option (not passed to the MongoDB driver) that opts
         * in to mongoose 4.11's new connection logic. If you are writing a new application,
         * you should set this to true.
         */

        useUnifiedTopology: true,
        useNewUrlParser: true,
        // useCreateIndex: true,
        // poolSize: 1000,
        /**
         * Extra mongodb connection options
         * @url http://mongodb.github.io/node-mongodb-native/2.2/api/MongoClient.html#connect
         */
    }
};
