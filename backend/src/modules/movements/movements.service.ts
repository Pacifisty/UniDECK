import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movement } from './movement.entity';
import { CreateMovementDto } from './dto/create-movement.dto';
import { ProtocolsService } from '../protocols/protocols.service';
import { DocumentStatus } from '../../common/enums/document-status.enum';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement)
    private movementsRepository: Repository<Movement>,
    private protocolsService: ProtocolsService,
  ) {}

  async create(createMovementDto: CreateMovementDto, userId: string): Promise<Movement> {
    const movement = this.movementsRepository.create({
      ...createMovementDto,
      fromUserId: userId,
    });
    const saved = await this.movementsRepository.save(movement);

    // Update protocol current sector and status based on movement
    const updateData: any = {};
    if (createMovementDto.toSectorId) {
      updateData.currentSectorId = createMovementDto.toSectorId;
      updateData.status = DocumentStatus.IN_PROGRESS;
    }
    if (createMovementDto.type === 'archive') {
      updateData.status = DocumentStatus.ARCHIVED;
    }
    if (Object.keys(updateData).length > 0) {
      await this.protocolsService.update(createMovementDto.protocolId, updateData);
    }

    return saved;
  }

  async findByProtocol(protocolId: string): Promise<Movement[]> {
    return this.movementsRepository.find({
      where: { protocolId },
      order: { createdAt: 'ASC' },
      relations: ['fromUser', 'fromSector', 'toSector', 'toUser'],
    });
  }

  async findBySector(sectorId: string, page = 1, limit = 20) {
    const [data, total] = await this.movementsRepository.findAndCount({
      where: { toSectorId: sectorId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['protocol', 'fromUser', 'fromSector'],
    });
    return { data, total, page, limit };
  }
}
