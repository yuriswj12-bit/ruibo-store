const VERCEL_API = "https://api.vercel.com";

type DomainResult = {
  name: string;
  verified: boolean;
  verification?: Array<{ type: string; domain: string; value: string; reason: string }>;
};

function authHeaders() {
  const token = process.env.VERCEL_AUTH_BEARER_TOKEN;
  if (!token) throw new Error("VERCEL_AUTH_MISSING");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function projectPath(suffix = "") {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (!projectId) throw new Error("VERCEL_PROJECT_MISSING");
  const team = teamId ? `?teamId=${teamId}` : "";
  return `${VERCEL_API}/v10/projects/${projectId}/domains${suffix}${team}`;
}

/** 把工厂独立域名挂到当前 Vercel 项目。参考 vercel/platforms 的 Domains API 封装。 */
export async function attachCustomDomain(domain: string): Promise<DomainResult> {
  const res = await fetch(projectPath(), {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name: domain }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "VERCEL_DOMAIN_ATTACH_FAILED");
  return data as DomainResult;
}

export async function getCustomDomain(domain: string): Promise<DomainResult> {
  const res = await fetch(projectPath(`/${domain}`), { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "VERCEL_DOMAIN_QUERY_FAILED");
  return data as DomainResult;
}

export async function detachCustomDomain(domain: string): Promise<void> {
  const res = await fetch(projectPath(`/${domain}`), { method: "DELETE", headers: authHeaders() });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error?.message || "VERCEL_DOMAIN_DETACH_FAILED");
  }
}
