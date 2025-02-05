import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // ou 'mysql', 'sqlite', etc.
      host: 'localhost',
      port: 5432, // Port PostgreSQL par défaut
      username: 'postgres',
      password: 'ouissal2003',
      database: 'trip_planner',
      autoLoadEntities: true, // Charge automatiquement les entités
      synchronize: true, // À utiliser uniquement en développement
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
