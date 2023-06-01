/**
 * UsersController
 * @description :: Server-side logic for managing users
 */

//  let jwt = require("jsonwebtoken");
//  let _ = require('lodash');
//  let DomainChecker = require("../helpers/DomainChecker");
//  let Logger = require("../helpers/Logger");
//  let Utils = require("../helpers/Utils");
//  let UserHelper = require("../helpers/UserHelper");
//  const mongoose = require('mongoose');
//  const validator = require("email-validator");
//  const SmsService = require("../services/SmsService");
//  const { v4: uuidv4 } = require('uuid');
const { RtcTokenBuilder } = require('agora-access-token');
let Response = require("../helpers/Response")
const Security = require("../helpers/Security")
const { escapeStringRegexp } = require("../helpers/UserHelper");
const Room = require("../models/Room");
const User = require("../models/User");
 
 module.exports = {
 
     /**
      * Create a new user
      * @param req
      * @param res
      * @returns {*}
      */

     createuser : async function( req , res ) {

         let count = await User.countDocuments({'username':req.body.username}).exec();
         if (count > 0) return Response.notOk(res, 'Username already exists.')
         
        const user = new User(req.body)
        const accessToken = await Security.generateToken(user._id, user.username, user.status)
        // res.cookie("accessToken", accessToken, {
        //     httpOnly : true
        // })
        user.save( async (err, user) => {
            if (err) return console.log(err);
            if (user) {
                return Response.ok(res,{
                    user: { username : user.username, _id : user._id },
                    msg: "Please Verify your account",
                    token: accessToken,
                    // expires: await UserHelpers.getSessionTimeout()
                });
            }
        })
     },


     
     /**
      * Login
      * @param req
      * @param res
      * @returns {*}
      */

      login : async function( req , res ) {
        const {username, password} = req.body 
        User.findOne({username : username}, (err, user) => {
            if (err) return Response.notOk(res, 'Error has occured')
            if (!user) return Response.notOk(res, 'Wrong username')
            if (user) {
                console.log(user);
                user.comparePassword(password, async (valid) => {
                    if (!valid) return Response.notOk(res, 'Not a valid password.')
                    return Response.ok(res,{
                        user: { username : user.username, _id : user._id },
                        token: await Security.generateToken(user._id, user.username, user.status),
                    });
                })
            }
        })
    },


     /**
      * get user info
      * @param req
      * @param res
      * @returns {*}
      */


      getinfo : async function( req , res ) {
        let data = await User.findById(req.body.id)
        return Response.ok(res, data)
    },

     
     /**
      * Send a friend request
      * @param req
      * @param res
      * @returns {*}
      */

      sendrequest : async function( req , res ) {
          
        const receivingUser = await User.findById(req.body.id).exec()
        const requestingUser = await User.findById(req.userid).exec()

        receivingUser.requestsreceived.push(req.userid)
        requestingUser.requestssent.push(req.body.id )

        await requestingUser.save()
        await receivingUser.save()

        return Response.ok(res, 'Request was sent.')
    },


     /**
      * Accept a user as a friend
      * @param req
      * @param res
      * @returns {*}
      */

      acceptrequest : async function( req , res ) {

        const requestingUser = await User.findById(req.body.id).exec()
        const acceptingUser = await User.findById(req.userid).exec()

        // acceptingUser.requestsreceived.filter((id) => id.toString()!==req.body.id)
        await User.updateOne({_id : req.userid}, { $pull : { requestsreceived : req.body.id}}).exec()
        acceptingUser.friends.push(req.body.id)
        await User.updateOne({_id : req.body.id}, { $pull : { requestssent : req.userid}}).exec()
        requestingUser.friends.push(req.userid)

        await requestingUser.save()
        await acceptingUser.save()

        const room = new Room()
        room.users.push(req.body.id)
        room.users.push(req.userid)
        await room.save()

        return Response.ok(res, 'Request accepeted.')
    },


    
     /**
      * Reject a friend request
      * @param req
      * @param res
      * @returns {*}
      */

      rejectrequest : async function( req , res ) {

        await User.updateOne({_id : req.userid}, { $pull : { requestsreceived : req.body.id}}).exec()
        await User.updateOne({_id : req.body.id}, { $pull : { requestssent : req.userid}}).exec()

        return Response.ok(res, 'Request denied.')
    },


    /**
      * search users
      * @param req
      * @param res
      * @returns {*}
      */

     searchusers : async function( req , res ) {
         let data = [], $regex;
        const {keyword, flag} = req.body;
        if (keyword) { $regex = escapeStringRegexp(keyword)}

        if (flag === 'searchfriends') {
         data =  await User.find({$or:[{username:{$regex}, friends: [req.userid]}]}).sort({ "$natural": -1 }).exec()
        } else if (flag === 'searchpeople') {
         data =  await User.find({$or:[{username:{$regex}}]}).sort({ "$natural": -1 }).exec()
        } else {
         data = await User.find({ requestssent: { $in: [req.userid] } }).exec()
        }


        return Response.ok(res, data);
    },


    getAgoraToken : async function(req,res) {
        let {channel, appId, appcertificate} = req.body;
        if(!channel) {
             return res.status(500).json({ 'error': 'channel is required'})
        }
        const token = RtcTokenBuilder.buildTokenWithUid(appId, appcertificate, channel, 0, 3600)
        console.log(token);
        return Response.ok(res, token)
    }


 }