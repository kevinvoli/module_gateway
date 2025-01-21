import {  Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt/dist';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';
import { TokenService } from './jwt.service';
import { ConfigService } from '@nestjs/config';
import { Services } from 'src/discovery/entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token,]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 3600
      }
    })
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    TokenService,
    Repository,   
    JwtService,
    ConfigService
  ],

})
export class AuthModule {}
