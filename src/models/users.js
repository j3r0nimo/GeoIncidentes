import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,     
      trim: true,
      minlength: 4,
      maxlength: 50,
    },
    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
export default User;

/* MongoDB (improvements)

✔ Username normalization
✔ Brute-force protection fields
✔ Account locking support
✔ Role-based access control
✔ Future-proof for admin panel

*/
