import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ServiceDiscoveryService } from 'src/discovery/discovery.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly discoveryService: ServiceDiscoveryService) {} // Injection correcte du service de découverte

  private createTCPClient(host: string, port: number) {
    try {
      return ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host, port },
      });
    } catch (error) {
      throw new Error(`Échec de connexion au service : ${error}`);
    }
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log("la :",token);
    // console.groupCollapsed(req.headers)
  
    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    try {
      // console.log("service:", token);

      const service = await this.discoveryService.getService('authService');
      // console.log("service:", service);

      if (!service) {
        // console.log("service:", service);
        
        throw new NotFoundException(`Service authService non trouvé`);
      }

      const client = await this.createTCPClient(service.host, parseInt(service.port));
      const response = await firstValueFrom(client.send({ cmd: 'validate_token' }, { token }));
      console.log("la response:",response);
      
      req.user = response; // Injecte les infos de l'utilisateur dans la requête
      next();
    } catch (err) {
      console.log("la erreur:",err);

      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}
