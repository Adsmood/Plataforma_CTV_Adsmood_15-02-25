import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PlatformType {
  ROKU = 'roku',
  FIRE_TV = 'fire_tv',
  APPLE_TV = 'apple_tv',
  ANDROID_TV = 'android_tv',
  SAMSUNG_TV = 'samsung_tv',
  LG_TV = 'lg_tv',
  VIZIO = 'vizio',
  HULU = 'hulu',
  YOUTUBE_TV = 'youtube_tv',
  PLUTO_TV = 'pluto_tv',
  PEACOCK = 'peacock',
  OTHER = 'other',
}

export class GenerateVastDto {
  @ApiProperty({
    enum: PlatformType,
    description: 'Plataforma CTV objetivo',
    required: false,
  })
  @IsEnum(PlatformType)
  @IsOptional()
  platform?: PlatformType;

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
} 