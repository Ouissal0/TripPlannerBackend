import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './position.entity';
import { PositionsGateway } from './positions.gateway';
import { PositionsService } from './positions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Position])],
  providers: [PositionsGateway, PositionsService],
  exports: [PositionsService],
})
export class PositionsModule {}
