import { createFileRoute, Link } from "@tanstack/react-router";
import { getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { Reveal } from "@/components/store/reveal";
import { catalogSearch } from "@/components/store/catalog";
import { useI18n, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/downloads")({
  loader: () => getStoreHome(),
  component: Downloads,
});

const copy: Record<Lang, {
  eyebrow: string;
  title: string;
  lede: string;
  recommend: string;
  name: string;
  body: string;
  format: string;
  pages: string;
  products: string;
  oems: string;
  download: string;
  searchTitle: string;
  searchBody: string;
  searchCta: string;
  quote: string;
  quoteBody: string;
  contact: string;
}> = {
  zh: {
    eyebrow: "下载",
    title: "产品目录",
    lede: "下载最新氧传感器目录，查看柜号、OEM 对照和品牌覆盖。站上的 OEM 搜索和这份目录一致。",
    recommend: "推荐",
    name: "瑞铂氧传感器目录",
    body: "汽车、摩托车、工业和氮氧传感器。含品牌页和 OEM 对照。",
    format: "PDF",
    pages: "38 页",
    products: "302 个产品",
    oems: "601 个 OEM",
    download: "立即下载",
    searchTitle: "在线查号",
    searchBody: "不必下完整本。输入 OEM、博世或电装号，直接找到对应产品。",
    searchCta: "浏览产品",
    quote: "没找到型号？",
    quoteBody: "把 OEM 号发给我们，工厂确认后回复。",
    contact: "发送询盘",
  },
  en: {
    eyebrow: "Downloads",
    title: "Product Catalog",
    lede: "Download the latest oxygen sensor catalog for part coverage and OEM references. The numbers match the OEM search on this site.",
    recommend: "Recommended",
    name: "RBIC Oxygen Sensor Catalog",
    body: "Automotive, motorcycle, industrial and NOx sensors, with brand pages and OEM cross-references.",
    format: "PDF",
    pages: "38 pages",
    products: "302 parts",
    oems: "601 OEM refs",
    download: "Download Now",
    searchTitle: "Search online",
    searchBody: "You do not need the full book. Enter an OEM, Bosch or Denso number to find the matching part.",
    searchCta: "Browse products",
    quote: "Number not listed?",
    quoteBody: "Send the OEM number. The factory will confirm and reply.",
    contact: "Send an inquiry",
  },
  es: {
    eyebrow: "Descargas",
    title: "Catálogo de productos",
    lede: "Descargue el catálogo de sensores de oxígeno con referencias OEM. Los números coinciden con la búsqueda del sitio.",
    recommend: "Recomendado",
    name: "Catálogo de sensores RBIC",
    body: "Sensores de automóvil, moto, industriales y NOx, con páginas por marca.",
    format: "PDF",
    pages: "38 páginas",
    products: "302 piezas",
    oems: "601 referencias OEM",
    download: "Descargar",
    searchTitle: "Buscar en línea",
    searchBody: "No necesita el libro completo. Introduzca un número OEM, Bosch o Denso.",
    searchCta: "Ver productos",
    quote: "¿No encuentra el número?",
    quoteBody: "Envíe el número OEM. La fábrica lo confirmará.",
    contact: "Enviar consulta",
  },
  pt: {
    eyebrow: "Downloads",
    title: "Catálogo de produtos",
    lede: "Baixe o catálogo de sensores de oxigênio com referências OEM. Os números batem com a busca do site.",
    recommend: "Recomendado",
    name: "Catálogo de sensores RBIC",
    body: "Sensores automotivos, de moto, industriais e NOx, com páginas por marca.",
    format: "PDF",
    pages: "38 páginas",
    products: "302 peças",
    oems: "601 referências OEM",
    download: "Baixar agora",
    searchTitle: "Buscar online",
    searchBody: "Não precisa do livro inteiro. Digite um número OEM, Bosch ou Denso.",
    searchCta: "Ver produtos",
    quote: "Número não listado?",
    quoteBody: "Envie o número OEM. A fábrica confirma e responde.",
    contact: "Enviar consulta",
  },
  ru: {
    eyebrow: "Загрузки",
    title: "Каталог продукции",
    lede: "Скачайте каталог кислородных датчиков с OEM-номерами. Номера совпадают с поиском на сайте.",
    recommend: "Рекомендуем",
    name: "Каталог датчиков RBIC",
    body: "Автомобильные, мото, промышленные и NOx датчики, с разбивкой по брендам.",
    format: "PDF",
    pages: "38 страниц",
    products: "302 позиции",
    oems: "601 OEM",
    download: "Скачать",
    searchTitle: "Поиск онлайн",
    searchBody: "Полный каталог не обязателен. Введите OEM, Bosch или Denso.",
    searchCta: "Каталог",
    quote: "Номера нет в списке?",
    quoteBody: "Отправьте OEM. Завод подтвердит и ответит.",
    contact: "Отправить запрос",
  },
  mn: {
    eyebrow: "Татах",
    title: "Бүтээгдэхүүний каталог",
    lede: "Хүчилтөрөгчийн мэдрэгчийн каталогийг OEM дугаартай нь татна уу. Дугаарууд сайт дээрх хайлттай таарна.",
    recommend: "Санал болгох",
    name: "RBIC мэдрэгчийн каталог",
    body: "Авто, мото, үйлдвэрийн болон NOx мэдрэгч, брэндээр ангилсан.",
    format: "PDF",
    pages: "38 хуудас",
    products: "302 бүтээгдэхүүн",
    oems: "601 OEM",
    download: "Татах",
    searchTitle: "Онлайнаар хайх",
    searchBody: "Бүтэн ном хэрэггүй. OEM, Bosch эсвэл Denso дугаар оруулна уу.",
    searchCta: "Бүтээгдэхүүн",
    quote: "Дугаар байхгүй юу?",
    quoteBody: "OEM дугаараа илгээнэ үү. Үйлдвэр баталгаажуулна.",
    contact: "Лавлагаа илгээх",
  },
  ar: {
    eyebrow: "التنزيلات",
    title: "كتالوج المنتجات",
    lede: "حمّل أحدث كتالوج حساسات الأكسجين مع أرقام OEM. الأرقام تطابق البحث في الموقع.",
    recommend: "موصى به",
    name: "كتالوج حساسات RBIC",
    body: "حساسات السيارات والدراجات والصناعية وNOx، مع صفحات حسب الماركة.",
    format: "PDF",
    pages: "38 صفحة",
    products: "302 قطعة",
    oems: "601 مرجع OEM",
    download: "تنزيل الآن",
    searchTitle: "بحث مباشر",
    searchBody: "لا تحتاج الكتاب كاملاً. أدخل رقم OEM أو Bosch أو Denso.",
    searchCta: "تصفح المنتجات",
    quote: "الرقم غير مدرج؟",
    quoteBody: "أرسل رقم OEM. المصنع يؤكد ويرد.",
    contact: "إرسال استفسار",
  },
};

function Downloads() {
  const store = Route.useLoaderData();
  const { lang } = useI18n();
  const c = copy[lang] || copy.en;
  if (!store) return <main className="wrap py-16">…</main>;
  return (
    <StoreShell name={store.name} email={store.email}>
      <section className="bg-[#8c0010] text-white">
        <Reveal variant="fade" className="wrap py-16 sm:py-20">
          <p className="text-sm font-medium tracking-[0.18em] text-white/70">{c.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">{c.title}</h1>
          <p className="mt-4 max-w-2xl text-white/80">{c.lede}</p>
        </Reveal>
      </section>
      <main className="wrap py-12">
        <Reveal variant="up">
          <article className="grid overflow-hidden rounded-2xl border border-line bg-card lg:grid-cols-[220px_minmax(0,1fr)]">
            <img src="/downloads/catalog-cover.jpg" alt="RBIC oxygen sensor catalog cover" className="h-auto w-full bg-white object-contain" />
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#e60013]">{c.recommend}</p>
              <h2 className="mt-2 text-2xl font-semibold">{c.name}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{c.body}</p>
              <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div><dt className="text-muted">Format</dt><dd className="font-semibold">{c.format} · 16 MB</dd></div>
                <div><dt className="text-muted">Pages</dt><dd className="font-semibold">{c.pages}</dd></div>
                <div><dt className="text-muted">Products</dt><dd className="font-semibold">{c.products}</dd></div>
                <div><dt className="text-muted">OEM</dt><dd className="font-semibold">{c.oems}</dd></div>
              </dl>
              <a href="/downloads/ruibo-oxygen-sensors.pdf" download className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#e60013] px-5 py-3 text-sm font-semibold text-white">
                {c.download} <span aria-hidden>↓</span>
              </a>
            </div>
          </article>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {([c.pages, c.products, c.oems] as const).map((item, index) => (
            <Reveal key={item} variant="up" delay={index * 60} className="rounded-2xl bg-[#f7f8fc] p-6 text-center">
              <p className="text-2xl font-semibold text-[#e60013]">{item}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Reveal variant="right" className="rounded-2xl border border-line bg-card p-6">
            <h3 className="text-lg font-semibold">{c.searchTitle}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{c.searchBody}</p>
            <Link to="/products" search={catalogSearch()} className="mt-4 inline-block rounded-lg border border-[#e60013] px-4 py-2 text-sm font-semibold text-[#e60013]">
              {c.searchCta}
            </Link>
          </Reveal>
          <Reveal variant="left" className="rounded-2xl border border-line bg-card p-6">
            <h3 className="text-lg font-semibold">{c.quote}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{c.quoteBody}</p>
            <Link to="/contact" className="mt-4 inline-block rounded-lg bg-[#e60013] px-4 py-2 text-sm font-semibold text-white">
              {c.contact}
            </Link>
          </Reveal>
        </div>
      </main>
    </StoreShell>
  );
}
