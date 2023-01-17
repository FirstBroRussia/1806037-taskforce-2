import { Expose } from "class-transformer";

export class RequestUserDataDto {
  @Expose()
  sub: string;

  @Expose()
  authId: string;

  @Expose()
  email: string;

  @Expose()
  role: string;
}
