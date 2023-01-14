import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRoleEnum } from "@taskforce/shared-types";
import { UserRoleType } from "libs/shared-types/src/lib/type/user-role.type";
import { Document } from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserEntity extends Document { }

@Schema({
  collection: 'users',
  discriminatorKey: 'role',
  timestamps: true,
})
export class UserEntity {
  @Prop({
    type: String,
    required: true,
    enum: UserRoleEnum,
  })
  public role: UserRoleType;
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);
