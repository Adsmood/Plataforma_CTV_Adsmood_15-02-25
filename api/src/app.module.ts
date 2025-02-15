import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VastModule } from './modules/vast/vast.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { getTypeOrmConfig } from './config/typeorm.config';
import { ExportController } from './controllers/export.controller';
import { VideoConverterService } from './services/video-converter.service';
import { ConversionQueueService } from './services/conversion-queue.service';
import { StorageService } from './services/storage.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/conversions',
    }),
    EventEmitterModule.forRoot(),
  ],
  controllers: [ExportController],
  providers: [VideoConverterService, ConversionQueueService, StorageService],
})
export class AppModule {} 