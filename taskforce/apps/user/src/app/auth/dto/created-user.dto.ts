import { Expose } from "class-transformer";

export class CreatedUserDto {
  @Expose()
  public email: string;

  @Expose()
  public firstname: string;

  @Expose()
  public role: string;
}
