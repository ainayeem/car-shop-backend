import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import config from "../../config";
import { USER_ROLE } from "./user.constant";
import { TUser, UserModel } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    phone: { type: String, default: "N/A" },
    address: { type: String, default: "N/A" },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: USER_ROLE.user,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));

  next();
});

userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (plainTextPassword, hashedPassword) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", userSchema);
