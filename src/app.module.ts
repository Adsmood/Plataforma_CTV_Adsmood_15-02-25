import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VastModule } from './modules/vast/vast.module';
import { TrackingModule } from './modules/tracking/tracking.module';
import { InteractiveModule } from './modules/interactive/interactive.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    VastModule,
    TrackingModule,
    InteractiveModule,
  ],
})
export class AppModule {}
