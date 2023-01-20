import { EnvValidationMessage, PortValueEnum } from "@taskforce/shared-types";
import { plainToInstance } from "class-transformer";
import { IsNumber, IsString, Max, Min, validateSync } from "class-validator";

class EnvironmentsConfig {
  @IsString({
    message: EnvValidationMessage.MongoDBNameRequired,
  })
  public MONGO_DB: string;

  @IsString({
    message: EnvValidationMessage.MongoDBHostRequired,
  })
  public MONGO_HOST: string;

  @IsNumber({}, {
    message: EnvValidationMessage.MongoDBPortRequired,
  })
  @Min(PortValueEnum.MinValue)
  @Max(PortValueEnum.MaxValue)
  public MONGO_PORT: number;

  @IsString({
    message: EnvValidationMessage.MongoDBUserRequired,
  })
  public MONGO_USER: string;

  @IsString({
    message: EnvValidationMessage.MongoDBPasswordRequired,
  })
  public MONGO_PASSWORD: string;

  @IsString({
    message: EnvValidationMessage.MongoDBBaseAuthRequired,
  })
  public MONGO_AUTH_BASE: string;
}

export function validateDiscussionEnvironments(config: Record<string, unknown>) {
  const environmentsConfig = plainToInstance(
    EnvironmentsConfig,
    config,
    { enableImplicitConversion: true },
  );

  const errors = validateSync(
    environmentsConfig, {
      skipMissingProperties: false
    }
  );

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return environmentsConfig;
}
