import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PositionsModule } from './positions/positions.module';
import { TripsModule } from './trips/trips.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'localhost',
      port: 5432, 
      username: 'postgres',
      password: 'ouissal2003',
      database: 'trip_planner',
      autoLoadEntities: true, 
      synchronize: true, 
    }),
    UsersModule,
    PositionsModule,
    TripsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
  ],
})
export class AppModule {}
