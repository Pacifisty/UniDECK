import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Protocol } from '../protocols/protocol.entity';
import { Movement } from '../movements/movement.entity';
import { User } from '../users/user.entity';
import { Sector } from '../sectors/sector.entity';
import { DocumentStatus } from '../../common/enums/document-status.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Protocol)
    private protocolsRepository: Repository<Protocol>,
    @InjectRepository(Movement)
    private movementsRepository: Repository<Movement>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Sector)
    private sectorsRepository: Repository<Sector>,
  ) {}

  async getDashboardStats() {
    const totalProtocols = await this.protocolsRepository.count();
    const pendingProtocols = await this.protocolsRepository.count({
      where: { status: DocumentStatus.PENDING },
    });
    const inProgressProtocols = await this.protocolsRepository.count({
      where: { status: DocumentStatus.IN_PROGRESS },
    });
    const completedProtocols = await this.protocolsRepository.count({
      where: { status: DocumentStatus.COMPLETED },
    });
    const totalUsers = await this.usersRepository.count({ where: { isActive: true } });
    const totalSectors = await this.sectorsRepository.count({ where: { isActive: true } });

    return {
      totalProtocols,
      pendingProtocols,
      inProgressProtocols,
      completedProtocols,
      totalUsers,
      totalSectors,
    };
  }

  async getProtocolsByPeriod(startDate: string, endDate: string) {
    return this.protocolsRepository
      .createQueryBuilder('protocol')
      .select("DATE_TRUNC('day', protocol.createdAt)", 'date')
      .addSelect('COUNT(*)', 'count')
      .where('protocol.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy("DATE_TRUNC('day', protocol.createdAt)")
      .orderBy("DATE_TRUNC('day', protocol.createdAt)", 'ASC')
      .getRawMany();
  }

  async getTopSectorsByDemand() {
    return this.protocolsRepository
      .createQueryBuilder('protocol')
      .select('sector.name', 'sectorName')
      .addSelect('COUNT(*)', 'count')
      .leftJoin('protocol.currentSector', 'sector')
      .groupBy('sector.name')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async getOverdueProtocols() {
    const now = new Date();
    return this.protocolsRepository
      .createQueryBuilder('protocol')
      .where('protocol.dueDate < :now', { now })
      .andWhere('protocol.status NOT IN (:...statuses)', {
        statuses: [DocumentStatus.COMPLETED, DocumentStatus.ARCHIVED],
      })
      .leftJoinAndSelect('protocol.currentSector', 'currentSector')
      .orderBy('protocol.dueDate', 'ASC')
      .getMany();
  }
}
