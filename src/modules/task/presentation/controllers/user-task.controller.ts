import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ITaskRepository } from '../../domain/repositories/task.repository';
import { JwtAuthGuard } from '@/modules/auth/infra/guards/jwt.guard';
import { RolesGuard } from '@/modules/auth/infra/guards/roles.guard';
import { Roles } from '@/modules/auth/infra/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case';
import { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case';
import { CreateTaskDTO } from '../../application/dto/input/create-task.dto';
import { UpdateTaskDTO } from '../../application/dto/input/update-task.dto';
import { DeleteTaskDTO } from '../../application/dto/input/delete-task.dto';
import { ResponseTaskDTO } from '../../application/dto/output/response-task.dto';

@Controller('user/task')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class AdminTaskController {
    constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly createTaskUserCase: CreateTaskUseCase,
    private readonly updateTaskUserCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) {}
}
