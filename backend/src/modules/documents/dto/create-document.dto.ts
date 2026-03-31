import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ConfidentialityLevel } from '../document.entity';

export class CreateDocumentDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  documentType?: string;

  @IsEnum(ConfidentialityLevel)
  @IsOptional()
  confidentiality?: ConfidentialityLevel;

  @IsArray()
  @IsOptional()
  keywords?: string[];

  @IsString()
  @IsOptional()
  sectorId?: string;

  @IsString()
  @IsOptional()
  protocolId?: string;
}
