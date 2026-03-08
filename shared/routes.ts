import { z } from 'zod';
import { insertRoastSchema, roasts } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  roasts: {
    create: {
      method: 'POST' as const,
      path: '/api/roasts',
      input: z.object({ topic: z.string().optional() }),
      responses: {
        201: z.custom<typeof roasts.$inferSelect>(),
        500: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/roasts',
      responses: {
        200: z.array(z.custom<typeof roasts.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type RoastInput = z.infer<typeof api.roasts.create.input>;
