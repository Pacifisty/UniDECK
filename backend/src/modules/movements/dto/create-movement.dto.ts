import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { MovementType } from '../movement.entity';

export class CreateMovementDto {
  @IsUUID()
  protocolId: string;

  @IsEnum(MovementType)
  type: MovementType;

  @IsString()
  @IsOptional()
  observations?: string;

  @IsString()
  @IsOptional()
  fromSectorId?: string;

  @IsString()
  @IsOptional()
  toSectorId?: string;

  @IsString()
  @IsOptional()
  toUserId?: string;
}
