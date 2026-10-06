import { createFileRoute } from "@tanstack/react-router";
import { getStoreHome } from "@/lib/commerce.functions";
import { CompanyPage } from "@/components/store/company-page";
import { companyCopy } from "@/components/store/company-copy";
import { InquiryForm } from "@/components/store/inquiry-form";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  loader: () => getStoreHome(),
  component: Contact,
});

function Contact() {
  const store = Route.useLoaderData();
  const { lang, t } = useI18n();
  const page = companyCopy(lang).contact;
  return (
    <CompanyPage store={store} {...page}>
      <section className="mt-8 max-w-xl rounded-card border border-line bg-card p-5">
        <h2 className="mb-3 text-2xl">{t("quoteTitle")}</h2>
        <InquiryForm />
      </section>
    </CompanyPage>
  );
}
