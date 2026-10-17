/** RB = Ruibo factory. Next two letters are the brand. Shared prefixes keep the stored brand. */
export const PREFIX_BRAND: Record<string, string> = {
  RBVW: "Volkswagen",
  RBAU: "Audi",
  RBBM: "BMW",
  RBBZ: "Mercedes-Benz",
  RBLR: "Land Rover",
  RBJA: "Jaguar",
  RBVO: "Volvo",
  RBFI: "Fiat",
  RBHO: "Honda",
  RBTO: "Toyota",
  RBNI: "Nissan",
  RBMA: "Mazda",
  RBKR: "Hyundai",
  RBFO: "Ford",
  RBLA: "Lada",
  RBOT: "Industrial",
};

export const SHARED_PREFIX = new Set(["RBSU", "RBUS"]);

export function cabinetPrefix(sku: string) {
  return sku.split("-")[0] ?? "";
}

export function brandFromCabinet(sku: string, stored = "") {
  const prefix = cabinetPrefix(sku);
  if (SHARED_PREFIX.has(prefix)) return stored;
  return PREFIX_BRAND[prefix] ?? stored;
}

export const MAKES = [
  "Volkswagen",
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Land Rover",
  "Jaguar",
  "Volvo",
  "Fiat",
  "Honda",
  "Toyota",
  "Nissan",
  "Mazda",
  "Suzuki",
  "Mitsubishi",
  "Hyundai",
  "Ford",
  "Chevrolet",
  "Great Wall",
  "Changan",
  "BYD",
  "Chery",
  "Roewe",
  "FAW",
  "Changhe",
  "Lada",
] as const;

export const LINES = [
  { id: "Automotive", image: "/auto.jpg", title: "lineAuto", body: "lineAutoBody" },
  { id: "Motorcycle", image: "/moto.jpg", title: "lineMoto", body: "lineMotoBody" },
  { id: "Industrial", image: "/industrial.jpg", title: "lineInd", body: "lineIndBody" },
  { id: "NOx", image: "/nox.jpg", title: "lineNox", body: "lineNoxBody" },
] as const;

export type CatalogSearch = { q: string; make: string; line: string; model: string; series: string; page: number };

export const catalogSearch = (patch: Partial<CatalogSearch> = {}): CatalogSearch => ({
  q: "",
  make: "",
  line: "",
  model: "",
  series: "",
  page: 1,
  ...patch,
});

export function lineImage(line: string) {
  return LINES.find((item) => item.id === line)?.image ?? "/auto.jpg";
}