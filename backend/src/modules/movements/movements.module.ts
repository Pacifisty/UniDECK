import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './movement.entity';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { ProtocolsModule } from '../protocols/protocols.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movement]), ProtocolsModule],
  providers: [MovementsService],
  controllers: [MovementsController],
  exports: [MovementsService],
})
export class MovementsModule {}
