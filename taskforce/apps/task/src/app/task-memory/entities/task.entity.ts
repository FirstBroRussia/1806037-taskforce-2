import { TaskInterface } from '@taskforce/shared-types';

export class TaskEntity implements TaskInterface {
  title: string;

  description: string;

  category: string;

  price?: number;

  lifeTime?: Date;

  image?: string;

  address?: string;

  tags?: string[];

  constructor () {

  }

}
