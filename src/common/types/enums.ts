import { statusEnum, roleEnum } from "src/database/schemas";
import { z } from "zod/v4";

export const UserStatusEnum = z.enum(statusEnum.enumValues).enum;
export const UserRoleEnum = z.enum(roleEnum.enumValues).enum;