let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');
let schema = mongoose.Schema(
    {
        title: {
            type: String,
            default: "",
            trim: true
        },
        description: {
            type: String,
            default: "",
            trim: true
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }
        ],
        status: {
            type: Number,
            default: 0 //  if status is 1 that mean the chat history is completed
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
);


// Plugin must be *after* virtuals
schema.plugin(mongooseLeanVirtual);

schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });

schema.statics.Clear = async function () {
    Room.deleteMany().exec();
};
module.exports = mongoose.model("room", schema, "room");
