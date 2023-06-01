const { ObjectId } = require("mongodb")
const Response = require("../helpers/Response")
const JwtAuth = require("../middlewares/JwtAuth")

let router = require("express").Router()

const nocache = (req, resp, next) =>{
    resp.header("Cache-Control', 'private, no-cache, no-store, must-revalidate'");
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

//agora call
router.post('/agora/token', JwtAuth ,nocache, UserController.getAgoraToken)

// user
router.post('/user/create', UserController.createuser)
router.post('/user/login', UserController.login)
router.post('/user/getinfo', JwtAuth, UserController.getinfo)
router.post('/user/sendrequest', JwtAuth, UserController.sendrequest)
router.post('/user/acceptrequest', JwtAuth, UserController.acceptrequest)
router.post('/user/rejectrequest', JwtAuth, UserController.rejectrequest)
router.post('/user/search', JwtAuth, UserController.searchusers)


// chat
router.get('/room/list', JwtAuth, ChatController.listrooms)
router.post('/room/messages', JwtAuth, ChatController.getroommessages)
router.post('/room/message/last', JwtAuth, ChatController.getlastmessage)
router.post('/room/message/read', JwtAuth, ChatController.readmessages)
router.post('/room/message/unread', JwtAuth, ChatController.getunreadcount)


module.exports = router