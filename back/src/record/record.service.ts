import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecordService {
  constructor(private readonly prisma: PrismaService) {}
  create(createRecordDto: CreateRecordDto) {
    return this.prisma.workLog.create({
      data: createRecordDto,
      include: {
        workType: true,
      },
    });
  }

  findAll(date?: string) {
    return this.prisma.workLog.findMany({
      include: {
        workType: true,
      },
      where: date
        ? {
            workDate: {
              gte: new Date(date),
              lt: new Date(
                new Date(date).setDate(new Date(date).getDate() + 1),
              ),
            },
          }
        : {},
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} record`;
  }

  update(id: number, updateRecordDto: UpdateRecordDto) {
    return this.prisma.workLog.update({
      data: updateRecordDto,
      include: { workType: true },
      where: { id },
    });
  }

  remove(id: number) {
    return this.prisma.workLog.delete({
      where: { id },
    });
  }
}
