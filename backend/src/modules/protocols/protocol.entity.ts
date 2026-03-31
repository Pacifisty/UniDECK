import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DocumentStatus } from '../../common/enums/document-status.enum';
import { Priority } from '../../common/enums/priority.enum';
import { User } from '../users/user.entity';
import { Sector } from '../sectors/sector.entity';

@Entity('protocols')
export class Protocol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  number: string;

  @Column()
  subject: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  documentType: string;

  @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.PENDING })
  status: DocumentStatus;

  @Column({ type: 'enum', enum: Priority, default: Priority.NORMAL })
  priority: Priority;

  @Column({ default: false })
  isExternal: boolean;

  @Column({ nullable: true })
  requesterName: string;

  @Column({ nullable: true })
  requesterEmail: string;

  @Column({ nullable: true })
  requesterCpfCnpj: string;

  @Column({ nullable: true })
  requesterPhone: string;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ type: 'simple-array', nullable: true })
  attachments: string[];

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: true })
  createdById: string;

  @ManyToOne(() => Sector, { nullable: true, eager: true })
  @JoinColumn({ name: 'originSectorId' })
  originSector: Sector;

  @Column({ nullable: true })
  originSectorId: string;

  @ManyToOne(() => Sector, { nullable: true, eager: true })
  @JoinColumn({ name: 'currentSectorId' })
  currentSector: Sector;

  @Column({ nullable: true })
  currentSectorId: string;

  @Column({ nullable: true })
  observations: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
