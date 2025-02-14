import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VastModule } from './modules/vast/vast.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    VastModule,
    TrackingModule,
    AnalyticsModule,
  ],
})
export class AppModule {} 