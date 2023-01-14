import { HttpService } from "@nestjs/axios";
import { CanActivate, ExecutionContext, Injectable, Logger, LoggerService } from "@nestjs/common";
import { MicroserviceUrlEnum } from "../enum/microservice-url.enum";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger: LoggerService = new Logger(AuthGuard.name);

  constructor (
    private readonly httpService: HttpService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();

    const { data } = await this.httpService.axiosRef.get(`${MicroserviceUrlEnum.Auth}/checktoken`, {
      headers: { 'Authorization': req.headers['authorization'] },
    })
    .catch(err => { throw err });

    req['user'] = data;

    return true;
  }

}
