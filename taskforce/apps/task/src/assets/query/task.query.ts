import { ONE_VALUE } from "@taskforce/shared-types";
import { Transform } from "class-transformer";
import { IsArray, IsIn, IsNumber, IsOptional, IsString } from "class-validator";
import { TaskDefaultValueEnum } from "../constant/constants";

export class TaskQuery {
  @Transform(({ value }) => {
    const numValue = +value;
    if (numValue < ONE_VALUE) return TaskDefaultValueEnum.DEFAULT_TASKS_LIMIT;

    return numValue;
  })
  @IsNumber()
  @IsOptional()
  public limit = TaskDefaultValueEnum.DEFAULT_TASKS_LIMIT;

  @Transform(({ value }) => +value || TaskDefaultValueEnum.DEFAULT_PAGINATION_COUNT)
  @IsNumber()
  @IsOptional()
  public page = TaskDefaultValueEnum.DEFAULT_PAGINATION_COUNT;

  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsString({
    each: true,
  })
  @IsOptional()
  public categories?: string[];

  @Transform(({ value }) => value ? value.split(',') : undefined)
  @IsArray()
  @IsString({
    each: true
  })
  @IsOptional()
  public tags?: string[];

  @IsString()
  @IsOptional()
  public city?: string;

  @IsIn(['desc', 'popular'])
  @IsOptional()
  public sort: 'desc' | 'popular' = TaskDefaultValueEnum.DEFAULT_SORT_VALUE;
}
