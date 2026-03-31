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
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { buildMulterOptions } from '../../common/multer.config';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', buildMulterOptions('documents')))
  create(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.documentsService.create(createDocumentDto, file, req.user.id);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('sectorId') sectorId?: string,
    @Query('protocolId') protocolId?: string,
  ) {
    return this.documentsService.findAll({ page: +page, limit: +limit, search, sectorId, protocolId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(id, updateDocumentDto);
  }
}
