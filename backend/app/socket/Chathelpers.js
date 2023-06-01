//let uuidv4 = require("uuid/v4");
const { v4: uuidv4 } = require('uuid');

let ImageManager = require("../helpers/ImageManager");
let fs = require("fs");
const { calulateAttachmentSize } = require('../helpers/UserHelper');

 const Chathelpers = {
     saveMessage: async function(
    userid,
    roomid,
    msg,
    type="text",
    base64data="",
    ext="",
    duration,
    size,
    filename
  ) {
    //console.log("save message", userid, roomid, msg);
    let message = new Message();
    message.from = userid;
    message.room = roomid;
    message.text = msg;
    message.type = type;
    message.duration = duration;
    message.size = size
    message.filename = filename
    // if(type!="text"){
    //     message.filename =  await ImageManager.uploadimagebase64row(base64data,type=="image"?"png":"mp3")
    // }
    if (type!="text") {
      if (type === "image") {
        message.filename = await ImageManager.uploadimagebase64row(filename, base64data, ext, type)
      } else if (type === "voice") {
        message.filename = await ImageManager.uploadimagebase64row(filename, base64data, "mp3")
      }  else if (type === "file") {
        message.filename = await ImageManager.uploadimagebase64row(filename, base64data, ext)
      }
      // size = message.size =  calulateAttachmentSize(base64data)
    }
    await message.save();
    return message;
  },


  prepareRoomMessage: async function(room,userid) {
      const users = room.users;
      let fullpicture = _config("app.imageurl")+"/";
      if(!room.isgroup && users.length>1){
          const chatwith = users.filter(i=>i._id!=userid)[0]
          room.title = chatwith.username
          room.recipientid = chatwith._id;
          fullpicture +=chatwith.picture;

      }else{
          room.recipientid = "";
          room.userlist=[];
          fullpicture +="group.png";
      }

      room.fullpicture = fullpicture
      room.roomid=room._id;
      let messages = await Message.find({ room: room._id }).sort({ $natural: -1 }).lean({virtuals:true}).limit(10).exec();
      const countmessages = await Message.countDocuments({ room: room._id }).exec();

      if(countmessages>messages.length){
          let loadmoremsg = await Message.createLoadMore(room._id);
          messages.push(loadmoremsg);
      }
      room.messages = messages.reverse();
      // add load more message
      room.lastmsg=messages.length>0 ?messages[messages.length-1].text:" ";
      room.lastmsgtime=messages.length>0 ?messages[messages.length-1].createdAt:" ";
      let roominfo = await RoomPin.findOne({user:userid,room:room._id}).exec()
      room.pin = !!roominfo;
      return room;
  },

  saveRoom: async function(senderid, managerid, title = "", projectid) {

      let roominfo  = await Room.findOne({
                 $and: [
                     { users: { "$all" : [senderid]} },
                     { manager: { "$all" : [managerid]} }
                 ]
             }).populate("users manager").lean({virtuals:true}).exec();


      if(!roominfo){
          roominfo = new Room();
          roominfo.title = title;
          roominfo.users = [senderid];
          roominfo.manager = [managerid];
          roominfo.project = [projectid]
          await roominfo.save();
          console.log("room created")
      }else{
          console.log("room alreadyfound")
          return roominfo;
      }

    return await Room.findById(roominfo._id).populate("users manager").lean({virtuals:true}).exec();
  },

    createSystemMessage: async function(roomid, msg) {
        console.log("createSystemMessage ", roomid, msg);
        let message = new Message();
        message.room = roomid;
        message.text = msg;
        message.system = true;
        await message.save();
        return message;
    },


     addToRoom: async function(userid, roomid) {

    let room = await Room.findById(roomid).exec();
    if (room) {
      let users = room.users;

        console.log("addToRoom room ",users);
      const found = users.find(element => {
        return element == userid;
      });
      if (!found) {
        users.push(userid);
        room.users = users;
      }else{
        console.log("already found ")
      }
    }
    await room.save();

    console.log("user added to room " + room.title);
    return room._id;
  },

     deleteMsg: async function(msgid) {
         let msg = await Message.findById(msgid).exec();
         if (msg) {
             await msg.remove();
         }
     }
};


module.exports = Chathelpers
