import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { ConfigService } from '@nestjs/config';
import { getMongoConnectionString } from "@taskforce/core";
import { NotifyEnvInterface } from "./notify-env.interface";

export function getNotifyMongoDbConfig(): MongooseModuleAsyncOptions {
  return {
    // connectionName: 'notify',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService<NotifyEnvInterface>) => {
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
