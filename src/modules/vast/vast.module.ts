import { Module } from '@nestjs/common';
import { VastController } from './vast.controller';
import { VastService } from './vast.service';

@Module({
  controllers: [VastController],
  providers: [VastService],
  exports: [VastService],
})
export class VastModule {} 