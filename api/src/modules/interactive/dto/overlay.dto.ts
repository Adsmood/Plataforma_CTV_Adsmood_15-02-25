import { IsString, IsNumber, IsOptional, IsObject, IsIn } from 'class-validator';

export class CreateOverlayDto {
  @IsString()
  @IsIn(['html', 'image', 'video'])
  type: string;

  @IsString()
  content: string;

  @IsObject()
  position: { x: number; y: number };

  @IsObject()
  size: { width: number; height: number };

  @IsNumber()
  startTime: number;

  @IsNumber()
  @IsOptional()
  endTime?: number;

  @IsNumber()
  @IsOptional()
  zIndex?: number;

  @IsObject()
  @IsOptional()
  styles?: Record<string, any>;
}

export class UpdateOverlayDto {
  @IsString()
  @IsIn(['html', 'image', 'video'])
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsObject()
  @IsOptional()
  position?: { x: number; y: number };

  @IsObject()
  @IsOptional()
  size?: { width: number; height: number };

  @IsNumber()
  @IsOptional()
  startTime?: number;

  @IsNumber()
  @IsOptional()
  endTime?: number;

  @IsNumber()
  @IsOptional()
  zIndex?: number;

  @IsObject()
  @IsOptional()
  styles?: Record<string, any>;
} 