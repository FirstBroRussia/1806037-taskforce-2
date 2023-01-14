import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { ConfigService } from '@nestjs/config';
import { getMongoConnectionString } from "@taskforce/core";
import { MongoDbEnvInterface } from "@taskforce/shared-types";

export function getDiscussionMongoDbConfig(): MongooseModuleAsyncOptions {
  return {
    inject: [ConfigService],
    useFactory: async (configService: ConfigService<MongoDbEnvInterface>) => {
      return {
      uri: getMongoConnectionString({
        username: configService.get<string>("MONGO_USER"),
        password: configService.get<string>("MONGO_PASSWORD"),
        host: configService.get<string>("MONGO_HOST"),
        port: configService.get<number>("MONGO_PORT"),
        authDatabase: configService.get<string>("MONGO_AUTH_BASE"),
        databaseName: configService.get<string>("MONGO_DB"),
      }),
    }},
  }
}
