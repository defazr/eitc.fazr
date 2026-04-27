import type { TaxOffice, Region, RegionKey } from "./types";
import { taxOffices, regions } from "./taxOffices";

const regionsByKey = new Map<RegionKey, Region>(
  regions.map((r) => [r.key, r])
);
const regionsBySlug = new Map<string, Region>(
  regions.map((r) => [r.slug, r])
);

/** key 기반 조회 (내부용 — 변경 안전) */
export function getRegionByKey(key: RegionKey): Region | undefined {
  return regionsByKey.get(key);
}

/** slug 기반 조회 (라우팅용 — URL 변경 대응) */
export function getRegionBySlug(slug: string): Region | undefined {
  return regionsBySlug.get(slug);
}

/** 전체 지역 목록 */
export function getAllRegions(): Region[] {
  return regions;
}

/** 특정 지역 + 자치구로 세무서 조회 */
export function getTaxOfficesByDistrict(
  region: RegionKey,
  district: string
): TaxOffice[] {
  const r = regionsByKey.get(region);
  if (!r) return [];
  const officeNames = r.districtToOffices[district];
  if (!officeNames) return [];
  return r.taxOffices.filter((o) => officeNames.includes(o.name));
}

/** 세무서 이름/주소 검색 */
export function searchTaxOffice(query: string): TaxOffice[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return taxOffices.filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q) ||
      o.managementArea.toLowerCase().includes(q)
  );
}
