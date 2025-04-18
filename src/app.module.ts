import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkersModule } from './workers/workers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScriptsModule } from './scripts/scripts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    WorkersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'NSK-UK-1C-N',
      port:1433,
      username: 'SpravServ',
      password: 'Cghfdjxybr24',
      database: 'SpravApp',
      autoLoadEntities: true,
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      extra: {
        trustServerCertificate: true,
      }
    }),
    ScriptsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
