import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 60 * 1000, // 1 hora
      max: 100, // máximo 100 items en caché
    }),
    ScheduleModule.forRoot(),
    ConfigModule,
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule {} 