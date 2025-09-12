import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './app.controller';
import { User } from './entities/user.entity';
import { UserService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),      // mysql
        port: config.get<number>('DB_PORT'),      // 3306
        username: config.get<string>('DB_USERNAME'), // user_service
        password: config.get<string>('DB_PASSWORD'), // secret
        database: config.get<string>('DB_DATABASE'), // usersdb
        entities: [User],
        synchronize: true, 
        retryAttempts: 10,     // optional: retry if MySQL is not ready
        retryDelay: 5000,      // wait 5s between retries
      }),
    }),

    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService], 
  exports: [UserService],   
})
export class AppModule {}
