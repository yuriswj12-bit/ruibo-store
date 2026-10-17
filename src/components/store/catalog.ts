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