import { createFileRoute, Link } from "@tanstack/react-router";
import { getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { catalogSearch } from "@/components/store/catalog";
import { Reveal } from "@/components/store/reveal";
import { useI18n, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  loader: () => getStoreHome(),
  component: About,
});

function About() {
  const store = Route.useLoaderData();
  const { lang } = useI18n();
  const copy = ABOUT[lang];
  if (!store) return <main className="wrap py-16">…</main>;
  return (
    <StoreShell name={store.name} email={store.email}>
      <main>
        <section className="bg-[#f3f5f8]">
          <Reveal variant="fade" className="wrap max-w-3xl py-16 text-center sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{copy.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{copy.title}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted">{copy.lede}</p>
          </Reveal>
        </section>

        <section className="wrap grid items-center gap-10 py-16 lg:grid-cols-2">
          <Reveal variant="right">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{copy.whatLabel}</p>
            <h2 className="mt-3 text-3xl font-semibold">{copy.whatTitle}</h2>
            <p className="mt-4 leading-7 text-muted">{copy.whatBody}</p>
            <Link to="/manufacturing" className="mt-6 inline-flex items-center gap-2 font-semibold text-[#e60013]">
              {copy.whatLink}
              <span aria-hidden>→</span>
            </Link>
          </div>
          </Reveal>
          <Reveal variant="left">
          <div className="relative">
            <img src="/sensor.jpg" alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
            <div className="absolute bottom-4 left-4 rounded-xl bg-white px-5 py-3 shadow-lg">
              <p className="text-3xl font-semibold leading-none text-[#e60013]">{copy.year}</p>
              <p className="mt-1 text-sm text-muted">{copy.yearLabel}</p>
            </div>
          </div>
          </Reveal>
        </section>

        <section className="bg-[#f7f8fa]">
          <Reveal variant="up" className="wrap py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{copy.journeyLabel}</p>
              <h2 className="mt-3 text-3xl font-semibold">{copy.journeyTitle}</h2>
              <p className="mt-3 text-muted">{copy.journeySub}</p>
            </div>
            <ol className="relative mx-auto mt-12 max-w-4xl">
              <div className="absolute bottom-0 left-4 top-0 w-px bg-[#d7dbe3] md:left-1/2" />
              {copy.steps.map((step, index) => {
                const onLeft = index % 2 === 0;
                return (
                  <li key={step.year} className="relative py-5 md:grid md:grid-cols-2">
                    <span className="absolute left-4 top-8 size-3 -translate-x-1/2 rounded-full border-2 border-white bg-[#e60013] md:left-1/2" />
                    <div className={onLeft
                      ? "pl-10 md:pr-12 md:text-right"
                      : "pl-10 md:col-start-2 md:pl-12"}>
                      <p className="text-sm font-semibold text-[#e60013]">{step.year}</p>
                      <h3 className="mt-1 text-xl font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </section>

        <section className="wrap py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{copy.advLabel}</p>
            <h2 className="mt-3 text-3xl font-semibold">{copy.advTitle}</h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {copy.advantages.map((item, index) => (
              <Reveal key={item.title} variant="up" delay={index * 80}>
              <article>
                <div className="grid size-12 place-items-center rounded-full bg-[#eef2f7] text-[#e60013]">
                  <AdvIcon index={index} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-[#f7f8fa]">
          <div className="wrap py-16">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{copy.cultureLabel}</p>
              <h2 className="mt-3 text-3xl font-semibold">{copy.cultureTitle}</h2>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {copy.culture.map((item, index) => (
                <Reveal key={item.title} variant={index === 1 ? "up" : index === 0 ? "right" : "left"}>
                <article className="h-full rounded-2xl border border-line bg-white p-6">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
                </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="wrap py-16">
          <Reveal variant="up">
          <div className="rounded-2xl bg-gradient-to-r from-[#ff6b78] to-[#e60013] px-6 py-14 text-center text-white">
            <h2 className="text-3xl font-semibold">{copy.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/75">{copy.ctaBody}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/contact" className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#e60013]">{copy.ctaContact}</Link>
              <Link to="/products" search={catalogSearch()} className="rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white">{copy.ctaBrowse}</Link>
            </div>
          </div>
          </Reveal>
        </section>
      </main>
    </StoreShell>
  );
}

function AdvIcon({ index }: { index: number }) {
  const common = { viewBox: "0 0 24 24", className: "size-6", fill: "none", stroke: "currentColor", strokeWidth: 1.7 };
  if (index === 1) {
    return (
      <svg {...common} aria-hidden>
        <circle cx="11" cy="11" r="6" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg {...common} aria-hidden>
        <path d="M12 3 5 6v6c0 4 3 6.5 7 8 4-1.5 7-4 7-8V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden>
      <path d="M4 14a8 8 0 1 1 16 0" strokeLinecap="round" />
      <path d="M12 14V8" strokeLinecap="round" />
      <path d="M8 18h8" strokeLinecap="round" />
    </svg>
  );
}

type AboutCopy = {
  eyebrow: string;
  title: string;
  lede: string;
  whatLabel: string;
  whatTitle: string;
  whatBody: string;
  whatLink: string;
  year: string;
  yearLabel: string;
  journeyLabel: string;
  journeyTitle: string;
  journeySub: string;
  steps: { year: string; title: string; body: string }[];
  advLabel: string;
  advTitle: string;
  advantages: { title: string; body: string }[];
  cultureLabel: string;
  cultureTitle: string;
  culture: { title: string; body: string }[];
  ctaTitle: string;
  ctaBody: string;
  ctaContact: string;
  ctaBrowse: string;
};

const ABOUT: Record<Lang, AboutCopy> = {
  zh: {
    eyebrow: "关于我们",
    title: "氧传感器制造商",
    lede: "温州瑞铂专注于氧传感器的研发与制造。产品覆盖汽车、摩托车、工业与家电设备用氧传感器，以及氮氧传感器。工厂用自己的产线，为全球售后客户提供稳定的产品。",
    whatLabel: "我们做什么",
    whatTitle: "只做氧传感器这一条线",
    whatBody: "汽车氧传感器、摩托车氧传感器、工业与家电设备用氧传感器、氮氧传感器，都在温州生产。买家用 OEM 号找到对应产品，工厂按确认的这一颗生产和发货。",
    whatLink: "了解制造",
    year: "2009",
    yearLabel: "开始生产",
    journeyLabel: "我们的历程",
    journeyTitle: "从制造到出口",
    journeySub: "2009 年开始生产氧传感器。2021 年起通过 RBIC 向全球出口。",
    steps: [
      { year: "2009", title: "开始生产氧传感器", body: "在温州做氧传感器的研发和制造，供给汽车售后替换。" },
      { year: "2021", title: "通过 RBIC 向全球出口", body: "海外买家可以用 OEM 号查目录、询价和订样品。工厂仍按确认的产品发货。" },
    ],
    advLabel: "我们的优势",
    advTitle: "为什么是这家工厂",
    advantages: [
      { title: "产品就这一类", body: "站点只放氧传感器和氮氧传感器。不把进气歧管、缸盖或其他零件写进来。" },
      { title: "号对上才是这颗", body: "目录按 OEM 对照。你搜到的号印在这颗传感器上，不是另外一颗。" },
      { title: "品质先于口号", body: "靠设备、工艺和出厂检查。认证、交期和批量价格写在报价单上。" },
    ],
    cultureLabel: "我们的理念",
    cultureTitle: "专注、专业、创新、共赢",
    culture: [
      { title: "把传感器做稳", body: "先把性能、稳定性和耐久性做出来，再谈批量。" },
      { title: "技术和品质优先", body: "持续改进工艺。不用没有依据的产能和准时率代替产品本身。" },
      { title: "和客户一起把件确认清楚", body: "样品可以先订。批量单独报价。发货以双方确认的产品为准。" },
    ],
    ctaTitle: "准备合作",
    ctaBody: "把 OEM 号、数量和目的地发过来。目录里有的直接对上，没有的也可以询价。",
    ctaContact: "联系我们",
    ctaBrowse: "浏览产品",
  },
  en: {
    eyebrow: "About us",
    title: "Oxygen sensor manufacturer",
    lede: "Wenzhou Ruibo designs and manufactures oxygen sensors. The range covers automotive, motorcycle, industrial and household equipment, and NOx sensors. The factory supplies the global aftermarket from its own lines.",
    whatLabel: "What we do",
    whatTitle: "One line: oxygen sensors",
    whatBody: "Automotive, motorcycle, industrial and household, and NOx sensors are made in Wenzhou. Buyers find the part by OEM number. The factory builds and ships that confirmed part.",
    whatLink: "Explore manufacturing",
    year: "2009",
    yearLabel: "Production begins",
    journeyLabel: "Our journey",
    journeyTitle: "From the workshop to export",
    journeySub: "Oxygen sensor production started in 2009. Worldwide export through RBIC started in 2021.",
    steps: [
      { year: "2009", title: "Oxygen sensor production starts", body: "Development and manufacturing of oxygen sensors in Wenzhou, for automotive replacement." },
      { year: "2021", title: "Export through RBIC", body: "Overseas buyers can search an OEM number, ask, and order a sample. The factory still ships the confirmed part." },
    ],
    advLabel: "Our advantage",
    advTitle: "Why this factory",
    advantages: [
      { title: "This category only", body: "The site lists oxygen and NOx sensors. Intake manifolds, covers, and other parts are not added." },
      { title: "The number is this part", body: "The catalog is an OEM cross-reference. The number you find is printed on this sensor, not a second one." },
      { title: "Quality before slogans", body: "Equipment, process, and a check before shipment. Certificates, lead time, and bulk price stay on the quote." },
    ],
    cultureLabel: "How we work",
    cultureTitle: "Focus, craft, improvement, shared results",
    culture: [
      { title: "Make the sensor hold", body: "Performance, stability, and durability come before a volume talk." },
      { title: "Process before claims", body: "Keep improving the process. Capacity and on-time rates are not invented for the page." },
      { title: "Confirm the part together", body: "A sample can be ordered first. Volume is quoted. Shipment follows the part both sides confirmed." },
    ],
    ctaTitle: "Ready to work together",
    ctaBody: "Send the OEM number, quantity, and destination. If it is in the catalog, it matches. If it is not, you can still ask.",
    ctaContact: "Contact us",
    ctaBrowse: "Browse products",
  },
  es: {
    eyebrow: "Sobre nosotros",
    title: "Fabricante de sensores de oxígeno",
    lede: "Wenzhou Ruibo diseña y fabrica sensores de oxígeno. La gama cubre automoción, moto, industria y hogar, y sensores NOx. La fábrica abastece el recambio mundial desde sus propias líneas.",
    whatLabel: "Qué hacemos",
    whatTitle: "Una sola línea: sensores de oxígeno",
    whatBody: "Sensores de automoción, moto, industria y hogar, y NOx, fabricados en Wenzhou. El comprador encuentra la pieza por el número OEM. La fábrica produce y envía esa pieza confirmada.",
    whatLink: "Ver fabricación",
    year: "2009",
    yearLabel: "Empieza la producción",
    journeyLabel: "Nuestra trayectoria",
    journeyTitle: "Del taller a la exportación",
    journeySub: "La producción de sensores empezó en 2009. La exportación mundial con RBIC empezó en 2021.",
    steps: [
      { year: "2009", title: "Empieza la producción", body: "Desarrollo y fabricación de sensores de oxígeno en Wenzhou, para recambio de automoción." },
      { year: "2021", title: "Exportación con RBIC", body: "El comprador de fuera puede buscar un OEM, consultar y pedir una muestra. La fábrica envía la pieza confirmada." },
    ],
    advLabel: "Nuestra ventaja",
    advTitle: "Por qué esta fábrica",
    advantages: [
      { title: "Solo esta categoría", body: "El sitio lista sensores de oxígeno y NOx. No se añaden colectores ni otras piezas." },
      { title: "El número es esta pieza", body: "El catálogo es una referencia OEM. El número que encuentra está en este sensor, no en otro." },
      { title: "La calidad antes del eslogan", body: "Equipo, proceso y control antes del envío. Certificados, plazo y precio de volumen van en la oferta." },
    ],
    cultureLabel: "Cómo trabajamos",
    cultureTitle: "Enfoque, oficio, mejora, resultado compartido",
    culture: [
      { title: "Que el sensor aguante", body: "Rendimiento, estabilidad y durabilidad antes de hablar de volumen." },
      { title: "El proceso antes de la frase", body: "Mejorar el proceso. No se inventan capacidad ni puntualidad para la página." },
      { title: "Confirmar la pieza juntos", body: "La muestra se puede pedir primero. El volumen se cotiza. El envío sigue la pieza confirmada." },
    ],
    ctaTitle: "Listos para trabajar juntos",
    ctaBody: "Envíe el número OEM, la cantidad y el destino. Si está en el catálogo, coincide. Si no está, también puede consultar.",
    ctaContact: "Contacto",
    ctaBrowse: "Ver productos",
  },
  pt: {
    eyebrow: "Sobre nós",
    title: "Fabricante de sensores de oxigénio",
    lede: "A Wenzhou Ruibo desenvolve e fabrica sensores de oxigénio. A gama cobre automóvel, moto, indústria e eletrodomésticos, e sensores NOx. A fábrica abastece o aftermarket mundial a partir das suas linhas.",
    whatLabel: "O que fazemos",
    whatTitle: "Uma linha: sensores de oxigénio",
    whatBody: "Sensores para automóvel, moto, indústria e eletrodomésticos, e NOx, feitos em Wenzhou. O comprador encontra a peça pelo número OEM. A fábrica produz e envia essa peça confirmada.",
    whatLink: "Ver fabrico",
    year: "2009",
    yearLabel: "Início da produção",
    journeyLabel: "O nosso percurso",
    journeyTitle: "Da oficina à exportação",
    journeySub: "A produção de sensores começou em 2009. A exportação mundial pela RBIC começou em 2021.",
    steps: [
      { year: "2009", title: "Começa a produção", body: "Desenvolvimento e fabrico de sensores de oxigénio em Wenzhou, para substituição automóvel." },
      { year: "2021", title: "Exportação pela RBIC", body: "O comprador no estrangeiro pode procurar um OEM, pedir informação e encomendar uma amostra. A fábrica envia a peça confirmada." },
    ],
    advLabel: "A nossa vantagem",
    advTitle: "Porque esta fábrica",
    advantages: [
      { title: "Só esta categoria", body: "O site lista sensores de oxigénio e NOx. Coletores e outras peças não entram." },
      { title: "O número é esta peça", body: "O catálogo é uma referência OEM. O número que encontra está neste sensor, não noutro." },
      { title: "Qualidade antes do slogan", body: "Equipamento, processo e verificação antes do envio. Certificados, prazo e preço de volume ficam na cotação." },
    ],
    cultureLabel: "Como trabalhamos",
    cultureTitle: "Foco, ofício, melhoria, resultado partilhado",
    culture: [
      { title: "Fazer o sensor aguentar", body: "Desempenho, estabilidade e durabilidade antes de falar de volume." },
      { title: "O processo antes da frase", body: "Melhorar o processo. Capacidade e pontualidade não são inventadas para a página." },
      { title: "Confirmar a peça em conjunto", body: "A amostra pode ser pedida primeiro. O volume é cotado. O envio segue a peça confirmada." },
    ],
    ctaTitle: "Prontos para trabalhar juntos",
    ctaBody: "Envie o número OEM, a quantidade e o destino. Se estiver no catálogo, corresponde. Se não estiver, também pode perguntar.",
    ctaContact: "Contacto",
    ctaBrowse: "Ver produtos",
  },
  ru: {
    eyebrow: "О нас",
    title: "Производитель кислородных датчиков",
    lede: "Wenzhou Ruibo разрабатывает и производит кислородные датчики: автомобильные, мотоциклетные, для промышленности и бытовой техники, а также датчики NOx. Завод поставляет мировой вторичный рынок со своих линий.",
    whatLabel: "Что мы делаем",
    whatTitle: "Одна линейка: кислородные датчики",
    whatBody: "Автомобильные, мотоциклетные, промышленные и бытовые датчики, а также NOx, делают в Вэньчжоу. Покупатель находит деталь по номеру OEM. Завод выпускает и отгружает именно её.",
    whatLink: "Производство",
    year: "2009",
    yearLabel: "Начало производства",
    journeyLabel: "Наш путь",
    journeyTitle: "От цеха к экспорту",
    journeySub: "Производство датчиков началось в 2009 году. Экспорт через RBIC — с 2021 года.",
    steps: [
      { year: "2009", title: "Старт производства", body: "Разработка и выпуск кислородных датчиков в Вэньчжоу для автомобильной замены." },
      { year: "2021", title: "Экспорт через RBIC", body: "Зарубежный покупатель ищет номер OEM, запрашивает цену и заказывает образец. Завод отгружает подтверждённую деталь." },
    ],
    advLabel: "Наше преимущество",
    advTitle: "Почему этот завод",
    advantages: [
      { title: "Только эта категория", body: "На сайте кислородные датчики и NOx. Впускные коллекторы и другие детали сюда не добавляются." },
      { title: "Номер — это эта деталь", body: "Каталог сверяет OEM. Найденный номер стоит на этом датчике, а не на другом." },
      { title: "Качество раньше лозунга", body: "Оборудование, процесс и проверка перед отгрузкой. Сертификаты, срок и оптовая цена — в коммерческом предложении." },
    ],
    cultureLabel: "Как мы работаем",
    cultureTitle: "Фокус, ремесло, улучшение, общий результат",
    culture: [
      { title: "Сначала чтобы датчик держал", body: "Характеристики, стабильность и ресурс — до разговора об объёме." },
      { title: "Процесс важнее фразы", body: "Процесс улучшается. Мощность и процент вовремя на странице не выдумываются." },
      { title: "Деталь подтверждают вместе", body: "Образец можно заказать сразу. Объём считается отдельно. Отгрузка идёт по подтверждённой детали." },
    ],
    ctaTitle: "Готовы работать вместе",
    ctaBody: "Пришлите номер OEM, количество и страну. Если номер есть в каталоге, он совпадёт. Если нет — всё равно можно спросить.",
    ctaContact: "Связаться",
    ctaBrowse: "Каталог",
  },
  ar: {
    eyebrow: "من نحن",
    title: "مصنع حساسات الأكسجين",
    lede: "تطور رويبو في ونتشو وتصنّع حساسات الأكسجين للسيارات والدراجات والمعدات الصناعية والمنزلية، إضافة إلى حساسات أكاسيد النيتروجين. المصنع يزوّد سوق قطع الغيار العالمي من خطوطه.",
    whatLabel: "ماذا نصنع",
    whatTitle: "خط واحد: حساسات الأكسجين",
    whatBody: "حساسات السيارات والدراجات والصناعة والأجهزة المنزلية وحساسات أكاسيد النيتروجين تُصنع في ونتشو. يجد المشتري القطعة برقم OEM. يصنّع المصنع هذه القطعة المؤكدة ويشحنها.",
    whatLink: "التصنيع",
    year: "2009",
    yearLabel: "بداية الإنتاج",
    journeyLabel: "مسارنا",
    journeyTitle: "من الورشة إلى التصدير",
    journeySub: "بدأ إنتاج الحساسات عام 2009. بدأ التصدير عبر RBIC عام 2021.",
    steps: [
      { year: "2009", title: "بدء إنتاج حساسات الأكسجين", body: "تطوير وتصنيع حساسات الأكسجين في ونتشو لقطع غيار السيارات." },
      { year: "2021", title: "التصدير عبر RBIC", body: "يستطيع المشتري الخارجي البحث برقم OEM وطلب السعر وعينة. المصنع يشحن القطعة المؤكدة." },
    ],
    advLabel: "ميزتنا",
    advTitle: "لماذا هذا المصنع",
    advantages: [
      { title: "هذه الفئة فقط", body: "الموقع يعرض حساسات الأكسجين وأكاسيد النيتروجين. لا تُضاف مجمعات السحب أو قطع أخرى." },
      { title: "الرقم هو هذه القطعة", body: "الكتالوج يطابق رقم OEM. الرقم الذي تجده مطبوع على هذا الحساس، وليس على حساس آخر." },
      { title: "الجودة قبل الشعار", body: "المعدات والعملية والفحص قبل الشحن. الشهادات والمهلة وسعر الجملة تبقى في عرض السعر." },
    ],
    cultureLabel: "كيف نعمل",
    cultureTitle: "تركيز، حرفية، تحسين، نتيجة مشتركة",
    culture: [
      { title: "أن يثبت الحساس", body: "الأداء والثبات والعمر قبل الحديث عن الكمية." },
      { title: "العملية قبل العبارة", body: "نستمر في تحسين العملية. لا نختلق الطاقة الإنتاجية أو نسبة الالتزام للصفحة." },
      { title: "تأكيد القطعة معًا", body: "يمكن طلب عينة أولًا. الكمية تُسعّر على حدة. الشحن يتبع القطعة التي أكدها الطرفان." },
    ],
    ctaTitle: "جاهزون للعمل معًا",
    ctaBody: "أرسل رقم OEM والكمية والوجهة. إن كان في الكتالوج فالتطابق موجود. وإن لم يكن، يمكن الاستفسار.",
    ctaContact: "اتصل بنا",
    ctaBrowse: "تصفح المنتجات",
  },
  mn: {
    eyebrow: "Бидний тухай",
    title: "Хүчилтөрөгчийн мэдрэгчийн үйлдвэрлэгч",
    lede: "Wenzhou Ruibo хүчилтөрөгчийн мэдрэгч зохион бүтээж, үйлдвэрлэдэг. Хүрээ нь автомашин, мотоцикл, үйлдвэр ба гэр ахуй, мөн NOx мэдрэгчийг хамарна. Үйлдвэр дэлхийн сэлбэгийн зах зээлийг өөрийн шугамаас хангана.",
    whatLabel: "Бид юу хийдэг вэ",
    whatTitle: "Нэг шугам: хүчилтөрөгчийн мэдрэгч",
    whatBody: "Автомашин, мотоцикл, үйлдвэр ба гэр ахуй, NOx мэдрэгчийг Вэньжоуд хийдэг. Худалдан авагч OEM дугаараар эд ангийг олно. Үйлдвэр баталгаажсан тэр эд ангийг хийж, ачина.",
    whatLink: "Үйлдвэрлэлийг үзэх",
    year: "2009",
    yearLabel: "Үйлдвэрлэл эхэлсэн",
    journeyLabel: "Бидний замнал",
    journeyTitle: "Цехаас экспорт хүртэл",
    journeySub: "Мэдрэгчийн үйлдвэрлэл 2009 онд эхэлсэн. RBIC-ээр дамжсан дэлхийн экспорт 2021 онд эхэлсэн.",
    steps: [
      { year: "2009", title: "Хүчилтөрөгчийн мэдрэгчийн үйлдвэрлэл эхэлсэн", body: "Вэньжоуд автомашины сэлбэгт зориулсан хүчилтөрөгчийн мэдрэгчийг боловсруулж, үйлдвэрлэж эхэлсэн." },
      { year: "2021", title: "RBIC-ээр экспорт", body: "Гадаад худалдан авагч OEM дугаар хайж, асууж, дээж захиалж болно. Үйлдвэр баталгаажсан эд ангийг ачина." },
    ],
    advLabel: "Бидний давуу тал",
    advTitle: "Яагаад энэ үйлдвэр вэ",
    advantages: [
      { title: "Зөвхөн энэ ангилал", body: "Сайт хүчилтөрөгч ба NOx мэдрэгчийг жагсаана. Оролтын коллектор болон бусад эд ангийг нэмэхгүй." },
      { title: "Дугаар нь энэ эд анги", body: "Каталог нь OEM харьцуулалт. Таны олсон дугаар энэ мэдрэгч дээр хэвлэгдсэн, өөр мэдрэгч биш." },
      { title: "Уриагаас өмнө чанар", body: "Тоног, процесс, ачилтын өмнөх шалгалт. Гэрчилгээ, хугацаа, бөөний үнэ үнийн санал дээр байна." },
    ],
    cultureLabel: "Бид хэрхэн ажилладаг",
    cultureTitle: "Төвлөрөл, ур чадвар, сайжруулалт, хамтын үр дүн",
    culture: [
      { title: "Мэдрэгчийг бат бөх хийх", body: "Гүйцэтгэл, тогтвортой байдал, эдэлгээ нь тооны ярианаас өмнө." },
      { title: "Нэхэмжлэлээс өмнө процесс", body: "Процессыг үргэлжлүүлэн сайжруулна. Хүчин чадал, цаг баримтлалыг хуудсанд зохиож бичихгүй." },
      { title: "Эд ангийг хамтдаа баталгаажуулах", body: "Дээжийг эхлээд захиалж болно. Бөөний үнийг тусад нь гаргана. Ачилт хоёр талын баталсан эд ангийг дагана." },
    ],
    ctaTitle: "Хамтран ажиллахад бэлэн",
    ctaBody: "OEM дугаар, тоо, очих газрыг илгээнэ үү. Каталогт байвал таарна. Байхгүй бол ч асууж болно.",
    ctaContact: "Холбоо барих",
    ctaBrowse: "Бүтээгдэхүүн үзэх",
  },
};
