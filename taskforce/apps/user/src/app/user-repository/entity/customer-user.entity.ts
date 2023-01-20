import * as dayjs from 'dayjs';
import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { UserInterface, UserRoleEnum, UserRoleType } from '@taskforce/shared-types';
import { getHashPassword } from '@taskforce/core';
import { CreateUserDto } from '../../auth/dto/create-user.dto';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomerUserEntity extends Document { }

@Schema({
  collection: 'users',
  timestamps: true,
})
export class CustomerUserEntity implements UserInterface {
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
  public tasks: object[];

  public fillEntity(customerUser: CreateUserDto): this {
    this.email = customerUser.email;
    this.role = customerUser.role;
    this.firstname = customerUser.firstname;
    this.lastname = customerUser.lastname;
    this.dateBirth = dayjs(customerUser.dateBirth).toDate();
    this.city = customerUser.city;
    this.avatar = customerUser?.avatar;
    this.description = '';
    this.tasks = [];

    return this;
  }

  public setPassword(password: string): this {
    this.passwordHash = getHashPassword(password);

    return this;
  }

}

export const CustomerUserSchema = SchemaFactory.createForClass(CustomerUserEntity);
