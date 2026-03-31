import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async log(data: {
    action: string;
    entityType?: string;
    entityId?: string;
    details?: Record<string, any>;
    userId?: string;
    ipAddress?: string;
  }): Promise<AuditLog> {
    const log = this.auditRepository.create(data);
    return this.auditRepository.save(log);
  }

  async findAll(page = 1, limit = 20) {
    const [data, total] = await this.auditRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });
    return { data, total, page, limit };
  }
}
