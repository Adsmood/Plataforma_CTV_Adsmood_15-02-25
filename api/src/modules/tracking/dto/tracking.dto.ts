import { IsString, IsObject, IsOptional } from 'class-validator';

export class TrackEventDto {
  @IsString()
  type: string;

  @IsString()
  adId: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class GetEventsQueryDto {
  @IsString()
  @IsOptional()
  type?: string;
} 