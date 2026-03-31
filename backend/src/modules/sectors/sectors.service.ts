import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sector } from './sector.entity';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';

@Injectable()
export class SectorsService {
  constructor(
    @InjectRepository(Sector)
    private sectorsRepository: Repository<Sector>,
  ) {}

  async create(createSectorDto: CreateSectorDto): Promise<Sector> {
    const sector = this.sectorsRepository.create(createSectorDto);
    return this.sectorsRepository.save(sector);
  }

  async findAll() {
    return this.sectorsRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
      relations: ['parent'],
    });
  }

  async findOne(id: string): Promise<Sector> {
    const sector = await this.sectorsRepository.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!sector) {
      throw new NotFoundException(`Sector ${id} not found`);
    }
    return sector;
  }

  async update(id: string, updateSectorDto: UpdateSectorDto): Promise<Sector> {
    const sector = await this.findOne(id);
    Object.assign(sector, updateSectorDto);
    return this.sectorsRepository.save(sector);
  }

  async remove(id: string): Promise<void> {
    const sector = await this.findOne(id);
    sector.isActive = false;
    await this.sectorsRepository.save(sector);
  }
}
