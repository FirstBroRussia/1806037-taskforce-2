import * as dayjs from 'dayjs';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserInterface, UserRoleEnum } from "@taskforce/shared-types";
import { getHashPassword } from '@taskforce/core';

import { CreateUserDto } from "../../auth/dto/create-user.dto";
import { UserRoleType } from 'libs/shared-types/src/lib/type/user-role.type';
import { Document } from 'mongoose';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PerformerUserEntity extends Document { }

@Schema({
  collection: 'users',
  timestamps: true,
})
export class PerformerUserEntity implements UserInterface {
  @Prop({
    required: true,
    unique: true
  })
  public email: string;

  @Prop({
    required: true,
  })
  public passwordHash: string;

  @Prop({
    required: true,
    type: String,
    enum: UserRoleEnum,
  })
  public role: UserRoleType;

  @Prop({
    required: true,
  })
  public firstname: string;

  @Prop({
    required: true,
  })
  public lastname: string;

  @Prop({
    required: true,
  })
  public dateBirth: Date;

  @Prop({
    required: true,
  })
  public city: string;

  @Prop()
  public avatar: string;

  @Prop()
  public description: string;

  @Prop()
  public specialization: string[];

  @Prop()
  public rating: number;

  @Prop()
  public tasks: number[];

  @Prop()
  public failedTasks: string[];

  public fillEntity(customerUser: CreateUserDto): this {
    this.email = customerUser.email;
    this.role = customerUser.role;
    this.firstname = customerUser.firstname;
    this.lastname = customerUser.lastname;
    this.dateBirth = dayjs(customerUser.dateBirth).toDate();
    this.city = customerUser.city;
    this.avatar = customerUser?.avatar;
    this.description = '';
    this.specialization = [];
    this.rating = null;
    this.tasks = [];

    return this;
  }

  public setPassword(password: string): this {
    this.passwordHash = getHashPassword(password);

    return this;
  }

}

export const PerformerUserSchema = SchemaFactory.createForClass(PerformerUserEntity);
