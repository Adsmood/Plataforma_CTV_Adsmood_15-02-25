import { Module } from '@nestjs/common';
import { InteractiveService } from './interactive.service';
import { InteractiveController } from './interactive.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InteractiveController],
  providers: [InteractiveService],
  exports: [InteractiveService],
})
export class InteractiveModule {} 