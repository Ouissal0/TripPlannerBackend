import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  mainDestination: string;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column('simple-array', { nullable: true })
  intermediateStops: string[];

  @Column({ nullable: true })
  transportMode: string;

  @Column('simple-array', { nullable: true })
  interests: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget: number;

  @Column('jsonb', { nullable: true })
  activities: Array<{
    id: number;
    name: string;
    time: Date;
    description: string;
  }>;

  @Column('simple-array', { nullable: true })
  companions: string[];

  @Column({ nullable: true })
  accommodationType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  accommodationBudget: number;

  @Column('simple-array', { nullable: true })
  mealPreferences: string[];

  @Column({ nullable: true })
  insuranceRequired: boolean;

  @Column({ nullable: true })
  visaRequired: boolean;

  @Column('text', { array: true, nullable: true })
  images: string[];
  
  @Column('simple-array', { nullable: true })
  languages: string[];

  @Column({ nullable: true })
  numberOfTravelers: number;

  @Column({ nullable: true })
  specialRequirements: string;

  @Column('jsonb', { nullable: true })
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };

  @ManyToOne(() => User, user => user.trips)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
