import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "../schema/schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UserDto } from "../dto/user.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private authmodel: Model<User>,
    private jwtservice: JwtService
  ) {}

  async createuser(userdto: UserDto) {
    const { username, password, role, pnumber } = userdto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const usercreation = await this.authmodel.create({
      username,
      password: hashedPassword,
      role,
      pnumber,
    });
    if (!usercreation) {
      throw new BadRequestException(`Enter valid details`);
    }
    return usercreation;
  }

  async findbyusername(username: string) {
    return await this.authmodel.findOne({ username });
  }

  async login(username: string, password: string) {
    const usersign = await this.findbyusername(username);
    if (!usersign) {
      throw new UnauthorizedException(`Username not found`);
    }

    const validPassword = await bcrypt.compare(password, usersign.password);
    if (!validPassword) {
      throw new UnauthorizedException(`Password does not matched`);
    }

    const payload = {
      sub: usersign.id,
      role: usersign.role,
    };

    const accessToken = this.jwtservice.sign(payload, {
      secret: `${process.env.JWT_SECRET}`,
    });

    return { accessToken };
  }
}
