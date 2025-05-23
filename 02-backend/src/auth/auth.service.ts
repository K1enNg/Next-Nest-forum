import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

type JwtPayload = {
  email: string;
  sub: string;
};

type LoginResponse = {
  access_token: string;
  user: Omit<User, 'password'>;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findByEmail(email);
    
    if (user && await user.comparePassword(password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user.toObject();
      return result;
    }
    
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: UserDocument): Promise<LoginResponse> {
    const payload: JwtPayload = { 
      email: user.email, 
      sub: user._id.toString() 
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user.toObject();

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.userService.create(createUserDto);
    return user;
  }
}
