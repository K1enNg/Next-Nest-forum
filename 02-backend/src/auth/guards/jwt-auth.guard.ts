import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext } from "@nestjs/common";

@Injectable()
export class JwtAuthStrategy extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext){
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any){
        if(err || !user){
            throw err || new UnauthorizedException("Invalid token");
        }
        return user;
    }
}

export class JwtAuthGuard extends AuthGuard('jwt') {}