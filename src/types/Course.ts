export type Course = {
  slug: string;
  title: string;
  description: string;
  url: string;
  provider: string;      // "Microsoft"
  group: string;         // "genai-foundations"
  order: number;         // for sorting
  createdAt?: any;
  updatedAt?: any;
};
