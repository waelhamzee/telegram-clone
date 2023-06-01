let Response = require("../helpers/Response")
let Message = require("../models/Message");

module.exports = {

         /**
      * Get Rooms
      * @param req
      * @param res
      * @returns {*}
      */

      listrooms : async function( req , res ) {
        const data = await Room.find({ users: { $in: [req.userid] } }).populate("users").exec()
        return Response.ok(res, data)
    },

      /**
      * Get Room Messages
      * @param req
      * @param res
      * @returns {*}
      */


    getroommessages: async function(req,res) {
        const {roomid, counter} = req.body
        let messages 
        let count = await Message.find({room : roomid}).countDocuments() - counter
        if (count > 0) {
            messages = await Message.find({room : roomid}).skip(count).lean().exec()
        } else {
            messages = await Message.find({room : roomid}).lean().exec()
        }
        return Response.ok(res,messages)
    },


      /**
      * Get Last Room Message
      * @param req
      * @param res
      * @returns {*}
      */


    getlastmessage : async function(req,res) {
        const roomid = req.body.roomid 
        const lastmessage = await Message.findOne({room:roomid}).sort({ createdAt: -1 })
        return Response.ok(res,lastmessage)
    },



     /**
      * Read Room Messages
      * @param req
      * @param res
      * @returns {*}
      */


      readmessages : async function(req,res) {
        const {roomid, id} = req.body;
        const unreadMessages = await Message.find({room:roomid, from : id, read : false}).exec()
        // if (!unreadMessages.length) return
        console.log(unreadMessages.length);
        for (let i =0; i<unreadMessages.length; i++) {
          unreadMessages[i].read = true 
          await unreadMessages[i].save()
        }        
        return Response.ok(res)
    },

    getunreadcount : async function(req,res) {
        const {roomid, id} = req.body
        let count = await Message.find({room : roomid, read:false, from :id}).countDocuments()
        return Response.ok(res,{count})
    }
};
