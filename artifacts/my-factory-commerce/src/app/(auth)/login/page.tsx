import { AuthCard } from "@/components/portal/auth-card";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const query = await searchParams;
  const next = query.next?.startsWith("/") ? query.next : "/portal/dashboard";
  return <AuthCard next={next} />;
}
