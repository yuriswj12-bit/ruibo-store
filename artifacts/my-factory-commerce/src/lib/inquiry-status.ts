/** Medusa b2b-starter 的 Quote 状态机，映射到本系统 Inquiry.status。 */
export const INQUIRY_STATUSES = ["new", "contacted", "quoted", "closed"] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

const TRANSITIONS: Record<InquiryStatus, InquiryStatus[]> = {
  new: ["contacted", "closed"],
  contacted: ["quoted", "closed"],
  quoted: ["closed"],
  closed: [],
};

export function canTransitionInquiry(from: string, to: string): to is InquiryStatus {
  if (!INQUIRY_STATUSES.includes(to as InquiryStatus)) return false;
  return TRANSITIONS[from as InquiryStatus]?.includes(to as InquiryStatus) ?? false;
}
