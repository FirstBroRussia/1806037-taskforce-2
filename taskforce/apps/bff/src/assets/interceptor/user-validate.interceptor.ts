import { HttpService } from "@nestjs/axios";
import { CallHandler, ExecutionContext, Injectable, Logger, LoggerService, NestInterceptor } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class UserValidateInterceptor implements NestInterceptor {
  private readonly logger: LoggerService = new Logger(UserValidateInterceptor.name);

  constructor (
    private readonly httpService: HttpService,
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request & { user } = context.switchToHttp().getRequest();
    const taskId = req.params?.id;
    const userId = req.user.sub;
    // req.body['userId'] = userId;



    return next.handle();
  }
}

