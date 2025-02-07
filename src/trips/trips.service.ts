import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { User } from '../users/user.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripsRepository: Repository<Trip>,
  ) {}

 async create(createTripDto: CreateTripDto, user: User): Promise<Trip> {
    console.log('Creating trip with images:', {
      imageCount: createTripDto.images?.length || 0,
      firstImage: createTripDto.images && createTripDto.images.length > 0 
        ? createTripDto.images[0].substring(0, 100) + '...' 
        : 'No image'
    });

    const trip = this.tripsRepository.create({
      ...createTripDto,
      user,
    });

    const savedTrip = await this.tripsRepository.save(trip);
    console.log('Saved trip with images:', {
      id: savedTrip.id,
      imageCount: savedTrip.images?.length || 0,
      firstImage: savedTrip.images && savedTrip.images.length > 0 
        ? savedTrip.images[0].substring(0, 100) + '...' 
        : 'No image'
    });

    return savedTrip;
  }

  async findAll(user: User): Promise<Trip[]> {
    return this.tripsRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Trip> {
    return this.tripsRepository.findOne({
      where: { id, user: { id: user.id } },
    });
  }

  async update(id: string, updateTripDto: Partial<CreateTripDto>, user: User): Promise<Trip> {
    await this.tripsRepository.update(
      { id, user: { id: user.id } },
      updateTripDto,
    );
    return this.findOne(id, user);
  }

  async remove(id: string, user: User): Promise<void> {
    await this.tripsRepository.delete({ id, user: { id: user.id } });
  }
}
