import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsObject, IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum InteractionType {
  BUTTON = 'button',
  CAROUSEL = 'carousel',
  GALLERY = 'gallery',
  TRIVIA = 'trivia',
  QR = 'qr',
  CHOICE = 'choice',
}

export enum OverlayType {
  HTML = 'html',
  IMAGE = 'image',
  VIDEO = 'video',
}

export class PositionDto {
  @ApiProperty({ description: 'Posición X (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  x: number;

  @ApiProperty({ description: 'Posición Y (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  y: number;
}

export class SizeDto {
  @ApiProperty({ description: 'Ancho (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  width: number;

  @ApiProperty({ description: 'Alto (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  height: number;
}

export class CreateInteractionDto {
  @ApiProperty({ enum: InteractionType, description: 'Tipo de interacción' })
  @IsEnum(InteractionType)
  type: InteractionType;

  @ApiProperty({ description: 'Configuración específica de la interacción' })
  @IsObject()
  config: Record<string, any>;

  @ApiProperty({ type: PositionDto, description: 'Posición de la interacción' })
  @Type(() => PositionDto)
  @IsObject()
  position: PositionDto;

  @ApiProperty({ type: SizeDto, description: 'Tamaño de la interacción' })
  @Type(() => SizeDto)
  @IsObject()
  size: SizeDto;

  @ApiProperty({ description: 'Tiempo de inicio en segundos' })
  @IsNumber()
  @Min(0)
  startTime: number;

  @ApiProperty({ description: 'Tiempo de fin en segundos (opcional)', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  endTime?: number;
}

export class CreateOverlayDto {
  @ApiProperty({ enum: OverlayType, description: 'Tipo de overlay' })
  @IsEnum(OverlayType)
  type: OverlayType;

  @ApiProperty({ description: 'Contenido del overlay (URL o HTML)' })
  @IsString()
  content: string;

  @ApiProperty({ type: PositionDto, description: 'Posición del overlay' })
  @Type(() => PositionDto)
  @IsObject()
  position: PositionDto;

  @ApiProperty({ type: SizeDto, description: 'Tamaño del overlay' })
  @Type(() => SizeDto)
  @IsObject()
  size: SizeDto;

  @ApiProperty({ description: 'Tiempo de inicio en segundos' })
  @IsNumber()
  @Min(0)
  startTime: number;

  @ApiProperty({ description: 'Tiempo de fin en segundos (opcional)', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  endTime?: number;

  @ApiProperty({ description: 'Índice Z del overlay', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  zIndex?: number;

  @ApiProperty({ description: 'Estilos CSS adicionales', required: false })
  @IsObject()
  @IsOptional()
  styles?: Record<string, any>;
}

export class UpdateInteractionDto extends CreateInteractionDto {}
export class UpdateOverlayDto extends CreateOverlayDto {} 