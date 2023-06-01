let mongoose = require("mongoose");
const mongooseLeanVirtual = require("mongoose-lean-virtuals");
let schema = mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user", // no need for user if its a system msg
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "manager", // no need for user if its a system msg
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "room",
            required: true
        },
        sent: {
            type: Boolean,
            default: true
        },
        received: {
            type: Boolean,
            default: false
        },
        read: {
            type: Boolean,
            default: false
        },
        system: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: ""
        },
        filename: {
            type: String,
            default: "" // file name image or voice
        },
        width : {
            type: Number,
            default : 0,
        },
        height : {
            type: Number,
            default : 0,
        },
        type: {
            type: String,
            default: "text" // image / voice
        },
        size : {
            type: Number,
            default : 0  // file size in bytes
        },
        duration : {
            type : Number,
            default : 0 // in seconds
        },

        status: {
            type: Number,
            default: 0 // not assgined to ticket yet, 1 assigned
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

// Plugin must be *after* virtuals
schema.plugin(mongooseLeanVirtual);


schema.statics.Clear = async function () {
    Message.deleteMany().exec();
};

schema.statics.createLoadMore = async function (room) {
    let newloadmore = new Message();
    newloadmore.room = room;
    newloadmore.type = "loadmore";
    newloadmore.text = "load more";
    newloadmore.status = 1;
    newloadmore.id = "loadmoreid";
    return newloadmore;
};


schema.virtual('dataurl').get(function() {
    let data = "";
    if (this.filename && this.filename.length > 2){
        data = _config("app.imageurl")+"/"+this.filename;
    }
    return data;
});
module.exports = mongoose.model("message", schema, "message");
