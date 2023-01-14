import { Expose } from "class-transformer";

export class TaskCategoryRdo {
  @Expose()
  public id: number;

  @Expose()
  public title: string;

  @Expose({
    name: 'posts'
  })
  public tasks: object[];
}
