import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class User {
  id: mongoose.Types.ObjectId;

  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;

  @Prop()
  role: string;

  @Prop()
  pnumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
