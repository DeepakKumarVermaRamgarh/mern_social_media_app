// import mongoose
import mongoose from "mongoose";
// import bcrypt
import bcrypt from "bcryptjs";
// import jwt from jsonwebtoken
import jwt from "jsonwebtoken";

// creating user model

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 20,
      required: [true, "Please provide name"],
    },

    email: {
      type: String,
      validate: {
        validator: function (v) {
          // check v is a valid email string or not
          const emailRegex =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          return emailRegex.test(v);
        },
        message: "Please provide a valid email",
      },
      unique: true,
      required: [true, "Please provide email"],
    },

    password: {
      type: String,
      minlength: [8, "Password must be atleast 8 characters long"],
      required: [true, "Please provide password"],
      validate: {
        validator: function (v) {
          // check if v is a valid password
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
          return passwordRegex.test(v);
        },
        message: "Please provide a strong password",
      },
      select: false,
    },

    avatar: {
      public_id: String,
      url: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
  },
  { timestamps: true }
);

// check is password change before save if yes then hash the new password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// compare password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// sign access token using jwt
userSchema.methods.getSignedJwtAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });
};

// sign refresh token using jwt
userSchema.methods.getSignedJwtRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

// get reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_RESET_PASSWORD_SECRET,
    {
      expiresIn: "10m",
    }
  );
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// creating user model
const User = mongoose.model("User", userSchema);
// exporting user model
export default User;
