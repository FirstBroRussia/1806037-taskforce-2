import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { CustomError } from "@taskforce/core";
import { Observable } from "rxjs";
import { ExceptionEnum } from "../enum/exception.enum";
import { UserRoleEnum } from "../enum/user-role.enum";

@Injectable()
export class CustomerRoleInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (req.user.role !== UserRoleEnum.Customer) {
      throw new CustomError('The user-performer does not have access to this section', ExceptionEnum.Forbidden);
    }

    return next.handle();
  }
}

