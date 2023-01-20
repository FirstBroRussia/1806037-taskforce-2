import { SetMetadata } from "@nestjs/common";
import { MetadataEnum } from "../../../assets/enum/metadata.enum";

export const LogoutMeta = (...value: string[]) => SetMetadata(MetadataEnum.Logout, [value]);
