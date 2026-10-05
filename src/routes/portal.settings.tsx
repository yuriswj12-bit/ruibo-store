import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { portalSnapshot, saveSettings } from "@/lib/commerce.functions";

export const Route = createFileRoute("/portal/settings")({
  loader: () => portalSnapshot(),
  component: Settings,
});

function Settings() {
  const { factory } = Route.useLoaderData();
  const router = useRouter();
  const [message, setMessage] = useState("");
  return (
    <section>
      <h1 className="text-4xl">站点设置</h1>
      <p className="mt-2 text-sm text-muted">子域 {factory.slug}</p>
      <form
        className="mt-4 grid max-w-lg gap-2"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          await saveSettings({
            data: {
              contactEmail: String(form.get("email") || ""),
              whatsapp: String(form.get("whatsapp") || ""),
              primaryColor: String(form.get("color") || "#9a3412"),
            },
          });
          setMessage("已保存");
          router.invalidate();
        }}
      >
        <input name="email" defaultValue={factory.contact_email} placeholder="销售邮箱" className="h-11 rounded-lg border border-line bg-card px-3" />
        <input name="whatsapp" defaultValue={factory.whatsapp} placeholder="WhatsApp" className="h-11 rounded-lg border border-line bg-card px-3" />
        <input name="color" defaultValue={factory.primary_color} placeholder="#9a3412" className="h-11 rounded-lg border border-line bg-card px-3" />
        <button type="submit" className="h-11 rounded-lg bg-copper text-copper-ink">保存</button>
        {message && <p className="text-sm">{message}</p>}
      </form>
    </section>
  );
}
