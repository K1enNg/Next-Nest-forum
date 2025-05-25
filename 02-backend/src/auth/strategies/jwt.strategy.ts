import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserService } from "../../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new UnauthorizedException('JWT_SECRET is not defined in environment variables');
        }
        
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: any) {
        try {
            console.log('JWT payload:', payload);
            
            if (!payload || !payload.sub) {
                throw new UnauthorizedException('Invalid token payload');
            }
            
            return {
                _id: payload.sub,
                email: payload.email
            };
        } catch (error) {
            console.error('JWT validation error:', error);
            throw new UnauthorizedException('Invalid token');
        }
    }
}
