let mongoose = require("mongoose");
const mongooseLeanVirtual = require("mongoose-lean-virtuals");
let bcrypt = require("bcrypt");

let schema = mongoose.Schema(
  {
    username: {
      type: String,
      default: "",
      trim: true,
    },
    picture: {
      type: String,
      default: "" // image path
    },
    emailverified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    emailactivationcode: {
      type: Number,
      default: 0, //
    },
    status: {
      type: Number,
      default: 0, // 0 not verified , 1 verified
    },
    friends : [{
      type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    requestsreceived : [{
      type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    requestssent : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    }],
    isonline: {
      type: Boolean,
      default: false,
    },
    isloggedin: {
      type: Boolean,
      default: false, //
    },
    lang: {
      type: String,
      default: "en",
    },
    lastsocketid: {
      type: String,
      default: "",
    },
    social: {
      type: String,
      default: "",
    },
    lastseen: {
      type: String,
      default: "",
    },
    lastlogin: {
      type: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

schema.pre("save", function (next) {
  let user = this;
  // generate a salt
  if (user.isModified("password") || user.isNew) {
    bcrypt.genSalt(10, function (error, salt) {
      if (error) return next(error);

      // hash the password along with our new salt

      bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) return next(error);

        // override the cleartext password with the hashed one

        user.password = hash;

        next(null, user);
      });
    });
  } else {
    next(null, user);
  }
});

/**
 * Compare raw and encrypted password
 * @param password
 * @param callback
 */
schema.methods.comparePassword = async function (password, callback) {
  console.log("comparePassword ,,,,", password, this.password);
  // header already sent
  const match = await bcrypt.compare(password, this.password);
  if (match) {
    callback(true);
  } else {
    callback(false);
  }
};
/**
 * Compare raw and encrypted password
 * @param password
 * @param callback
 */
schema.methods.compareRowPassword = function (password, callback) {
  if (password === this.password) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

// schema.virtual("full_name").get(function () {
//   return this.first + " " + this.last;
// });

// Plugin must be *after* virtuals
schema.plugin(mongooseLeanVirtual);

schema.set("toObject", { getters: true, virtuals: true });
schema.set("toJSON", { getters: true, virtuals: true });

const collectionname = "user";
module.exports = mongoose.model(collectionname, schema, collectionname);
