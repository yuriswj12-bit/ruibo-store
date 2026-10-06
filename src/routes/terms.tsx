import { createFileRoute } from "@tanstack/react-router";
import { getStoreHome } from "@/lib/commerce.functions";
import { CompanyPage } from "@/components/store/company-page";
import { companyCopy } from "@/components/store/company-copy";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({
  loader: () => getStoreHome(),
  component: Terms,
});

function Terms() {
  const store = Route.useLoaderData();
  const { lang } = useI18n();
  const page = companyCopy(lang).terms;
  return <CompanyPage store={store} {...page} />;
}
