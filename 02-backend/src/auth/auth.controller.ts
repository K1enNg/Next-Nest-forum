import { 
  Controller, 
  Post, 
  Body, 
  Request
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
