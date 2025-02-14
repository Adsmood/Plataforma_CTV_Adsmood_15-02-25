import { IsOptional, IsString, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackEventDto {
  @ApiProperty({
    description: 'Timestamp del evento',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  timestamp?: number;

  @ApiProperty({
    description: 'IP del dispositivo',
    required: false,
  })
  @IsString()
  @IsOptional()
  ip?: string;

  @ApiProperty({
    description: 'User Agent del dispositivo',
    required: false,
  })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiProperty({
    description: 'ID de la campaña en DV360',
    required: false,
  })
  @IsString()
  @IsOptional()
  dv360CampaignId?: string;

  @ApiProperty({
    description: 'ID del creativo en DV360',
    required: false,
  })
  @IsString()
  @IsOptional()
  dv360CreativeId?: string;

  @ApiProperty({
    description: 'Datos adicionales del evento',
    required: false,
    type: 'object',
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 