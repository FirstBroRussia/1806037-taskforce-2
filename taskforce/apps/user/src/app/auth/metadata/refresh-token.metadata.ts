import { SetMetadata } from "@nestjs/common";
import { MetadataEnum } from "../../../assets/enum/metadata.enum";

export const RefreshTokenMeta = (...value: string[]) => SetMetadata(MetadataEnum.RefreshToken, [value]);
