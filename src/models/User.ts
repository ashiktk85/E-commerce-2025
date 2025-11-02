import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  provider: string;       
  verified: boolean;      
  otp?: string;            
  otpExpiry?: Date;  
  refreshToken?: string;     
}


const userSchema = new Schema<IUser>({
  name:      { type: String, required: true },
  email:     { type: String, unique: true, required: true, lowercase: true },
  password:  { type: String }, 
  provider:  { type: String, default: 'local' },
  verified:  { type: Boolean, default: false },  
  otp:       { type: String },    
  otpExpiry: { type: Date },     
  refreshToken: { type: String },     
}, { timestamps: true });

export default model<IUser>("User", userSchema);
