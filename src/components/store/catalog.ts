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

export type CatalogSearch = { q: string; make: string; line: string; page: number };

export const catalogSearch = (patch: Partial<CatalogSearch> = {}): CatalogSearch => ({
  q: "",
  make: "",
  line: "",
  page: 1,
  ...patch,
});

export function lineImage(line: string) {
  return LINES.find((item) => item.id === line)?.image ?? "/auto.jpg";
}
