export const autoPartsSpecLabels: Record<string, string> = {
  sensor_type: "Sensor type",
  wire_length_mm: "Wire length",
  pins: "Pins",
  thread_size: "Thread",
  wrench_size_mm: "Wrench size",
  connector_gender: "Connector",
  warranty_years: "Warranty",
};

export function labelSpec(key: string): string {
  return autoPartsSpecLabels[key] || key.replace(/_/g, " ");
}
