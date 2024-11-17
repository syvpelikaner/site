import { defineCollection } from "astro:content";

import { projectSchema } from "./schemas/project";

const projectCollection = defineCollection({
  type: "content",
  schema: projectSchema,
});

export const collections = {
  project: projectCollection,
};
