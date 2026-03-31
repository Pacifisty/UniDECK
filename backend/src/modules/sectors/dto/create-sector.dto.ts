import { IsString, IsOptional } from 'class-validator';

export class CreateSectorDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  organ?: string;

  @IsString()
  @IsOptional()
  secretariat?: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}
