import { createFileRoute, Link } from "@tanstack/react-router";
import { getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { InquiryForm } from "@/components/store/inquiry-form";
import { useI18n, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  loader: () => getStoreHome(),
  component: Contact,
});

const PHONE = "+86-13706647066";
const WA = "8613706647066";

function Contact() {
  const store = Route.useLoaderData();
  const { lang, t } = useI18n();
  const copy = COPY[lang];
  if (!store) return <main className="wrap py-16">…</main>;
  const email = store.email || "info@cnrbic.com";
  return (
    <StoreShell name={store.name} email={store.email} whatsapp={store.whatsapp}>
      <main>
        <section
          className="relative grid min-h-[280px] place-items-center bg-[#1b2430] bg-cover bg-center"
          style={{ backgroundImage: "linear-gradient(rgba(18,24,34,.62), rgba(18,24,34,.62)), url(/sensor.jpg)" }}
        >
          <div className="px-4 py-16 text-center text-white">
            <h1 className="text-4xl font-semibold tracking-[0.08em] sm:text-5xl">{copy.hero}</h1>
            <p className="mt-3 text-sm text-white/85">
              <Link to="/" className="hover:text-white">{t("navHome")}</Link>
              <span className="px-2">-</span>
              <span>{t("navContact")}</span>
            </p>
            <span className="mx-auto mt-5 block h-[3px] w-10 bg-[#2f6fe0]" />
          </div>
        </section>

        <section className="wrap py-14 sm:py-16">
          <div className="relative">
            <p className="pointer-events-none absolute -top-6 left-0 text-6xl font-semibold text-[#f3f5f8] sm:text-8xl">{copy.watermark}</p>
            <h2 className="relative text-4xl font-semibold text-[#1a1a2e]">
              {copy.getIn} <span className="text-[#2457d6]">{copy.touch}</span>
            </h2>
          </div>
          <div className="relative mt-6 flex gap-2">
            <a href={`mailto:${email}`} aria-label={copy.email} className="grid size-9 place-items-center rounded-md bg-[#2f6fe0] text-white">
              <MailIcon />
            </a>
            <span aria-hidden className="grid size-9 place-items-center rounded-md bg-[#3b5998] text-white">
              <FacebookIcon />
            </span>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-9 place-items-center rounded-md bg-[#25D366] text-white">
              <WhatsappIcon />
            </a>
          </div>

          <div className="relative mt-8 grid gap-5 md:grid-cols-2">
            <article className="flex items-center gap-4 rounded-2xl border border-[#eceff3] px-5 py-6 shadow-[0_8px_30px_rgba(20,30,50,.04)]">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#f4f7fb] text-[#2457d6]">
                <MailIcon />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold">{copy.email}</h3>
                <p className="mt-1 text-sm text-[#9aa3af]">{copy.mailHint}</p>
                <p className="mt-6 truncate text-sm text-[#8b93a0]">{email}</p>
              </div>
              <a href={`mailto:${email}`} aria-label={copy.email} className="grid size-11 shrink-0 place-items-center rounded-full bg-[#2f6fe0] text-white">
                <PlaneIcon />
              </a>
            </article>
            <article className="flex items-center gap-4 rounded-2xl border border-[#eceff3] px-5 py-6 shadow-[0_8px_30px_rgba(20,30,50,.04)]">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#f4f7fb] text-[#2457d6]">
                <PhoneIcon />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold">{copy.tel}</h3>
                <p className="mt-1 text-sm text-[#9aa3af]">{copy.callHint}</p>
                <p className="mt-6 text-sm text-[#8b93a0]">{PHONE}</p>
              </div>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-11 shrink-0 place-items-center rounded-full bg-[#2f6fe0] text-white">
                <PlaneIcon />
              </a>
            </article>
          </div>

          <div className="mt-8 grid items-stretch gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#eceff3] p-4 sm:p-5">
              <InquiryForm contact submitLabel={copy.send} />
            </div>
            <iframe
              title={copy.hero}
              className="min-h-[360px] w-full rounded-2xl border border-[#eceff3]"
              src="https://www.openstreetmap.org/export/embed.html?bbox=120.52%2C27.72%2C120.78%2C27.88&layer=mapnik&marker=27.792%2C120.655"
            />
          </div>
        </section>
      </main>
    </StoreShell>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M8 4h2l1.2 3.2-1.6 1a12 12 0 0 0 5.2 5.2l1-1.6L20 14v2a2 2 0 0 1-2.2 2A16 16 0 0 1 4 6.2 2 2 0 0 1 6 4h2Z" strokeLinejoin="round" />
    </svg>
  );
}

function PlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M3.2 11.4 20.8 3.2c.5-.2 1 .3.8.8l-4.6 16.2c-.2.6-.9.7-1.3.2l-4-4.6-4.6 2.2c-.5.2-1-.2-.9-.8l1.2-5.2-3.6-.2c-.6 0-1-.6-.6-1.1Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M14.2 20v-6.2h2.1l.3-2.4h-2.4V9.8c0-.7.2-1.2 1.2-1.2H16.7V6.4c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v1.5H8.8v2.4h2.3V20h3.1Z" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10.1 10.1 0 0 0 4.65 1.12h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.78 13.9c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.64-.61-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.36c.24-.28.64-.41 1.02-.41.12 0 .23 0 .33.01.3.01.45.03.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.16-.3.37-.42.49-.14.14-.28.29-.12.56.16.28.72 1.18 1.54 1.91 1.06.95 1.95 1.24 2.23 1.38.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.28.38-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

const COPY: Record<Lang, {
  hero: string;
  watermark: string;
  getIn: string;
  touch: string;
  email: string;
  mailHint: string;
  tel: string;
  callHint: string;
  send: string;
}> = {
  zh: {
    hero: "联系我们",
    watermark: "联系我们",
    getIn: "取得",
    touch: "联系",
    email: "邮箱",
    mailHint: "随时发邮件",
    tel: "电话 / WhatsApp",
    callHint: "随时致电",
    send: "发送信息",
  },
  en: {
    hero: "CONTACT US",
    watermark: "Contact Us",
    getIn: "Get In",
    touch: "Touch",
    email: "Email",
    mailHint: "Send mail asap anytime",
    tel: "Tel/Whatsapp",
    callHint: "Call us asap anytime",
    send: "Send Message",
  },
  es: {
    hero: "CONTÁCTENOS",
    watermark: "Contacto",
    getIn: "Póngase en",
    touch: "contacto",
    email: "Correo",
    mailHint: "Escriba cuando quiera",
    tel: "Teléfono / WhatsApp",
    callHint: "Llame cuando quiera",
    send: "Enviar mensaje",
  },
  pt: {
    hero: "CONTACTE-NOS",
    watermark: "Contacto",
    getIn: "Entre em",
    touch: "contacto",
    email: "E-mail",
    mailHint: "Envie e-mail quando quiser",
    tel: "Telefone / WhatsApp",
    callHint: "Ligue quando quiser",
    send: "Enviar mensagem",
  },
  ru: {
    hero: "КОНТАКТЫ",
    watermark: "Контакты",
    getIn: "Свяжитесь",
    touch: "с нами",
    email: "Почта",
    mailHint: "Пишите в любое время",
    tel: "Телефон / WhatsApp",
    callHint: "Звоните в любое время",
    send: "Отправить",
  },
  ar: {
    hero: "اتصل بنا",
    watermark: "اتصل بنا",
    getIn: "تواصل",
    touch: "معنا",
    email: "البريد",
    mailHint: "راسلنا في أي وقت",
    tel: "هاتف / واتساب",
    callHint: "اتصل في أي وقت",
    send: "إرسال",
  },
  mn: {
    hero: "ХОЛБОО БАРИХ",
    watermark: "Холбоо барих",
    getIn: "Бидэнтэй",
    touch: "холбогдоорой",
    email: "Имэйл",
    mailHint: "Хүссэн үедээ имэйл илгээнэ үү",
    tel: "Утас / WhatsApp",
    callHint: "Хүссэн үедээ залгана уу",
    send: "Илгээх",
  },
};
