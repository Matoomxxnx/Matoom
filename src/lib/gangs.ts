import data from "../app/data/gangs.json";

export type Gang = {
  slug: string;
  name: string;
  description: string;
  members?: { name: string; role?: string; image?: string }[];
};

export const gangs = data as Gang[];

export const getGang = (slug: string) =>
  gangs.find((g) => g.slug.toLowerCase() === slug.toLowerCase());