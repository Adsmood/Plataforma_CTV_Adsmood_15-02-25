import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Impression } from '../tracking/entities/impression.entity';
import { VideoEvent } from '../tracking/entities/video-event.entity';
import { Interaction } from '../tracking/entities/interaction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Impression,
            VideoEvent,
            Interaction
        ])
    ],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    exports: [AnalyticsService]
})
export class AnalyticsModule {} 