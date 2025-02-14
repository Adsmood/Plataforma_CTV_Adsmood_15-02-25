import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { InteractiveModule } from './modules/interactive/interactive.module';
import { TrackingModule } from './modules/tracking/tracking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    InteractiveModule,
    TrackingModule,
  ],
})
export class AppModule {}
