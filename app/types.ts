import type { z } from "zod";
import type { authSchema, contactSchema, importMappingSchema, mappingMap } from "~/schemas/schemas";

export enum ImportStatus {
  ON_HOLD = 'On Hold',
  PROCESSING = 'Processing',
  FAILED = 'Failed',
  FINISHED = 'Finished',
}

export type PageAndLimit = {
  page: number
  limit: number
}

export type ImportMappingType = z.infer<typeof importMappingSchema>;
export type ContactPayloadType = z.infer<typeof contactSchema>;
export type MappingMap = z.infer<typeof mappingMap>;
export type AuthPayload = z.infer<typeof authSchema>;