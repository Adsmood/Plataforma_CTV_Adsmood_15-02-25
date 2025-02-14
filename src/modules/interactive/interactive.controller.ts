import { Controller } from '@nestjs/common';
import { InteractiveService } from './interactive.service';

@Controller('interactive')
export class InteractiveController {
  constructor(private readonly interactiveService: InteractiveService) {}
} 