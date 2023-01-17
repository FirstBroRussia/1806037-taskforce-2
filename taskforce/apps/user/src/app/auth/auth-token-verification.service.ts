import { Injectable, Logger, LoggerService } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthRepository } from "../auth-repository/auth.repository";
import { AuthUserEntity } from "../auth-repository/entity/auth-user.entity";

@Injectable()
export class AuthTokenVerificationService {
  private readonly logger: LoggerService = new Logger(AuthTokenVerificationService.name);
  private readonly intervalTime = 1000 * 30; // TODO 30 секунд между проверками

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {
    setInterval(this.checkAuthUsersForLifetime.bind(this), this.intervalTime);
  }

  private async checkAuthUsersForLifetime(): Promise<void> {
    const authUsers = await this.authRepository.getAllAuthUser() as unknown as AuthUserEntity[];
    for (const item of authUsers) {
      try {
        await this.jwtService.verifyAsync(item.refreshToken, {
          ignoreExpiration: false,
        });
      } catch (err) {
        await this.authRepository.removeAuthUser(item.email);
      }
    }
  }
}
