// import { Injectable, UnauthorizedException } from "@nestjs/common"
// import { PassportStrategy } from "@nestjs/passport"
// import { InjectRepository } from "@nestjs/typeorm"
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { AuthService } from "../auth.service";
// import { PayloadInterface } from "../interface/payload.interface";
// import { Repository } from 'typeorm';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
//     constructor(
//         @InjectRepository(User)
//         private userRepository: Repository<User>,
//         private authService: AuthService,
//         private configService: ConfigService,
//     ){
//     super({
//             jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
//             secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET')
//         })
//     }

//     async validate(payload: PayloadInterface) {
        
//     console.log("Hoo lalalalal erreur",payload)
//     const user = await this.userRepository.findOne({
//           where:{
//             id:payload.id
//           }
//         })
//         if (!user) {
//             throw new UnauthorizedException()
//         }
//         return user
//     }
// }