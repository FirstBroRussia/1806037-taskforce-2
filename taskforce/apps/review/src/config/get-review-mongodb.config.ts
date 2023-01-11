import { MongooseModuleAsyncOptions } from "@nestjs/mongoose"
import { ConfigService } from '@nestjs/config';
import { getMongoConnectionString } from "@taskforce/core";
import { MongoDbEnvInterface } from "@taskforce/shared-types";

export const getReviewMongoDbConfig = (): MongooseModuleAsyncOptions => {
  return {
    // connectionName: 'review',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService<MongoDbEnvInterface>) => ({
      uri: getMongoConnectionString({
        username: configService.get<string>("MONGO_USER"),
        password: configService.get<string>("MONGO_PASSWORD"),
        host: configService.get<string>("MONGO_HOST"),
        port: configService.get<number>("MONGO_PORT"),
        authDatabase: configService.get<string>("MONGO_AUTH_BASE"),
        databaseName: configService.get<string>("MONGO_DB"),
      }),
    }),
  }
}
