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
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User],
        synchronize: true, 
      }),
    }),

    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService], 
  exports: [UserService],   
})
export class AppModule {}
