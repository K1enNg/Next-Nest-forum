import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService 
    ) {}

    @Post('register')
    async register(@Body() body: any) {
        const {email, password, username} = body;
        return this.authService.register(email, password, username);
    }

    @Post('login')
    async login(@Body() body: any) {
        const {email, password} = body;
        const user = await this.authService.validateUser(email, password);
        return this.authService.login(user);
    }
}
