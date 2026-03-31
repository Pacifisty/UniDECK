import { PartialType } from '@nestjs/mapped-types';
import { CreateProtocolDto } from './create-protocol.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { DocumentStatus } from '../../../common/enums/document-status.enum';

export class UpdateProtocolDto extends PartialType(CreateProtocolDto) {
  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;
}
