import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { JournalServicesModule } from './journal_services/journal_services.module';
import { DatabaseModule } from './database/database.module';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './loggin.Interceptor';
import { ServiceDiscoveryService } from './discovery/discovery.service';
import { AuthMiddleware } from './utils/auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from './discovery/entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Services]),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MYSQL_HOST:Joi.string().required(),
        MYSQL_PORT:Joi.number().required(),
        MYSQL_USER:Joi.string().required(),
        MYSQL_PASSWORD: Joi.string().required(),
        MYSQL_DATABASE:Joi.string().required(),
        SERVER_PORT:Joi.number().required()
      })
    }),
    GatewayModule, 
    DiscoveryModule, 
    JournalServicesModule, 
    DatabaseModule, 
    ],
  controllers: [AppController],
  providers: [AppService,ServiceDiscoveryService,
    {
      provide: APP_INTERCEPTOR,
      useClass:LoggingInterceptor
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/auth/login', '/public', '/discovery/register','gateway/login','gateway/create_user','gateway/confirmation') // Exclure des routes spécifiques
      .forRoutes('*'); // Appliquer sur toutes les routes
  }
}
