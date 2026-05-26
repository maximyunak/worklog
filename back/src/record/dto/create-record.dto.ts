import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecordDto {
  @IsNotEmpty()
  @IsString()
  executorName: string;

  @Type(() => Number)
  @IsNumber()
  volume: number;

  @IsNotEmpty()
  @IsString()
  unit: string;

  @IsNotEmpty()
  @IsDateString()
  workDate: string;

  @Type(() => Number)
  @IsNumber()
  workTypeId: number;
}
