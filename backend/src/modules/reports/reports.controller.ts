import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }

  @Get('protocols-by-period')
  getProtocolsByPeriod(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getProtocolsByPeriod(startDate, endDate);
  }

  @Get('top-sectors')
  getTopSectorsByDemand() {
    return this.reportsService.getTopSectorsByDemand();
  }

  @Get('overdue')
  getOverdueProtocols() {
    return this.reportsService.getOverdueProtocols();
  }
}
