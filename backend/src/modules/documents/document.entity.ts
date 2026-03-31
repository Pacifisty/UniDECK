import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Sector } from '../sectors/sector.entity';
import { Protocol } from '../protocols/protocol.entity';

export enum ConfidentialityLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  RESTRICTED = 'restricted',
  CONFIDENTIAL = 'confidential',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  documentType: string;

  @Column()
  filePath: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ default: 1 })
  version: number;

  @Column({ type: 'enum', enum: ConfidentialityLevel, default: ConfidentialityLevel.INTERNAL })
  confidentiality: ConfidentialityLevel;

  @Column({ type: 'simple-array', nullable: true })
  keywords: string[];

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: User;

  @Column({ nullable: true })
  uploadedById: string;

  @ManyToOne(() => Sector, { nullable: true, eager: true })
  @JoinColumn({ name: 'sectorId' })
  sector: Sector;

  @Column({ nullable: true })
  sectorId: string;

  @ManyToOne(() => Protocol, { nullable: true, eager: false })
  @JoinColumn({ name: 'protocolId' })
  protocol: Protocol;

  @Column({ nullable: true })
  protocolId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
