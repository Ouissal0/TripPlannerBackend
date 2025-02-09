import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import UserRole from './userRole';
import { Position } from '../positions/position.entity';
import { Trip } from 'src/trips/trip.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @OneToMany(() => Position, position => position.user)
  positions: Position[];
  @OneToMany(() => Trip, trip => trip.user)
  trips: Trip[];
}
