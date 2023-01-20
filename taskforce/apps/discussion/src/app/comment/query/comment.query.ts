import { DuscussionDefaultValueEnum } from "../../../assets/constant/constants";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class CommentQuery {
  @Transform(({ value }) => {
    const numValue = +value;
    if (numValue < 1) {
      return DuscussionDefaultValueEnum.DEFAULT_COMMENT_COUNT
    }

    return numValue;
  })
  @IsNumber()
  @IsOptional()
  public limit = DuscussionDefaultValueEnum.DEFAULT_COMMENT_COUNT;

  @Transform(({ value }) => +value || DuscussionDefaultValueEnum.DEFAULT_PAGINATION_COUNT)
  @IsNumber()
  @IsOptional()
  public page = DuscussionDefaultValueEnum.DEFAULT_PAGINATION_COUNT;
}
