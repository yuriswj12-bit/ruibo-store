import { createFileRoute, Link } from "@tanstack/react-router";
import { getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { catalogSearch } from "@/components/store/catalog";
import { Reveal } from "@/components/store/reveal";
import { useI18n, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/manufacturing")({
  loader: () => getStoreHome(),
  component: Manufacturing,
});


type Copy = {
  kicker: string;
  title: string;
  lede: string;
  divKicker: string;
  divTitle: string;
  divLede: string;
  d1: string;
  d1Title: string;
  d1Body: string;
  d1Items: string[];
  d2: string;
  d2Title: string;
  d2Body: string;
  d2Items: string[];
  capKicker: string;
  capTitle: string;
  capLede: string;
  cap1Title: string;
  cap1Body: string;
  cap2Title: string;
  cap2Body: string;
  vidTitle: string;
  vidBody: string;
  coming: string;
  videos: { title: string; body: string; youtube: string }[];
  qcKicker: string;
  qcTitle: string;
  qcLede: string;
  stages: { n: string; title: string; body: string }[];
  tiles: { title: string; body: string }[];
  shopTitle: string;
  shopLede: string;
  cta: string;
};

const zh: Copy = {
  kicker: "制造",
  title: "稳定的品质，从专业制造开始",
  lede: "从汽车氧传感器到摩托车、工业与氮氧传感器，我们为全球售后客户提供稳定生产、严格质检和灵活供货。",
  divKicker: "生产分部",
  divTitle: "两条专注的产品线",
  divLede: "制造资源分成两个分部，各自对应固定的产品类别和产线。",
  d1: "分部 1",
  d1Title: "汽车氧传感器",
  d1Body: "自 2003 年开始生产。面向全球售后市场，重点是可靠性和一致性。",
  d1Items: ["加热型氧传感器", "前氧 / 后氧", "线束与接头匹配", "按 OEM 号对照"],
  d2: "分部 2",
  d2Title: "摩托车、工业与氮氧",
  d2Body: "覆盖两轮、连续工况和排放监测。这一部分目录号较少，没列出的号也可以询价。",
  d2Items: ["摩托车氧传感器", "工业与家电氧传感器", "氮氧传感器", "耐振动、长寿命"],
  capKicker: "能力",
  capTitle: "专业生产能力",
  capLede: "制造体系把设备、技术团队和过程控制放在一起，保证质量和交付。",
  cap1Title: "氧传感器组装",
  cap1Body: "按接口、线长和接头组装，出厂前做功能检查。",
  cap2Title: "来料与成品检验",
  cap2Body: "材料和成品按规格核对，包装前再查一次。",
  vidTitle: "产线与检测影片",
  vidBody: "下面这些位置留给工厂自己的影片。拍好之后再嵌进来，现在先占位。",
  coming: "影片即将上线",
  videos: [
    { title: "产品开箱：氧传感器外观与包装", body: "看外观和包装是否完整。不讲安装，只看货和包。", youtube: "" },
    { title: "功能检测", body: "出厂前的功能检查。影片会展示实际用的检测方法。", youtube: "" },
    { title: "接头与线束核对", body: "按 OEM 接口核对插头和线长，避免发错规格。", youtube: "" },
    { title: "包装与出货", body: "装箱前的最后一次外观和标签检查。", youtube: "" },
  ],
  qcKicker: "质量控制",
  qcTitle: "四段质量保证",
  qcLede: "每件产品在多个环节检查，达到标准后再出货。",
  stages: [
    { n: "阶段 1", title: "来料检验", body: "原材料和零件按规格核对。" },
    { n: "阶段 2", title: "过程控制", body: "生产过程中持续检查。" },
    { n: "阶段 3", title: "成品测试", body: "成品做功能检查。" },
    { n: "阶段 4", title: "出货前检查", body: "包装前做最后一次检验。" },
  ],
  tiles: [
    { title: "按 OEM 制造", body: "用原厂号对照，工厂按自己的编号发货。" },
    { title: "定制包装", body: "批量订单可以按客户要求包装和贴标。" },
    { title: "产品开发", body: "目录里没有的号，把编号发过来，我们对接口和规格。" },
    { title: "批量出口", body: "面向全球售后客户的批量供货。" },
  ],
  shopTitle: "车间一览",
  shopLede: "自 2003 年开始制造。把稳定的生产能力对接给全球售后客户。",
  cta: "浏览产品",
};

const en: Copy = {
  kicker: "Manufacturing",
  title: "Stable quality starts with professional manufacturing",
  lede: "From automotive oxygen sensors to motorcycle, industrial, and NOx sensors, we provide stable production, strict quality control, and flexible supply for global aftermarket customers.",
  divKicker: "Production divisions",
  divTitle: "Two specialized product divisions",
  divLede: "Manufacturing is organized into two divisions, each with its own product category and production line.",
  d1: "Division 1",
  d1Title: "Automotive oxygen sensors",
  d1Body: "In production since 2003. Built for reliability and consistent performance in the global aftermarket.",
  d1Items: ["Heated oxygen sensors", "Upstream and downstream", "Wire and connector match", "OEM cross-reference"],
  d2: "Division 2",
  d2Title: "Motorcycle, industrial, and NOx",
  d2Body: "Two-wheel, continuous-duty, and emission-monitoring sensors. This catalog is smaller. Numbers not listed can still be quoted.",
  d2Items: ["Motorcycle oxygen sensors", "Industrial and appliance sensors", "NOx sensors", "Vibration-resistant, long life"],
  capKicker: "Capabilities",
  capTitle: "Professional production capability",
  capLede: "The system combines equipment, a technical team, and process control to keep quality and delivery stable.",
  cap1Title: "Oxygen sensor assembly",
  cap1Body: "Assembled to the connector, wire length, and thread. Function is checked before it leaves.",
  cap2Title: "Incoming and final inspection",
  cap2Body: "Materials and finished parts are checked against the specification, then checked again before packing.",
  vidTitle: "Line and test films",
  vidBody: "These slots are for films shot in our factory. They go in after filming. For now they are placeholders.",
  coming: "Video coming",
  videos: [
    { title: "Unboxing: appearance and packaging", body: "A look at the sensor and the pack. Appearance and packaging integrity only.", youtube: "" },
    { title: "Function test", body: "The check used before shipment. The film will show the method.", youtube: "" },
    { title: "Connector and harness check", body: "Plug and wire length checked against the OEM interface.", youtube: "" },
    { title: "Packing and dispatch", body: "Final look at appearance and labels before the box is closed.", youtube: "" },
  ],
  qcKicker: "Quality control",
  qcTitle: "Four-stage quality assurance",
  qcLede: "Every product is checked at several stages before it ships.",
  stages: [
    { n: "Stage 1", title: "Incoming inspection", body: "Raw materials and components verified against specifications." },
    { n: "Stage 2", title: "In-process control", body: "Continuous monitoring during production." },
    { n: "Stage 3", title: "Final testing", body: "Finished products are function-checked." },
    { n: "Stage 4", title: "Pre-shipment check", body: "Final inspection before packaging and shipment." },
  ],
  tiles: [
    { title: "OEM manufacturing", body: "Matched by OEM number. Shipped by our factory part number." },
    { title: "Custom packaging", body: "Bulk orders can be packed and labeled to the buyer's request." },
    { title: "Product development", body: "Send a number that is not listed. We match the interface and the specification." },
    { title: "Bulk export orders", body: "Volume supply for global aftermarket customers." },
  ],
  shopTitle: "Inside our workshop",
  shopLede: "Manufacturing since 2003. Connecting stable production with global aftermarket customers.",
  cta: "Browse products",
};

const COPY: Record<Lang, Copy> = {
  zh,
  en,
  es: { ...en, kicker: "Fabricación", title: "La calidad estable empieza en una fabricación profesional", lede: "De sensores de oxígeno para auto a moto, industria y NOx. Producción estable, control estricto y suministro flexible para el aftermarket global.", divKicker: "Divisiones", divTitle: "Dos divisiones especializadas", coming: "Vídeo próximamente", vidTitle: "Vídeos de línea y prueba", qcKicker: "Control de calidad", qcTitle: "Aseguramiento en cuatro etapas", shopTitle: "Dentro del taller", cta: "Ver productos" },
  pt: { ...en, kicker: "Fabrico", title: "Qualidade estável começa no fabrico profissional", lede: "De sensores de oxigénio automóvel a moto, indústria e NOx. Produção estável, controlo rigoroso e fornecimento flexível para o aftermarket global.", divKicker: "Divisões", divTitle: "Duas divisões especializadas", coming: "Vídeo em breve", vidTitle: "Filmes de linha e teste", qcKicker: "Controlo de qualidade", qcTitle: "Garantia em quatro etapas", shopTitle: "Dentro da oficina", cta: "Ver produtos" },
  ru: { ...en, kicker: "Производство", title: "Стабильное качество начинается с производства", lede: "От автомобильных кислородных датчиков до мото, промышленных и NOx. Стабильное производство, контроль и поставки для мирового aftermarket.", divKicker: "Подразделения", divTitle: "Два специализированных подразделения", coming: "Видео скоро", vidTitle: "Видео линии и испытаний", qcKicker: "Контроль качества", qcTitle: "Четыре этапа контроля", shopTitle: "Внутри цеха", cta: "Каталог" },
  ar: { ...en, kicker: "التصنيع", title: "الجودة الثابتة تبدأ من تصنيع متخصص", lede: "من حساسات أكسجين السيارات إلى الدراجات والصناعة وNOx. إنتاج ثابت ورقابة وتوريد مرن لسوق ما بعد البيع.", divKicker: "الأقسام", divTitle: "قسمان متخصصان", coming: "الفيديو قريباً", vidTitle: "أفلام الخط والاختبار", qcKicker: "مراقبة الجودة", qcTitle: "ضمان الجودة على أربع مراحل", shopTitle: "داخل الورشة", cta: "تصفح المنتجات" },
  mn: { ...en, kicker: "Үйлдвэрлэл", title: "Тогтвортой чанар мэргэжлийн үйлдвэрлэлээс эхэлнэ", lede: "Автомашины хүчилтөрөгчийн мэдрэгчээс мото, үйлдвэр, NOx хүртэл. Тогтвортой үйлдвэрлэл, хяналт, нийлүүлэлт.", divKicker: "Хэсгүүд", divTitle: "Хоёр төрөлжсөн хэсэг", coming: "Видео удахгүй", vidTitle: "Шугам ба туршилтын бичлэг", qcKicker: "Чанарын хяналт", qcTitle: "Дөрвөн үе шаттай баталгаа", shopTitle: "Цехийн дотор", cta: "Бүтээгдэхүүн" },
};

const SHOP = ["/sensor.jpg", "/auto.jpg", "/moto.jpg", "/industrial.jpg", "/nox.jpg", "/line-auto-bg.jpg", "/line-ind-bg.jpg", "/line-moto-bg.jpg", "/line-nox-bg.jpg", "/og.jpg"];

function Manufacturing() {
  const store = Route.useLoaderData();
  const { lang } = useI18n();
  const c = COPY[lang];
  if (!store) return <main className="wrap py-16">…</main>;
  return (
    <StoreShell name={store.name} email={store.email} whatsapp={store.whatsapp}>
      <main>
        <section className="relative overflow-hidden bg-[#071e36] text-white">
          <img src="/sensor.jpg" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover grayscale contrast-125" />
          <div className="pointer-events-none absolute inset-0 bg-[#092949] mix-blend-multiply" />
          <div className="pointer-events-none absolute inset-0 bg-[#0e375e]/45" />
          <Reveal variant="fade" className="wrap relative py-20 sm:py-28">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">{c.kicker}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">{c.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80">{c.lede}</p>
          </Reveal>
        </section>

        <section className="bg-white py-16">
          <div className="wrap">
            <Reveal variant="up" className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#071e36]">{c.divKicker}</p>
              <h2 className="mt-3 text-3xl font-semibold">{c.divTitle}</h2>
              <p className="mt-4 leading-7 text-muted">{c.divLede}</p>
            </Reveal>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {[
                { k: c.d1, title: c.d1Title, body: c.d1Body, items: c.d1Items, img: "/auto.jpg" },
                { k: c.d2, title: c.d2Title, body: c.d2Body, items: c.d2Items, img: "/industrial.jpg" },
              ].map((card, i) => (
                <Reveal key={card.k} variant={i === 0 ? "right" : "left"} className="overflow-hidden rounded-2xl bg-white shadow-lg">
                  <div className="relative h-48 bg-[#071e36]">
                    <img src={card.img} alt="" className="absolute inset-0 h-full w-full object-cover grayscale contrast-125" />
                    <div className="absolute inset-0 bg-[#092949] mix-blend-multiply" />
                    <div className="absolute inset-0 bg-[#0e375e]/45" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
                      <p className="text-sm text-white/80">{card.k}</p>
                      <p className="mt-1 text-2xl font-semibold">{card.title}</p>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="leading-7 text-muted">{card.body}</p>
                    <ul className="mt-5 grid gap-2">
                      {card.items.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm">
                          <span className="size-1.5 rounded-full bg-[#071e36]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="wrap py-16">
          <Reveal variant="up" className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#071e36]">{c.capKicker}</p>
            <h2 className="mt-3 text-3xl font-semibold">{c.capTitle}</h2>
            <p className="mt-4 leading-7 text-muted">{c.capLede}</p>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {[
              { title: c.cap1Title, body: c.cap1Body, img: "/sensor.jpg" },
              { title: c.cap2Title, body: c.cap2Body, img: "/line-auto-bg.jpg" },
            ].map((card, i) => (
              <Reveal key={card.title} variant={i === 0 ? "right" : "left"} className="flex h-full flex-col rounded-2xl border border-[#d7e2ee] bg-white p-8">
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#071e36]">
                  <img src={card.img} alt="" className="absolute inset-0 h-full w-full object-cover grayscale contrast-125" />
                  <div className="absolute inset-0 bg-[#092949] mix-blend-multiply" />
                  <div className="absolute inset-0 bg-[#0e375e]/45" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">{card.title}</h3>
                <p className="mt-3 leading-7 text-muted">{card.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="wrap">
            <Reveal variant="up" className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-semibold text-[#071e36]">{c.vidTitle}</h2>
              <p className="mt-4 leading-7 text-muted">{c.vidBody}</p>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {c.videos.map((video, i) => (
                <Reveal key={video.title} variant={i % 2 === 0 ? "right" : "left"} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className="relative aspect-video bg-[#071e36]">
                    {video.youtube ? (
                      <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube.com/embed/${video.youtube}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <img src={SHOP[i % SHOP.length]} alt="" className="absolute inset-0 h-full w-full object-cover grayscale contrast-125" />
                        <div className="absolute inset-0 bg-[#092949] mix-blend-multiply" />
                        <div className="absolute inset-0 bg-[#0e375e]/45" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                          <span className="flex size-14 items-center justify-center rounded-full border-2 border-white/80 text-2xl">▶</span>
                          <p className="mt-3 text-sm font-semibold">{c.coming}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold">{video.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{video.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="wrap grid items-center gap-12 py-16 lg:grid-cols-2">
          <Reveal variant="right">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#071e36]">{c.qcKicker}</p>
            <h2 className="mt-3 text-3xl font-semibold">{c.qcTitle}</h2>
            <p className="mt-4 leading-7 text-muted">{c.qcLede}</p>
            <ol className="mt-8 grid gap-5">
              {c.stages.map((stage) => (
                <li key={stage.n} className="flex gap-4">
                  <span className="mt-0.5 shrink-0 text-xs font-bold text-[#071e36]">{stage.n}</span>
                  <span>
                    <span className="block font-semibold">{stage.title}</span>
                    <span className="mt-1 block text-sm leading-6 text-muted">{stage.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal variant="left">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#071e36]">
              <img src="/line-ind-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover grayscale contrast-125" />
              <div className="absolute inset-0 bg-[#092949] mix-blend-multiply" />
              <div className="absolute inset-0 bg-[#0e375e]/45" />
            </div>
          </Reveal>
        </section>

        <section className="bg-[#071e36] py-14 text-white">
          <div className="wrap grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.tiles.map((tile, i) => (
              <Reveal key={tile.title} variant="up" delay={i * 60} className="rounded-xl bg-white/5 p-6 text-center backdrop-blur-sm">
                <p className="text-lg font-semibold">{tile.title}</p>
                <p className="mt-2 text-sm leading-6 text-white/70">{tile.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="wrap py-16">
          <Reveal variant="up" className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold">{c.shopTitle}</h2>
            <p className="mt-4 leading-7 text-muted">{c.shopLede}</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {SHOP.map((src, i) => (
              <Reveal key={src} variant="up" delay={(i % 5) * 40} className="overflow-hidden rounded-xl bg-white ring-1 ring-[#d7e2ee]">
                <img src={src} alt="" className="aspect-[4/3] w-full object-cover" />
              </Reveal>
            ))}
          </div>
          <Reveal variant="up" className="mt-10 text-center">
            <Link to="/products" search={catalogSearch({ line: "Automotive" })} className="inline-block rounded bg-[#071e36] px-6 py-3 text-sm font-semibold text-white">
              {c.cta}
            </Link>
          </Reveal>
        </section>
      </main>
    </StoreShell>
  );
}
