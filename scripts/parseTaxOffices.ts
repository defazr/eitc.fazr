/**
 * 1회성 변환 스크립트: 국세청 세무서 CSV → TypeScript 데이터
 *
 * Usage: npx tsx scripts/parseTaxOffices.ts <csv-path>
 * Output: src/data/regions/taxOffices.ts
 *
 * CSV 인코딩이 EUC-KR이면 먼저 변환:
 *   iconv -f EUC-KR -t UTF-8 input.csv > input_utf8.csv
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// ─── Types (inline for script independence) ───

type RegionKey =
  | "seoul" | "busan" | "daegu" | "incheon" | "gwangju"
  | "daejeon" | "ulsan" | "sejong" | "gyeonggi" | "gangwon"
  | "chungbuk" | "chungnam" | "jeonbuk" | "jeonnam"
  | "gyeongbuk" | "gyeongnam" | "jeju";

interface TaxOfficeRaw {
  name: string;
  address: string;
  postalCode: string;
  phone: string;
  fax: string;
  code: string;
  region: RegionKey;
  regionName: string;
  districts: string[];
  subDistricts: string[];
  managementArea: string;
}

interface RegionDef {
  key: RegionKey;
  name: string;
  fullName: string;
}

// ─── Constants ───

const REGION_DEFS: RegionDef[] = [
  { key: "seoul", name: "서울", fullName: "서울특별시" },
  { key: "busan", name: "부산", fullName: "부산광역시" },
  { key: "daegu", name: "대구", fullName: "대구광역시" },
  { key: "incheon", name: "인천", fullName: "인천광역시" },
  { key: "gwangju", name: "광주", fullName: "광주광역시" },
  { key: "daejeon", name: "대전", fullName: "대전광역시" },
  { key: "ulsan", name: "울산", fullName: "울산광역시" },
  { key: "sejong", name: "세종", fullName: "세종특별자치시" },
  { key: "gyeonggi", name: "경기", fullName: "경기도" },
  { key: "gangwon", name: "강원", fullName: "강원특별자치도" },
  { key: "chungbuk", name: "충북", fullName: "충청북도" },
  { key: "chungnam", name: "충남", fullName: "충청남도" },
  { key: "jeonbuk", name: "전북", fullName: "전북특별자치도" },
  { key: "jeonnam", name: "전남", fullName: "전라남도" },
  { key: "gyeongbuk", name: "경북", fullName: "경상북도" },
  { key: "gyeongnam", name: "경남", fullName: "경상남도" },
  { key: "jeju", name: "제주", fullName: "제주특별자치도" },
];

// Address prefix → RegionKey mapping
const ADDRESS_PREFIXES: [string, RegionKey][] = [
  ["서울특별시", "seoul"],
  ["서울", "seoul"],
  ["부산광역시", "busan"],
  ["부산시", "busan"],
  ["부산", "busan"],
  ["대구광역시", "daegu"],
  ["인천광역시", "incheon"],
  ["인천시", "incheon"],
  ["광주광역시", "gwangju"],
  ["광주", "gwangju"],
  ["대전광역시", "daejeon"],
  ["울산광역시", "ulsan"],
  ["세종특별자치시", "sejong"],
  ["경기도", "gyeonggi"],
  ["경기", "gyeonggi"],
  ["강원특별자치도", "gangwon"],
  ["충청북도", "chungbuk"],
  ["충북", "chungbuk"],
  ["충청남도", "chungnam"],
  ["충남", "chungnam"],
  ["전북특별자치도", "jeonbuk"],
  ["전라남도", "jeonnam"],
  ["전남", "jeonnam"],
  ["경상북도", "gyeongbuk"],
  ["경북", "gyeongbuk"],
  ["경상남도", "gyeongnam"],
  ["경남", "gyeongnam"],
  ["제주특별자치도", "jeju"],
];

// Cities without province prefix → RegionKey
const CITY_TO_REGION: Record<string, RegionKey> = {
  "구리시": "gyeonggi",
  "시흥시": "gyeonggi",
  "용인시": "gyeonggi",
  "파주시": "gyeonggi",
  "안산시": "gyeonggi",
  "안양시": "gyeonggi",
  "부천시": "gyeonggi",
  "인천시": "incheon",
  "부산시": "busan",
};

// Province name variants in management area text
const PROVINCE_VARIANTS: [string, RegionKey][] = [
  ["서울특별시", "seoul"],
  ["부산광역시", "busan"],
  ["대구광역시", "daegu"],
  ["인천광역시", "incheon"],
  ["광주광역시", "gwangju"],
  ["대전광역시", "daejeon"],
  ["울산광역시", "ulsan"],
  ["세종특별자치시", "sejong"],
  ["경기도", "gyeonggi"],
  ["강원특별자치도", "gangwon"],
  ["충청북도", "chungbuk"],
  ["충청남도", "chungnam"],
  ["전북특별자치도", "jeonbuk"],
  ["전라남도", "jeonnam"],
  ["경상북도", "gyeongbuk"],
  ["경상남도", "gyeongnam"],
  ["제주특별자치도", "jeju"],
];

// ─── CSV Parser ───

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let fields: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current.trim());
        current = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        fields.push(current.trim());
        if (fields.length > 1) rows.push(fields);
        fields = [];
        current = "";
      } else {
        current += ch;
      }
    }
  }
  if (current || fields.length > 0) {
    fields.push(current.trim());
    if (fields.length > 1) rows.push(fields);
  }
  return rows;
}

// ─── Region Detection ───

function detectRegion(address: string, name: string): { key: RegionKey; regionName: string } | null {
  // Handle "본관 : ..." prefix
  let addr = address.replace(/^본관\s*[:：]\s*/, "");

  // Try full province prefixes first (longest match)
  for (const [prefix, key] of ADDRESS_PREFIXES) {
    if (addr.startsWith(prefix)) {
      const def = REGION_DEFS.find(r => r.key === key)!;
      return { key, regionName: def.name };
    }
  }

  // Try city names without province
  for (const [city, key] of Object.entries(CITY_TO_REGION)) {
    if (addr.startsWith(city)) {
      const def = REGION_DEFS.find(r => r.key === key)!;
      return { key, regionName: def.name };
    }
  }

  console.error(`[WARN] Cannot detect region for: ${name} (address: ${address})`);
  return null;
}

// ─── District Parsing ───

function parseDistricts(
  managementArea: string,
  region: RegionKey
): { districts: string[]; subDistricts: string[] } {
  const districts: string[] = [];
  const subDistricts: string[] = [];

  let text = managementArea;

  // Remove annotations like "* 거제지서 안내는 화면 하단에 있습니다."
  text = text.replace(/\*\s*거제지서.*$/, "").trim();
  // Remove parenthetical phone references like "(잠실동...02-2055-9200으로 문의하시기 바랍니다)"
  text = text.replace(/\([^)]*\d{2,4}-\d{3,4}-\d{4}[^)]*\)/g, "").trim();
  // Remove "(하남시는 경기광주세무서 하남지서 관할)" style notes
  text = text.replace(/\([^)]*지서\s*관할\)/g, "").trim();
  // Remove 지서/민원실 info after main area
  text = text.replace(/\s*(우\)\d+\s+)?[가-힣]+지서[:：].*$/g, "").trim();
  text = text.replace(/\s*[가-힣]+민원실[:：].*$/g, "").trim();

  // Handle "전체" or "전역" (entire region)
  if (text.match(/전체$/) || text.match(/전역$/)) {
    // Remove province prefix to see if there's a district
    let stripped = text;
    for (const [prov] of PROVINCE_VARIANTS) {
      stripped = stripped.replace(new RegExp(`^${escapeRegex(prov)}\\s*`), "");
    }
    stripped = stripped.replace(/\s*(전체|전역)$/, "").trim();
    if (stripped) {
      // e.g., "서울특별시 금천구 전체" → districts: ["금천구"]
      const match = stripped.match(/([가-힣]+[구시군])$/);
      if (match) districts.push(match[1]);
    }
    // If stripped is empty, it means the entire province → no specific districts
    return { districts, subDistricts };
  }

  // Strip province prefixes from text
  for (const [prov] of PROVINCE_VARIANTS) {
    text = text.replace(new RegExp(`^${escapeRegex(prov)}\\s*`), "");
    // Also strip inline province references for cross-region areas
    // But keep them for now to detect cross-region districts
  }

  // Seoul-specific: extract 구 names
  if (region === "seoul") {
    return parseSeoulDistricts(text, managementArea);
  }

  // Other regions: extract 시/군/구 names
  return parseGeneralDistricts(text, managementArea, region);
}

function parseSeoulDistricts(
  text: string,
  originalArea: string
): { districts: string[]; subDistricts: string[] } {
  const districts: string[] = [];
  const subDistricts: string[] = [];

  // Pattern: "강남구 중 신사동, 논현동, ..."
  // Pattern: "강북구, 도봉구(창동 제외)"
  // Pattern: "강남구(신사동, ... 제외)"
  // Pattern: "중구 중 남대문로 1·3·4·5가, ..."
  // Pattern: "강남구 역삼동, 도곡동" (no province prefix, just 구 + 동)
  // Pattern: "동작구, 영등포구 중 대림동, 도림동, 신길동"
  // Pattern: "노원구, 도봉구 중 창동"
  // Pattern: "송파구 중 잠실동, 신천동, ..."

  // First extract all 구 names
  const guPattern = /([가-힣]+구)/g;
  const allGus: string[] = [];
  let match;
  // We need to find 구 names but not from 동 names that happen to contain 구
  // Seoul 구 names all end in 구 and are: 강남구, 강동구, 강북구, 강서구, 관악구, 광진구,
  // 구로구, 금천구, 노원구, 도봉구, 동대문구, 동작구, 마포구, 서대문구, 서초구,
  // 성동구, 성북구, 송파구, 양천구, 영등포구, 용산구, 은평구, 종로구, 중구, 중랑구

  const SEOUL_GUS = new Set([
    "강남구", "강동구", "강북구", "강서구", "관악구", "광진구",
    "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구",
    "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구",
    "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구",
  ]);

  while ((match = guPattern.exec(text)) !== null) {
    if (SEOUL_GUS.has(match[1])) {
      allGus.push(match[1]);
    }
  }

  // Deduplicate
  for (const gu of [...new Set(allGus)]) {
    districts.push(gu);
  }

  // Determine subDistricts: if text contains 중, 제외, or specific 동 names
  const hasPartialArea =
    text.includes(" 중 ") ||
    text.includes("제외") ||
    text.includes("(") ||
    // Check for 동 names after 구
    /구\s+[가-힣]+동/.test(text);

  if (hasPartialArea) {
    // Store the meaningful sub-area text
    subDistricts.push(text);
  }

  return { districts, subDistricts };
}

function parseGeneralDistricts(
  text: string,
  originalArea: string,
  region: RegionKey
): { districts: string[]; subDistricts: string[] } {
  const districts: string[] = [];
  const subDistricts: string[] = [];

  // Split by commas, handling cross-region references
  // First, split the text into segments
  // We need to handle multi-province areas like:
  // "경기도 포천시, 동두천시, 연천군, 강원특별자치도 철원군"

  // Clean up text: remove inline province names for districts extraction
  let cleaned = text;
  for (const [prov] of PROVINCE_VARIANTS) {
    cleaned = cleaned.replace(new RegExp(escapeRegex(prov) + "\\s*", "g"), "");
  }
  // Also handle abbreviated forms
  cleaned = cleaned.replace(/울산광역시\s*/g, "");

  // Extract 시/군/구 names
  const districtPattern = /([가-힣]+(?:시|군|구))/g;
  let match;
  const found: string[] = [];
  while ((match = districtPattern.exec(cleaned)) !== null) {
    const d = match[1];
    // Skip if it's a sub-district of a city (e.g., "성산구" in "창원시 성산구")
    // We want top-level 시/군 and their 구 for metropolitan areas
    found.push(d);
  }

  // Deduplicate and add
  for (const d of [...new Set(found)]) {
    districts.push(d);
  }

  // Check for partial area indicators
  const hasPartialArea =
    text.includes(" 중 ") ||
    text.includes("제외") ||
    text.includes("일부") ||
    /[읍면동]/.test(text);

  if (hasPartialArea) {
    subDistricts.push(text);
  }

  return { districts, subDistricts };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Main ───

function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: npx tsx scripts/parseTaxOffices.ts <csv-path>");
    console.error("  CSV should be UTF-8 encoded.");
    console.error("  If EUC-KR: iconv -f EUC-KR -t UTF-8 input.csv > input_utf8.csv");
    process.exit(1);
  }

  const resolvedPath = path.resolve(csvPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(resolvedPath, "utf-8");
  const rows = parseCSV(raw);

  // Skip header
  const header = rows[0];
  console.error(`Header: ${header.join(" | ")}`);
  console.error(`Total rows: ${rows.length - 1}`);

  const offices: TaxOfficeRaw[] = [];
  let skipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 8) {
      console.error(`[SKIP] Row ${i + 1}: insufficient columns (${row.length})`);
      skipped++;
      continue;
    }

    const [name, address, postalCode, phone, fax, code, _account, managementArea] = row;

    // Skip 지방국세청
    if (name.includes("지방국세청")) {
      console.error(`[SKIP] 지방국세청: ${name}`);
      skipped++;
      continue;
    }

    const regionInfo = detectRegion(address, name);
    if (!regionInfo) {
      skipped++;
      continue;
    }

    const { districts, subDistricts } = parseDistricts(
      managementArea,
      regionInfo.key
    );

    offices.push({
      name,
      address,
      postalCode,
      phone,
      fax,
      code,
      region: regionInfo.key,
      regionName: regionInfo.regionName,
      districts,
      subDistricts,
      managementArea,
    });
  }

  console.error(`\nParsed: ${offices.length} offices, Skipped: ${skipped}`);

  // Count by region
  const regionCounts: Record<string, number> = {};
  for (const o of offices) {
    regionCounts[o.region] = (regionCounts[o.region] || 0) + 1;
  }
  console.error("\nBy region:");
  for (const def of REGION_DEFS) {
    const count = regionCounts[def.key] || 0;
    if (count > 0) console.error(`  ${def.name} (${def.key}): ${count}`);
  }

  // Build regions with districtToOffices
  const regionMap = new Map<RegionKey, {
    offices: TaxOfficeRaw[];
    districtToOffices: Record<string, string[]>;
  }>();

  for (const def of REGION_DEFS) {
    regionMap.set(def.key, { offices: [], districtToOffices: {} });
  }

  for (const office of offices) {
    const entry = regionMap.get(office.region)!;
    entry.offices.push(office);

    for (const district of office.districts) {
      if (!entry.districtToOffices[district]) {
        entry.districtToOffices[district] = [];
      }
      if (!entry.districtToOffices[district].includes(office.name)) {
        entry.districtToOffices[district].push(office.name);
      }
    }
  }

  // Generate output
  const outputPath = path.resolve(__dirname, "../src/data/regions/taxOffices.ts");
  const output = generateOutput(offices, regionMap);
  fs.writeFileSync(outputPath, output, "utf-8");
  console.error(`\nOutput written to: ${outputPath}`);
}

function generateOutput(
  offices: TaxOfficeRaw[],
  regionMap: Map<RegionKey, { offices: TaxOfficeRaw[]; districtToOffices: Record<string, string[]> }>
): string {
  const lines: string[] = [];

  lines.push(`import type { TaxOffice, Region, RegionKey } from "./types";`);
  lines.push(``);
  lines.push(`export const taxOffices: TaxOffice[] = [`);

  for (const o of offices) {
    const subDist = o.subDistricts.length > 0
      ? `\n    subDistricts: ${JSON.stringify(o.subDistricts)},`
      : "";
    lines.push(`  {`);
    lines.push(`    name: ${JSON.stringify(o.name)},`);
    lines.push(`    address: ${JSON.stringify(o.address)},`);
    lines.push(`    postalCode: ${JSON.stringify(o.postalCode)},`);
    lines.push(`    phone: ${JSON.stringify(o.phone)},`);
    lines.push(`    fax: ${JSON.stringify(o.fax)},`);
    lines.push(`    code: ${JSON.stringify(o.code)},`);
    lines.push(`    region: ${JSON.stringify(o.region)},`);
    lines.push(`    regionName: ${JSON.stringify(o.regionName)},`);
    lines.push(`    districts: ${JSON.stringify(o.districts)},${subDist}`);
    lines.push(`    managementArea: ${JSON.stringify(o.managementArea)},`);
    lines.push(`  },`);
  }

  lines.push(`];`);
  lines.push(``);

  // Region definitions
  const REGION_DEFS_FOR_OUTPUT: { key: RegionKey; slug: string; name: string; fullName: string }[] = [
    { key: "seoul", slug: "seoul", name: "서울", fullName: "서울특별시" },
    { key: "busan", slug: "busan", name: "부산", fullName: "부산광역시" },
    { key: "daegu", slug: "daegu", name: "대구", fullName: "대구광역시" },
    { key: "incheon", slug: "incheon", name: "인천", fullName: "인천광역시" },
    { key: "gwangju", slug: "gwangju", name: "광주", fullName: "광주광역시" },
    { key: "daejeon", slug: "daejeon", name: "대전", fullName: "대전광역시" },
    { key: "ulsan", slug: "ulsan", name: "울산", fullName: "울산광역시" },
    { key: "sejong", slug: "sejong", name: "세종", fullName: "세종특별자치시" },
    { key: "gyeonggi", slug: "gyeonggi", name: "경기", fullName: "경기도" },
    { key: "gangwon", slug: "gangwon", name: "강원", fullName: "강원특별자치도" },
    { key: "chungbuk", slug: "chungbuk", name: "충북", fullName: "충청북도" },
    { key: "chungnam", slug: "chungnam", name: "충남", fullName: "충청남도" },
    { key: "jeonbuk", slug: "jeonbuk", name: "전북", fullName: "전북특별자치도" },
    { key: "jeonnam", slug: "jeonnam", name: "전남", fullName: "전라남도" },
    { key: "gyeongbuk", slug: "gyeongbuk", name: "경북", fullName: "경상북도" },
    { key: "gyeongnam", slug: "gyeongnam", name: "경남", fullName: "경상남도" },
    { key: "jeju", slug: "jeju", name: "제주", fullName: "제주특별자치도" },
  ];

  lines.push(`function buildRegions(): Region[] {`);
  lines.push(`  const defs: { key: RegionKey; slug: string; name: string; fullName: string }[] = ${JSON.stringify(REGION_DEFS_FOR_OUTPUT, null, 4).replace(/\n/g, "\n  ")};`);
  lines.push(``);
  lines.push(`  return defs.map((def) => {`);
  lines.push(`    const offices = taxOffices.filter((o) => o.region === def.key);`);
  lines.push(`    const districtToOffices: Record<string, string[]> = {};`);
  lines.push(`    for (const office of offices) {`);
  lines.push(`      for (const district of office.districts) {`);
  lines.push(`        if (!districtToOffices[district]) districtToOffices[district] = [];`);
  lines.push(`        if (!districtToOffices[district].includes(office.name)) {`);
  lines.push(`          districtToOffices[district].push(office.name);`);
  lines.push(`        }`);
  lines.push(`      }`);
  lines.push(`    }`);
  lines.push(`    return { ...def, taxOffices: offices, districtToOffices };`);
  lines.push(`  });`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const regions: Region[] = buildRegions();`);
  lines.push(``);

  return lines.join("\n");
}

main();
