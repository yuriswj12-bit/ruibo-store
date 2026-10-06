import { createFileRoute, Link } from "@tanstack/react-router";
import { getStoreHome } from "@/lib/commerce.functions";
import { CompanyPage } from "@/components/store/company-page";
import { companyCopy } from "@/components/store/company-copy";
import { catalogSearch } from "@/components/store/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/downloads")({
  loader: () => getStoreHome(),
  component: Downloads,
});

function Downloads() {
  const store = Route.useLoaderData();
  const { lang, t } = useI18n();
  const page = companyCopy(lang).downloads;
  return (
    <CompanyPage store={store} {...page}>
      <Link to="/products" search={catalogSearch()} className="mt-6 inline-block rounded-lg bg-ink px-4 py-3 text-sm text-copper-ink">
        {t("heroBrowse")}
      </Link>
    </CompanyPage>
  );
}
