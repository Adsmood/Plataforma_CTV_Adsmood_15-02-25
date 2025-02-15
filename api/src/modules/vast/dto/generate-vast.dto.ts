import { IsOptional, IsString, IsEnum, IsUrl, IsObject, ValidateNested, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum PlatformType {
  ROKU = 'roku',
  FIRE_TV = 'fireTV',
  APPLE_TV = 'appleTV',
  ANDROID_TV = 'androidTV',
  SAMSUNG_TV = 'samsungTV',
  LG_TV = 'lgTV',
  VIZIO = 'vizio',
  HULU = 'hulu',
  YOUTUBE_TV = 'youtubeTV',
  PLUTO_TV = 'plutoTV',
  PEACOCK = 'peacock',
  OTHER = 'other',
}

export class InteractiveDataDto {
  @ApiProperty({
    description: 'URL del overlay interactivo',
    required: false
  })
  @IsUrl()
  @IsOptional()
  overlayUrl?: string;

  @ApiProperty({
    description: 'URL de destino al hacer clic',
    required: true
  })
  @IsUrl()
  clickThroughUrl!: string;

  @ApiProperty({
    description: 'Parámetros personalizados para la interactividad',
    required: false,
    type: 'object'
  })
  @IsObject()
  @IsOptional()
  customParams?: Record<string, string>;
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

  @ApiProperty({
    description: 'Datos de interactividad',
    required: false,
    type: InteractiveDataDto
  })
  @ValidateNested()
  @Type(() => InteractiveDataDto)
  @IsOptional()
  interactiveData?: InteractiveDataDto;

  @ApiProperty({
    description: 'Habilitar verificación de terceros',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  enableThirdPartyVerification?: boolean;
} 