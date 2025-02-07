import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './position.entity';

@Injectable()
export class PositionsService {
  private readonly logger = new Logger(PositionsService.name);

  constructor(
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
  ) {}

  async create(data: {
    userId: number;
    tripId: number;
    latitude: number;
    longitude: number;
  }): Promise<Position> {
    const position = this.positionsRepository.create({
      user: { id: data.userId },
      tripId: data.tripId,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    return await this.positionsRepository.save(position);
  }

  async getPositionsForTrip(tripId: number): Promise<Position[]> {
    return await this.positionsRepository.find({
      where: { tripId },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });
  }

  async getLatestPositionsForTrip(tripId: number): Promise<Position[]> {
    return await this.positionsRepository
      .createQueryBuilder('position')
      .innerJoinAndSelect('position.user', 'user')
      .where('position.tripId = :tripId', { tripId })
      .andWhere(
        'position.timestamp = (SELECT MAX(p2.timestamp) FROM position p2 WHERE p2.userId = position.userId AND p2.tripId = :tripId)',
        { tripId }
      )
      .orderBy('position.timestamp', 'DESC')
      .getMany();
  }

  async handleUserDisconnect(clientId: string): Promise<void> {
    // Nettoyer les ressources associées au client déconnecté
    // Cette méthode peut être étendue selon les besoins
    this.logger.log(`Cleaning up resources for client: ${clientId}`);
  }
}
