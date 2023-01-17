import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthDataUserDto } from "../auth/dto/auth-data-user.dto";
import { UpdateAuthDataUserDto } from "../auth/dto/update-auth-data-user.dto";
import { AuthUserEntity } from "./entity/auth-user.entity";

@Injectable()
export class AuthRepository {

  constructor(
    @InjectModel(AuthUserEntity.name) private readonly authUserModel: Model<AuthUserEntity>,
  ) { }

  public async getAllAuthUser() {
    return await this.authUserModel.find({});
  }

  public async getAuthUserByEmail(email: string) {
    return await this.authUserModel.find({
      email: email,
    });
  }

  public async addAuthUser(dto: AuthDataUserDto): Promise<AuthUserEntity> {
    const newAuthUser = new AuthUserEntity().fillEntity(dto);
    const newAuthUserModel = new this.authUserModel(newAuthUser);

    return await newAuthUserModel.save();
  }

  public async updateAuthUser(dto: UpdateAuthDataUserDto): Promise<AuthUserEntity> {
    const { id, refreshToken } = dto;
    return await this.authUserModel.findByIdAndUpdate(
      id,
      {
        refreshToken: refreshToken,
      },
      {
        returnDocument: 'after',
      });
  }

  public async removeAuthUser(authId: string) {
    return await this.authUserModel.deleteOne({
      id: authId,
    });
  }
}
