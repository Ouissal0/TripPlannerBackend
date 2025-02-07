import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => User, user => user.positions)
  user: User;

  @Column()
  tripId: number;
}
