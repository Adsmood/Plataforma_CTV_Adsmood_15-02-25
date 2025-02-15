import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { Impression } from './entities/impression.entity';
import { VideoEvent } from './entities/video-event.entity';
import { Interaction } from './entities/interaction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Impression,
            VideoEvent,
            Interaction
        ])
    ],
    controllers: [TrackingController],
    providers: [TrackingService],
    exports: [TrackingService]
})
export class TrackingModule {} 