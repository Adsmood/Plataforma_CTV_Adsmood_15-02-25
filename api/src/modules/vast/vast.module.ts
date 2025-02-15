import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VastController } from './vast.controller';
import { VastService } from './vast.service';
import { VastGeneratorService } from './services/vast-generator.service';
import { CreativeService } from './services/creative.service';
import { Creative } from './entities/creative.entity';
import { VideoVariant } from './entities/video-variant.entity';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Creative, VideoVariant])
    ],
    controllers: [VastController],
    providers: [VastService, VastGeneratorService, CreativeService],
    exports: [VastService]
})
export class VastModule {} 