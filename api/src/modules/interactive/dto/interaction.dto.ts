import { IsString, IsNumber, IsOptional, IsObject, IsIn } from 'class-validator';

export class CreateInteractionDto {
  @IsString()
  @IsIn(['button', 'carousel', 'gallery', 'trivia', 'qr', 'choice'])
  type: string;

  @IsObject()
  config: Record<string, any>;

  @IsObject()
  position: { x: number; y: number };

  @IsObject()
  size: { width: number; height: number };

  @IsNumber()
  startTime: number;

  @IsNumber()
  @IsOptional()
  endTime?: number;
}

export class UpdateInteractionDto {
  @IsString()
  @IsIn(['button', 'carousel', 'gallery', 'trivia', 'qr', 'choice'])
  @IsOptional()
  type?: string;

  @IsObject()
  @IsOptional()
  config?: Record<string, any>;

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
} 