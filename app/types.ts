import type { z } from "zod";
import type { contactSchema, importMappingSchema, listContactsSchema } from "~/schemas/schemas";

export enum ImportStatus {
  ON_HOLD = 'On Hold',
  PROCESSING = 'Processing',
  FAILED = 'Failed',
  FINISHED = 'Finished',
}

export type Paginated<Item> = {
  items: Item[]
  prevPage: number | undefined
  nextPage: number | undefined
}

export type PageAndLimit = {
  page: number
  limit: number
}


export type ImportMappingType = z.infer<typeof importMappingSchema>;

export type ContactPayloadType = z.infer<typeof contactSchema>;