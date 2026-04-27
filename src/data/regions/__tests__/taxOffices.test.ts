import { describe, expect, it } from "vitest";
import { taxOffices, regions } from "../taxOffices";
import {
  getRegionByKey,
  getRegionBySlug,
  getAllRegions,
  getTaxOfficesByDistrict,
  searchTaxOffice,
} from "../utils";

describe("taxOffices data", () => {
  it("전국 세무서 총 133개", () => {
    expect(taxOffices).toHaveLength(133);
  });

  it("서울 세무서 28개", () => {
    expect(taxOffices.filter((o) => o.region === "seoul")).toHaveLength(28);
  });

  it("경기 세무서 27개", () => {
    expect(taxOffices.filter((o) => o.region === "gyeonggi")).toHaveLength(27);
  });

  it("모든 세무서에 region이 매핑됨", () => {
    for (const o of taxOffices) {
      expect(o.region).toBeTruthy();
      expect(o.regionName).toBeTruthy();
    }
  });

  it("모든 세무서에 필수 필드가 존재", () => {
    for (const o of taxOffices) {
      expect(o.name).toBeTruthy();
      expect(o.address).toBeTruthy();
      expect(o.postalCode).toBeTruthy();
      expect(o.phone).toBeTruthy();
      expect(o.code).toBeTruthy();
      expect(o.managementArea).toBeTruthy();
    }
  });
});

describe("regions", () => {
  it("17개 시도 전부 존재", () => {
    expect(regions).toHaveLength(17);
    const keys = regions.map((r) => r.key);
    expect(keys).toContain("seoul");
    expect(keys).toContain("gyeonggi");
    expect(keys).toContain("jeju");
  });

  it("각 region에 key === slug (초기 설정)", () => {
    for (const r of regions) {
      expect(r.slug).toBe(r.key);
    }
  });

  it("districtToOffices에 빈 배열 없음", () => {
    for (const r of regions) {
      for (const [district, offices] of Object.entries(r.districtToOffices)) {
        expect(offices.length, `${r.name} ${district}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("서울 역매핑", () => {
  const seoul = regions.find((r) => r.key === "seoul")!;

  it("서울 25개 자치구 모두 매핑", () => {
    const SEOUL_GUS = [
      "강남구", "강동구", "강북구", "강서구", "관악구", "광진구",
      "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구",
      "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구",
      "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구",
    ];
    for (const gu of SEOUL_GUS) {
      expect(
        seoul.districtToOffices[gu],
        `${gu} 매핑 누락`
      ).toBeDefined();
    }
  });

  it("강남구 → 3개 세무서", () => {
    expect(seoul.districtToOffices["강남구"]).toHaveLength(3);
    expect(seoul.districtToOffices["강남구"]).toContain("강남세무서");
    expect(seoul.districtToOffices["강남구"]).toContain("삼성세무서");
    expect(seoul.districtToOffices["강남구"]).toContain("역삼세무서");
  });

  it("송파구 → 2개 세무서", () => {
    expect(seoul.districtToOffices["송파구"]).toHaveLength(2);
    expect(seoul.districtToOffices["송파구"]).toContain("송파세무서");
    expect(seoul.districtToOffices["송파구"]).toContain("잠실세무서");
  });

  it("서초구 → 2개 세무서", () => {
    expect(seoul.districtToOffices["서초구"]).toHaveLength(2);
    expect(seoul.districtToOffices["서초구"]).toContain("반포세무서");
    expect(seoul.districtToOffices["서초구"]).toContain("서초세무서");
  });
});

describe("샘플 검증", () => {
  it("강남세무서 전화번호", () => {
    const office = taxOffices.find((o) => o.name === "강남세무서");
    expect(office?.phone).toBe("02-519-4200");
  });

  it("잠실세무서 관할구역에 잠실동 포함", () => {
    const office = taxOffices.find((o) => o.name === "잠실세무서");
    expect(office?.managementArea).toContain("잠실동");
    expect(office?.managementArea).toContain("풍납동");
  });

  it("반포세무서 관할구역에 반포동 포함", () => {
    const office = taxOffices.find((o) => o.name === "반포세무서");
    expect(office?.managementArea).toContain("반포동");
    expect(office?.managementArea).toContain("방배동");
  });

  it("제주세무서는 jeju 지역", () => {
    const office = taxOffices.find((o) => o.name === "제주세무서");
    expect(office?.region).toBe("jeju");
  });
});

describe("utils", () => {
  it("getRegionByKey", () => {
    const seoul = getRegionByKey("seoul");
    expect(seoul?.name).toBe("서울");
    expect(seoul?.taxOffices).toHaveLength(28);
  });

  it("getRegionBySlug", () => {
    const seoul = getRegionBySlug("seoul");
    expect(seoul?.key).toBe("seoul");
  });

  it("getAllRegions는 17개", () => {
    expect(getAllRegions()).toHaveLength(17);
  });

  it("getTaxOfficesByDistrict 강남구", () => {
    const offices = getTaxOfficesByDistrict("seoul", "강남구");
    expect(offices).toHaveLength(3);
  });

  it("searchTaxOffice 강남", () => {
    const results = searchTaxOffice("강남");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((o) => o.name === "강남세무서")).toBe(true);
  });

  it("searchTaxOffice 빈 문자열", () => {
    expect(searchTaxOffice("")).toHaveLength(0);
  });
});
