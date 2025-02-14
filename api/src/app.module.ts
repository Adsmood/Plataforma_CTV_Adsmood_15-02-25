import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VastModule } from './modules/vast/vast.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { getTypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    VastModule,
    TrackingModule,
    AnalyticsModule,
  ],
})
export class AppModule {} 