import { CreateAuthDto } from './dto/create-auth.dto';
import { Token } from './entities/token.entity';
import { TokenService } from './jwt.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotAcceptableException } from '@nestjs/common';

@Injectable()
export class AuthService {
  jwtService: any;
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private tokenService : TokenService,

  ) {}
  
    async validateToken(token: string) {
      try {
        return this.jwtService.verify(token);
      } catch (err) {
        throw new Error('Invalid token');
      }
    }
  async validateUser(authDto: CreateAuthDto) {
    const {mail, password} = authDto
    try {
    return null
    } catch (error) {
      throw new NotAcceptableException(error)
    } 
  }
  async login(data) {
    console.log(data)
 
    const newToken = new Token()
    const accessToken =await this.tokenService.getAccessToken(data)
    const refreshToken = await this.tokenService.getRefreshToken(data)
    newToken.accessToken= accessToken
    newToken.refreshToken= refreshToken
    newToken.userId = data.id
    const token= await this.tokenService.updateRefreshTokenInUser(newToken, data.id)
    return {
      access_token: this.jwtService.sign(accessToken),
    };
  }
  
}