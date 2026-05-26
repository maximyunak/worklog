import { Controller, Get } from '@nestjs/common';
import { WorkTypeService } from './work-type.service';

@Controller('work-type')
export class WorkTypeController {
  constructor(private readonly workTypeService: WorkTypeService) {}

  @Get()
  getAll() {
    return this.workTypeService.getAll();
  }
}
