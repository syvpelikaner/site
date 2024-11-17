import { z } from "astro:content";

export const projectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  img: z.string(),
});
