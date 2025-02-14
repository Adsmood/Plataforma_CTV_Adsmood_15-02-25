import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class TrackingQueryDto {
  @ApiProperty({ required: false, description: 'Cache buster' })
  @IsString()
  @IsOptional()
  cb?: string;

  @ApiProperty({ required: false, description: 'Timestamp' })
  @IsString()
  @IsOptional()
  ts?: string;

  @ApiProperty({ required: false, description: 'ID de campaña' })
  @IsString()
  @IsOptional()
  campaignId?: string;

  @ApiProperty({ required: false, description: 'ID de creativo' })
  @IsString()
  @IsOptional()
  creativeId?: string;

  @ApiProperty({ required: false, description: 'ID de inserción' })
  @IsString()
  @IsOptional()
  insertionId?: string;

  @ApiProperty({ required: false, description: 'ID de sitio' })
  @IsString()
  @IsOptional()
  siteId?: string;

  @ApiProperty({ required: false, description: 'ID de dispositivo' })
  @IsString()
  @IsOptional()
  deviceId?: string;
}

export class TrackEventDto {
  @ApiProperty({ description: 'Tipo de evento interactivo' })
  @IsString()
  type: string;

  @ApiProperty({ required: false, description: 'Datos adicionales del evento' })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
} 