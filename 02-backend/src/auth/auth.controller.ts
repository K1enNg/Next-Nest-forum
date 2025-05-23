import { 
  Controller, 
  Post, 
  Body, 
  BadRequestException, 
  UnauthorizedException 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto) {
    try {
      await this.authService.register(registerUserDto);
      return {
        message: 'User registered successfully',
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('User already exists');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      await this.authService.validateUser(
        loginUserDto.email, 
        loginUserDto.password
      );  
      return {
        message: 'User logged in successfully',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
