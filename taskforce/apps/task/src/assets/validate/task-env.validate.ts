import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, Max, Min, validateSync } from 'class-validator';

const MIN_PORT = 0;
const MAX_PORT = 65535;

class EnvironmentsConfig {
  @IsString({
    message: 'Database URL is required',
  })
  public DATABASE_URL: string;

  @IsString({
    message: 'Rabbit user is required.'
  })
  public RABBIT_USER: string;

  @IsString({
    message: 'Rabbit password is required.'
  })
  public RABBIT_PASSWORD: string;

  @IsString({
    message: 'Rabbit host is required.'
  })
  public RABBIT_HOST: string;

  @IsNumber({}, {
    message: 'Rabbit port is required',
  })
  @Min(MIN_PORT)
  @Max(MAX_PORT)
  public RABBIT_PORT: number;

  @IsString({
    message: 'Rabbit queue is required.'
  })
  public RABBIT_TASKS_SERVICE_QUEUE: string;
}

export function validateTaskModuleEnvironments(config: Record<string, unknown>) {
  const environmentsConfig = plainToInstance(
    EnvironmentsConfig,
    config,
    { enableImplicitConversion: true  },
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

