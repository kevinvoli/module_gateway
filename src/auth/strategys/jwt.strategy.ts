// import { Injectable, UnauthorizedException } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { PassportStrategy } from "@nestjs/passport";
// import { InjectRepository } from "@nestjs/typeorm";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { PayloadInterface } from "../interface/payload.interface";
// import { TokenService } from "../jwt.service";

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//     constructor(
//         // private jwtService: TokenService,
//         private configService: ConfigService,
//     ) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             ignoreExpiration: false,
//             secretOrKey: configService.get('SECRET'),
//         });
//     }

//     async validate(payload: PayloadInterface) {
//     console.log("Hoo lalalalal erreur aaaa",payload)
//         const user = await this.userService.findOne(payload.id)
//         if (!user)  throw new UnauthorizedException() 
//         return user
//     }
// }