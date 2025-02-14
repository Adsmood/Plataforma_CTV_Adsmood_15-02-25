import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { InteractiveController } from './interactive.controller';
import { InteractiveService } from './interactive.service';

@Module({
  imports: [PrismaModule],
  controllers: [InteractiveController],
  providers: [InteractiveService],
  exports: [InteractiveService],
})
export class InteractiveModule {} 