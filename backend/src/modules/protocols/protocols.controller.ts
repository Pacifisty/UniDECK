import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProtocolsService } from './protocols.service';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DocumentStatus } from '../../common/enums/document-status.enum';

@Controller('protocols')
@UseGuards(JwtAuthGuard)
export class ProtocolsController {
  constructor(private readonly protocolsService: ProtocolsService) {}

  @Post()
  create(@Body() createProtocolDto: CreateProtocolDto, @Request() req) {
    return this.protocolsService.create(createProtocolDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('status') status?: DocumentStatus,
    @Query('sectorId') sectorId?: string,
    @Query('isExternal') isExternal?: string,
  ) {
    return this.protocolsService.findAll({
      page: +page,
      limit: +limit,
      search,
      status,
      sectorId,
      isExternal: isExternal !== undefined ? isExternal === 'true' : undefined,
    });
  }

  @Get('stats')
  getStats() {
    return this.protocolsService.getStats();
  }

  @Get('by-number/:number')
  findByNumber(@Param('number') number: string) {
    return this.protocolsService.findByNumber(decodeURIComponent(number));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.protocolsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProtocolDto: UpdateProtocolDto) {
    return this.protocolsService.update(id, updateProtocolDto);
  }

  @Post(':id/attachments')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOAD_DIR || './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  uploadAttachment(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.protocolsService.addAttachment(id, file.path);
  }
}
