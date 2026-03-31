import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('movements')
@UseGuards(JwtAuthGuard)
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  create(@Body() createMovementDto: CreateMovementDto, @Request() req) {
    return this.movementsService.create(createMovementDto, req.user.id);
  }

  @Get('protocol/:protocolId')
  findByProtocol(@Param('protocolId') protocolId: string) {
    return this.movementsService.findByProtocol(protocolId);
  }

  @Get('sector/:sectorId')
  findBySector(
    @Param('sectorId') sectorId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.movementsService.findBySector(sectorId, +page, +limit);
  }
}
