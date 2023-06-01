//   https://socket.io/docs/emit-cheatsheet/
// const Document = require("../models/Document")
let jwt = require("jsonwebtoken");
//let io = require("socket.io").listen(global.server, {
//  pingInterval: 30000,
//  pingTimeout: 10000
//});

const { Server } = require("socket.io");
const io = new Server(global.server,{
  pingInterval: 30000,
  pingTimeout: 10000,
  maxHttpBufferSize : 1e8,
  cors: {
    origin: "*",
  }
});
let chathelpers = require("./Chathelpers");
// let PushNotification = require("../services/PushNotification");
//io.set('heartbeat interval', 30000);
//io.set('heartbeat timeout', 10000);


io.use(function(client, next) {
  console.log("socket trying to connect...",client.handshake.query.token)
  if (client.handshake.query && client.handshake.query.token) {
    jwt.verify(
      client.handshake.query.token,
      _config("jwt.secret"),
      { expiresIn: _config("jwt.expires") },
      function(error, decoded) {
        if (error) return client.disconnect();
        if (!decoded || decoded.status === 0) client.disconnect();
        client.user = decoded;
       
          User.findById(decoded._id, function(error, user) {
            if (error) return next(new Error("Authentication error"));
            if (!user) return next(new Error("Authentication error"));

            user.lastsocketid = client.id;
            user.save(function(error, user) {
              if (error) next(new Error("Authentication error"));
              next();
            });
          });

      }
    );
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", async client => {
  const userid = client.user._id;
  console.log("connected userid :  " + userid);
  console.log("socket id :  " + client.id);

  //isonline
  let userinfo = await User.findById(userid).exec();
  
  if (userinfo && userinfo._id) {
    userinfo.isonline = true;
    await userinfo.save();
  }

  client.on("join", (roomid) => {
    console.log("im joining hereee");
    client.join(roomid);
  })
  
  client.on("SendMessage", SendMessage);
  client.on("DeleteMessage", DeleteMessage);
  client.on("Calling", Calling);
  client.on("SendRead", MessageRead);
  client.on("usertyping", HandleTyping)
  
  client.on("disconnect", async () => {
    //isonline
     let userinfo = await User.findById(userid).exec();
      userinfo.isonline = false;
      userinfo.lastseen = Date.now()
      await userinfo.save();
      io.emit("messagedisconnected", 'user has disconnected');
  });
});


async function MessageRead(data) {
  console.log(data);
  let roomid = data.roomid
  let from = data.from
  const messages = await Message.find({room : roomid, from : from, read : false}).exec()
  for (let i =0; i< messages.length; i++) {
    messages[i].read = true
    await messages[i].save()
  }
  io.to(roomid).emit("MessageRead", data)
}


function Calling(data, callback) {
  let roomid = data.roomid
  let userid = data.userid
  let username = data.username
  io.emit("CallingReceived", {userid, roomid, username})
  callback({  status: 1 });
}


function HandleTyping(data) {
  let roomid = data.roomid
  io.to(roomid).emit("onusertyping", data)
}


function sendMessageReceived(
  lastsocketid,
  userid,
  roomtitle,
  msg,
  msgid,
  roomid,
  fullpicture,
  system,
  type ="text",
  filename,
  duration,
  size,
  msgdate = Date.now(),
  width,
  height
) {
    let payload = {
      from: userid,
      title: roomtitle, // room title
      text: msg,
      _id: msgid,
      createdAt: msgdate,
      room: roomid,
      fullpicture:fullpicture,
      system:system,
      type : type,
      filename,
      duration,
      size,
      width,
      height
    }
    console.log(payload);
  //  io.sockets.connected[lastsocketid].emit("MessageReceived", payload);
      // check rooom id 
      console.log("in room id b" , roomid);
    io.to(roomid).emit("MessageReceived",payload)
    io.emit("MessageReceivedGlobal", payload)
}

function sendMessageDeleted(
    // lastsocketid,
    msgid,
    roomid,
    userid
) {
  // if (io.sockets.connected[lastsocketid] != null) {
    /* sending to all user in  room(channel) except sender */
    let payload = {
      userid : userid,
      msgid: msgid,
      roomid: roomid,
    };
    console.log(payload);
    // io.sockets.connected[lastsocketid].emit("MessageDeleted", payload);
    // io.emit("MessageDeleted",payload)
    io.to(roomid).emit('MessageDeleted',payload );
  // }
}




async function DeleteMessage(message, callback) {
  console.log("DeleteMessage", message);
  let messgid = message.id;
  let roomid = message.roomid;
  let userid = this.user._id;
  let  roominfo = null
  if(roomid && roomid.length>1){
    roominfo = await Room.findById(roomid).lean().exec();
  }

  this.join(roomid);

  await chathelpers.deleteMsg(messgid);
  let recepientlist = roominfo.users ? roominfo.users.filter(i=>i.toString()!=userid.toString()):[]
  if (recepientlist.length === 0) recepientlist = roominfo.manager

  const fromuserinfo = await User.findById(userid).lean().exec();
  for (let i = 0, len = recepientlist.length; i < len; i++) {
    let recipientinfo = await User.findById(recepientlist[i])
        .lean()
        .exec();
    if (!recipientinfo) recipientinfo = await Manager.findById(recepientlist[i]).lean().exec()
    let roomtitle = roominfo.title;

    let roompicture =  _config("app.imageurl")+"/";
    let userlist = []
    roominfo.users.map(i=>{
      userlist.push({username:i.username,fullpicture:roompicture+i.picture})
    })
    if(!roominfo.isgroup && roominfo.users.length>1){
      roomtitle = fromuserinfo.username;
      roompicture += fromuserinfo.picture
    }else{
      roompicture += "group.png"
    }
    if ( 2>1 ||
        recipientinfo &&
        recipientinfo.lastsocketid &&
        io.sockets.connected[recipientinfo.lastsocketid] != null
    ) {
      sendMessageDeleted(
          // recipientinfo.lastsocketid,
          messgid,
          roomid,
          userid
      );
    }
  }

  callback({  status: 1 });
}


async function SendMessage(message, callback) {
  let msg = message.text;
  let base64data = message.base64data;
  let ext = message.ext;
  let type = message.type;
  let duration = message.duration
  let roomid = message.roomid
  let size = message.size
  let width = message.width
  let height = message.height
  let filename = message.filename

  let userid = this.user._id;

  let  roominfo = null
  if(roomid && roomid.length>1){
    roominfo = await Room.findById(roomid).lean().exec();
  }
  // this.join(roomid);
  let messageinfo = await chathelpers.saveMessage(
      userid,
      roomid,
      msg,
      type,
      base64data,
      ext,
      duration,
      size,
      filename
  );


  let recepientlist = roominfo.users ? roominfo.users.filter(i=>i.toString()!=userid.toString()):[]
  console.log("send to recepientlist ",recepientlist,userid)

  const fromuserinfo = await User.findById(userid).lean().exec();
  for (let i = 0, len = recepientlist.length; i < len; i++) {
    let recipientinfo = await User.findById(recepientlist[i])
        .lean()
        .exec();
    let roomtitle = roominfo.title;

    let roompicture =  _config("app.imageurl")+"/";
    let userlist = []
    roominfo.users.map(i=>{
      userlist.push({username:i.username,fullpicture:roompicture+i.picture})
    })
    console.log(userlist);
    if(!roominfo.isgroup && roominfo.users.length>1){
      roomtitle = fromuserinfo.username;
      roompicture += fromuserinfo.picture
    }else{
      roompicture += "group.png"
    }

  console.log(recipientinfo)

    if (recipientinfo && recipientinfo.lastsocketid) {
      sendMessageReceived(
          recipientinfo.lastsocketid,
          userid,
          roomtitle,
          msg,
          messageinfo._id,
          roomid,
          roompicture,
          messageinfo.system,
          type,
          messageinfo.filename,
          duration,
          size,
          width,
          height
      );
    } else {
      // send push
      console.log("user not online send push")
      // send push
      if(recipientinfo){
        console.log("send push")
       // PushNotification.globalsend(recipientinfo.push.token,msg)
      }
    }
  }

  // console.log("send callback of SendMessage event  ");
  // this.broadcast.to(roomid).emit('MessageReceived',payload );
 callback({ msgid: messageinfo._id,dataurl:messageinfo.dataurl, status: 1});
}


global._io = io;
