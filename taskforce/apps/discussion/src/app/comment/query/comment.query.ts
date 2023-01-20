import { DEFAULT_COMMENT_COUNT, DEFAULT_PAGINATION_COUNT } from "../../../assets/constants";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class CommentQuery {
  @Transform(({ value }) => {
    const numValue = +value;
    if (numValue < 1) {
      return DEFAULT_COMMENT_COUNT
    }

    return numValue;
  })
  @IsNumber()
  @IsOptional()
  public limit = DEFAULT_COMMENT_COUNT;

  @Transform(({ value }) => +value || DEFAULT_PAGINATION_COUNT)
  @IsNumber()
  @IsOptional()
  public page = DEFAULT_PAGINATION_COUNT;
}
