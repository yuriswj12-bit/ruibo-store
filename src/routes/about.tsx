import { createFileRoute } from "@tanstack/react-router";
import { getStoreHome } from "@/lib/commerce.functions";
import { CompanyPage } from "@/components/store/company-page";
import { companyCopy } from "@/components/store/company-copy";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  loader: () => getStoreHome(),
  component: About,
});

function About() {
  const store = Route.useLoaderData();
  const { lang } = useI18n();
  const page = companyCopy(lang).about;
  return <CompanyPage store={store} {...page} />;
}
