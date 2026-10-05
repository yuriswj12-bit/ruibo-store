export function normalizeOe(input: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

/** Buyer-facing number: the OEM they typed, otherwise the first number on the part. */
export function shownOem(oes: string[], query = ""): string {
  const typed = normalizeOe(query);
  if (!typed) return oes[0] ?? "";
  return (
    oes.find((oe) => normalizeOe(oe) === typed) ??
    oes.find((oe) => normalizeOe(oe).startsWith(typed)) ??
    oes[0] ??
    ""
  );
}

export const SPEC_LABELS: Record<string, string> = {
  sensor_type: "Sensor type",
  wire_length_mm: "Wire length",
  pins: "Pins",
  thread_size: "Thread",
  wrench_size_mm: "Wrench size",
  connector_gender: "Connector",
  warranty_years: "Warranty",
  line: "Line",
  vehicle: "Vehicle",
  sensor: "Sensor",
};

export function specLabel(key: string): string {
  return SPEC_LABELS[key] ?? key.replace(/_/g, " ");
}

const NEXT_STATUS: Record<string, string[]> = {
  new: ["contacted", "closed"],
  contacted: ["quoted", "closed"],
  quoted: ["closed"],
  closed: [],
};

export function canMoveInquiry(from: string, to: string): boolean {
  return NEXT_STATUS[from]?.includes(to) ?? false;
}
