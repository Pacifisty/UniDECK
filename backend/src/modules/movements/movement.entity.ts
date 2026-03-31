import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Protocol } from '../protocols/protocol.entity';
import { User } from '../users/user.entity';
import { Sector } from '../sectors/sector.entity';

export enum MovementType {
  DISPATCH = 'dispatch',
  FORWARD = 'forward',
  RETURN = 'return',
  RECEIVE = 'receive',
  SIGN = 'sign',
  ARCHIVE = 'archive',
  COMMENT = 'comment',
}

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Protocol, { eager: false })
  @JoinColumn({ name: 'protocolId' })
  protocol: Protocol;

  @Column()
  protocolId: string;

  @Column({ type: 'enum', enum: MovementType, default: MovementType.FORWARD })
  type: MovementType;

  @Column({ nullable: true })
  observations: string;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'fromUserId' })
  fromUser: User;

  @Column({ nullable: true })
  fromUserId: string;

  @ManyToOne(() => Sector, { nullable: true, eager: true })
  @JoinColumn({ name: 'fromSectorId' })
  fromSector: Sector;

  @Column({ nullable: true })
  fromSectorId: string;

  @ManyToOne(() => Sector, { nullable: true, eager: true })
  @JoinColumn({ name: 'toSectorId' })
  toSector: Sector;

  @Column({ nullable: true })
  toSectorId: string;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'toUserId' })
  toUser: User;

  @Column({ nullable: true })
  toUserId: string;

  @CreateDateColumn()
  createdAt: Date;
}
