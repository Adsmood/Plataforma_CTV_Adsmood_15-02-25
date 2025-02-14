import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {} 