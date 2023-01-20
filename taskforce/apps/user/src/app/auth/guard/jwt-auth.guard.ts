/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, LoggerService, UnauthorizedException } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common/interfaces";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { CustomError } from "@taskforce/core";
import { ExceptionEnum } from "@taskforce/shared-types";
import { MetadataEnum } from "../../../assets/enum/metadata.enum";
import { JwtPayloadDto } from "../dto/jwt-payload.dto";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger: LoggerService = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.get(MetadataEnum.RefreshToken, context.getHandler())) {
      await super.canActivate(context);

      return true;
    }

    if (this.reflector.get(MetadataEnum.Logout, context.getHandler())) {
      const accessToken = context.switchToHttp().getRequest().headers['authorization'].split(' ')[1];

      const jwtPayload: JwtPayloadDto = await this.jwtService.verifyAsync(accessToken, {
        ignoreExpiration: true,
      }).catch((err) => {
        throw new CustomError(err, ExceptionEnum.Forbidden);
      });

      const user = {
        authId: jwtPayload.authId,
      };

      context.switchToHttp().getRequest()['user'] = user;

      await super.canActivate(context);
      return true;
    }

    await super.canActivate(context);
    return true;
  }
}
