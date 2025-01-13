const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "user.png",
    },
    authTokens: [
      {
        authToken: {
          type: String,
          required: true,
        },
      },
    ],
    status: { type: String, default: "offline" },
    friends: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
UserSchema.methods.generateAuthTokenAndSaveUser = async function () {
  const authToken = jwt.sign(
    { id: this._id.toString(), name: this.name, email: this.email },
    process.env.secret_jwt || "sanji",
    { expiresIn: "72h" }
  );
  this.authTokens.push({ authToken });
  this.save();
  return authToken;
};
module.exports = mongoose.model("User", UserSchema);
