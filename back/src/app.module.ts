import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RecordModule } from './record/record.module';
import { WorkTypeModule } from './work-type/work-type.module';

@Module({
  imports: [PrismaModule, RecordModule, WorkTypeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
