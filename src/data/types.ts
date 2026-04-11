export interface Region {
  slug: string;
  province: string;
  name: string;
  fullName: string;
  type: "특별" | "우대";
  amount: number;
  area: "수도권" | "비수도권";
}

export interface RegionsData {
  meta: {
    source: string;
    lastUpdated: string;
    totalCount: number;
    specialCount: number;
    preferredCount: number;
    note: string;
  };
  regions: Region[];
}
