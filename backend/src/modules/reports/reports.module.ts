import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Protocol } from '../protocols/protocol.entity';
import { Movement } from '../movements/movement.entity';
import { User } from '../users/user.entity';
import { Sector } from '../sectors/sector.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Protocol, Movement, User, Sector]),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
