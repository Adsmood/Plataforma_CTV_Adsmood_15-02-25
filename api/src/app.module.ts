import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InteractiveModule } from './modules/interactive/interactive.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MetricsModule } from './modules/metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    InteractiveModule,
    TrackingModule,
    AuthModule,
    MetricsModule,
  ],
})
export class AppModule {} 