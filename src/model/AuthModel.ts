import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;
const JWT_SECRET = process.env.JWT_SECRET;

interface IToken {
  token: string;
}

interface IControll {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface IAuth extends Document {
  _id: string;
  email: string;
  employee: string;
  emp_name: string;
  password: string;
  controll: IControll;
  role: string;
  userImage?: Buffer;
  tokens: IToken[];
  toJSON(): object;
  generateAuthToken(): Promise<string>;
  removeAuthToken(token: string): Promise<void>;
}

interface IAuthModel extends Model<IAuth> {
  findByCredentials(email: string, password: string): Promise<IAuth>;
}

const AuthSchema = new Schema<IAuth>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    employee: {
      type: String,
      required: true,
      unique: true,
    },
    emp_name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userImage: {
      type: Buffer,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    controll: {
      read: {
        type: Boolean,
        required: true,
        default: false,
      },
      write: {
        type: Boolean,
        required: true,
        default: false,
      },
      delete: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

AuthSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.userImage;
  return userObject;
};

AuthSchema.pre("save", async function (next) {
  const user = this as IAuth;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

AuthSchema.methods.generateAuthToken = async function () {
  const user = this as IAuth;
  const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET!);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

AuthSchema.methods.removeAuthToken = async function (token: string) {
  const user = this as IAuth;
  user.tokens = user.tokens.filter((t) => t.token !== token);
  await user.save();
};

AuthSchema.statics.findByCredentials = async function (
  email: string,
  password: string
) {
  const user = (await this.findOne({ email })) as IAuth;
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

const Auth = mongoose.model<IAuth, IAuthModel>("Auth", AuthSchema);

export default Auth;
