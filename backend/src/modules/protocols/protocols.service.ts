import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Protocol } from './protocol.entity';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { DocumentStatus } from '../../common/enums/document-status.enum';

@Injectable()
export class ProtocolsService {
  constructor(
    @InjectRepository(Protocol)
    private protocolsRepository: Repository<Protocol>,
  ) {}

  private async generateNumber(isExternal: boolean): Promise<string> {
    const year = new Date().getFullYear();
    const type = isExternal ? 'EXT' : 'INT';
    const count = await this.protocolsRepository.count();
    const seq = String(count + 1).padStart(6, '0');
    return `${year}/${type}/${seq}`;
  }

  async create(createProtocolDto: CreateProtocolDto, userId: string): Promise<Protocol> {
    const number = await this.generateNumber(createProtocolDto.isExternal || false);
    const protocol = this.protocolsRepository.create({
      ...createProtocolDto,
      number,
      createdById: userId,
    });
    return this.protocolsRepository.save(protocol);
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: DocumentStatus;
    sectorId?: string;
    isExternal?: boolean;
  }) {
    const { page = 1, limit = 20, search, status, sectorId, isExternal } = options;

    const queryBuilder = this.protocolsRepository
      .createQueryBuilder('protocol')
      .leftJoinAndSelect('protocol.createdBy', 'createdBy')
      .leftJoinAndSelect('protocol.originSector', 'originSector')
      .leftJoinAndSelect('protocol.currentSector', 'currentSector')
      .orderBy('protocol.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      queryBuilder.andWhere(
        '(protocol.number ILIKE :search OR protocol.subject ILIKE :search OR protocol.requesterName ILIKE :search OR protocol.requesterCpfCnpj ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (status) queryBuilder.andWhere('protocol.status = :status', { status });
    if (sectorId) queryBuilder.andWhere('protocol.currentSectorId = :sectorId', { sectorId });
    if (isExternal !== undefined) queryBuilder.andWhere('protocol.isExternal = :isExternal', { isExternal });

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Protocol> {
    const protocol = await this.protocolsRepository.findOne({
      where: { id },
      relations: ['createdBy', 'originSector', 'currentSector'],
    });
    if (!protocol) {
      throw new NotFoundException(`Protocol ${id} not found`);
    }
    return protocol;
  }

  async findByNumber(number: string): Promise<Protocol> {
    const protocol = await this.protocolsRepository.findOne({
      where: { number },
      relations: ['createdBy', 'originSector', 'currentSector'],
    });
    if (!protocol) {
      throw new NotFoundException(`Protocol ${number} not found`);
    }
    return protocol;
  }

  async update(id: string, updateProtocolDto: UpdateProtocolDto): Promise<Protocol> {
    const protocol = await this.findOne(id);
    Object.assign(protocol, updateProtocolDto);
    return this.protocolsRepository.save(protocol);
  }

  async addAttachment(id: string, filePath: string): Promise<Protocol> {
    const protocol = await this.findOne(id);
    if (!protocol.attachments) protocol.attachments = [];
    protocol.attachments.push(filePath);
    return this.protocolsRepository.save(protocol);
  }

  async getStats() {
    const total = await this.protocolsRepository.count();
    const pending = await this.protocolsRepository.count({ where: { status: DocumentStatus.PENDING } });
    const inProgress = await this.protocolsRepository.count({ where: { status: DocumentStatus.IN_PROGRESS } });
    const completed = await this.protocolsRepository.count({ where: { status: DocumentStatus.COMPLETED } });
    return { total, pending, inProgress, completed };
  }
}
