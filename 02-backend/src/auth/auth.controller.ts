import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  UsePipes, 
  ValidationPipe, 
  BadRequestException, 
  UnauthorizedException 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { 
  ApiTags, 
  ApiOperation, 
  ApiBody, 
  ApiResponse 
} from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { User, UserDocument } from '../user/schemas/user.schema';

interface IApiResponse<T> {
  message: string;
  data: T;
}

interface IUserResponse {
  _id: string;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  bio?: string;
}

interface IRegisterResponse extends IApiResponse<{
  id: string;
  email: string;
  username: string;
}> {}

interface ILoginResponse extends IApiResponse<{
  access_token: string;
  user: IUserResponse;
}> {}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'User already exists' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Body() registerUserDto: CreateUserDto): Promise<IRegisterResponse> {
    try {
      const user = await this.authService.register(registerUserDto);
      const userObj = user.toObject();
      
      return {
        message: 'User registered successfully',
        data: {
          id: userObj._id.toString(),
          email: userObj.email,
          username: userObj.username,
        }
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('User already exists');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ 
    description: 'User logged in successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            access_token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                email: { type: 'string' },
                username: { type: 'string' },
                role: { type: 'string' },
                avatar: { type: 'string' },
                bio: { type: 'string' }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginUserDto: LoginUserDto): Promise<ILoginResponse> {
    try {
      const user = await this.authService.validateUser(
        loginUserDto.email, 
        loginUserDto.password
      );
      
      const { access_token } = await this.authService.login(user as UserDocument);
      const userObj = user as any;
      
      return {
        message: 'User logged in successfully',
        data: {
          access_token,
          user: {
            _id: userObj._id.toString(),
            email: userObj.email,
            username: userObj.username,
            role: userObj.role,
            avatar: userObj.avatar,
            bio: userObj.bio
          }
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
