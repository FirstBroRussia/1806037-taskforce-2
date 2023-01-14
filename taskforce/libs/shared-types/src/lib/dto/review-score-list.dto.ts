import { Expose } from "class-transformer";

export class ReviewScoreListDto {
  @Expose()
  public score: number;
}
