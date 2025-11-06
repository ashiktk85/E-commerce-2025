import { Schema, model, Document } from "mongoose";
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String },
    provider: { type: String, default: 'local' },
    verified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    refreshToken: { type: String },
}, { timestamps: true });
export default model("User", userSchema);
//# sourceMappingURL=User.js.map