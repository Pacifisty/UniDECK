import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { Priority } from '../../../common/enums/priority.enum';

export class CreateProtocolDto {
  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  documentType?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsBoolean()
  @IsOptional()
  isExternal?: boolean;

  @IsString()
  @IsOptional()
  requesterName?: string;

  @IsString()
  @IsOptional()
  requesterEmail?: string;

  @IsString()
  @IsOptional()
  requesterCpfCnpj?: string;

  @IsString()
  @IsOptional()
  requesterPhone?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  originSectorId?: string;

  @IsString()
  @IsOptional()
  currentSectorId?: string;

  @IsString()
  @IsOptional()
  observations?: string;
}
