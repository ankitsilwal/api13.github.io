import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schema/schema";
import { AuthController } from "../controller/auth.controller";
import { AuthService } from "../service/auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: "2h" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtService],
})
export class AuthModule {}
