/**
 * key vs slug 분리 원칙
 *
 * - key: 내부 식별자, 변경 X
 *   - 코드 내부에서 데이터 참조용
 *   - 예: getRegionByKey("seoul")
 *
 * - slug: URL용, 변경 가능
 *   - 시군구 확장 시 패턴 변경 대응
 *   - SEO 리팩토링 대응
 *   - 예: /regions/seoul, /regions/seoul-gangnam-gu
 */

export type RegionKey =
  | "seoul"
  | "busan"
  | "daegu"
  | "incheon"
  | "gwangju"
  | "daejeon"
  | "ulsan"
  | "sejong"
  | "gyeonggi"
  | "gangwon"
  | "chungbuk"
  | "chungnam"
  | "jeonbuk"
  | "jeonnam"
  | "gyeongbuk"
  | "gyeongnam"
  | "jeju";

export interface TaxOffice {
  name: string;
  address: string;
  postalCode: string;
  phone: string;
  fax: string;
  code: string;
  region: RegionKey;
  regionName: string;
  districts: string[];
  subDistricts?: string[];
  managementArea: string;
}

export interface Region {
  key: RegionKey;
  slug: string;
  name: string;
  fullName: string;
  taxOffices: TaxOffice[];
  districtToOffices: Record<string, string[]>;
}

// TODO: 6월 시군구 확장 시 추가 예정
// export interface District {
//   key: string;
//   slug: string;
//   name: string;
//   parentRegion: RegionKey;
//   taxOfficeNames: string[];
// }
