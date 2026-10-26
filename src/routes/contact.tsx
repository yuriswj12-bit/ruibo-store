import { createFileRoute } from "@tanstack/react-router";
import { getStoreHome } from "@/lib/commerce.functions";
import { StoreShell } from "@/components/store/shell";
import { InquiryForm } from "@/components/store/inquiry-form";
import { Reveal } from "@/components/store/reveal";
import { useI18n, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  loader: () => getStoreHome(),
  component: Contact,
});

const PHONE = "+86-13706647066";
const WA = "8613706647066";
const ADDRESS = "No.59-61, North Fumin Road, Shengcheng Street, Ruian, Wenzhou, Zhejiang, China";

function Contact() {
  const store = Route.useLoaderData();
  const { lang, t } = useI18n();
  const copy = COPY[lang];
  if (!store) return <main className="wrap py-16">…</main>;
  const email = store.email || "info@cnrbic.com";
  const cards = [
    { title: copy.email, value: email, hint: copy.mailHint, href: `mailto:${email}`, icon: "mail" as const },
    { title: copy.phone, value: PHONE, hint: copy.phoneHint, href: `tel:${PHONE}`, icon: "phone" as const },
    { title: "WhatsApp", value: copy.chat, hint: copy.waHint, href: `https://wa.me/${WA}`, icon: "chat" as const },
    { title: copy.address, value: ADDRESS, hint: copy.office, href: "", icon: "pin" as const },
  ];
  return (
    <StoreShell name={store.name} email={store.email} whatsapp={store.whatsapp}>
      <main>
        <section
          className="relative grid min-h-[380px] items-center bg-gradient-to-r from-[#ff6b78] to-[#e60013] bg-cover bg-center"
          style={{ backgroundImage: "linear-gradient(90deg, rgba(230,0,19,.62), rgba(255,107,120,.45)), url(/handshake.jpg)" }}
        >
          <div className="wrap py-20 text-white">
            <Reveal variant="up">
              <p className="text-xs font-semibold tracking-[0.22em] text-white/80">{copy.kicker}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-6xl">{copy.title}</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/85">{copy.lede}</p>
            </Reveal>
          </div>
        </section>

        <section className="wrap grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <Reveal key={card.title} variant={index % 2 === 0 ? "up" : "fade"} delay={index * 80}>
              <article className="h-full rounded-2xl bg-[#f6f7fb] p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-[#ece8fb] text-[#e60013]">
                  <CardIcon name={card.icon} />
                </span>
                <h2 className="mt-8 text-lg font-semibold">{card.title}</h2>
                {card.href ? (
                  <a href={card.href} className="mt-2 block text-sm font-medium text-[#e60013] underline-offset-2 hover:underline" target={card.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{card.value}</a>
                ) : (
                  <p className="mt-2 text-sm font-medium leading-6 text-[#e60013]">{card.value}</p>
                )}
                <p className="mt-3 text-sm leading-6 text-[#667085]">{card.hint}</p>
              </article>
            </Reveal>
          ))}
        </section>

        <section className="bg-[#f7f8fa]">
          <div className="wrap grid gap-12 py-16 lg:grid-cols-2">
            <Reveal variant="right">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#667085]">{copy.inquiry}</p>
              <h2 className="mt-2 text-4xl font-semibold">{copy.how}</h2>
              <ol className="mt-5 grid gap-2 text-sm leading-6 text-[#667085]">
                {copy.steps.map((step, index) => (
                  <li key={step}>{index + 1}. {step}</li>
                ))}
              </ol>
              <div className="mt-6 rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(16,24,40,.04)]">
                <InquiryForm contact submitLabel={copy.send} />
              </div>
            </Reveal>
            <Reveal variant="left">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#667085]">{copy.hoursKicker}</p>
              <h2 className="mt-2 text-4xl font-semibold">{copy.when}</h2>
              <div className="mt-6 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(16,24,40,.04)]">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full border border-line text-[#e60013]">
                    <CardIcon name="clock" />
                  </span>
                  <h3 className="text-lg font-semibold">{copy.replyTitle}</h3>
                </div>
                <ul className="mt-4 grid gap-3 text-sm">
                  {copy.hours.map((row) => (
                    <li key={row.label} className="flex items-start justify-between gap-4">
                      <span>{row.label}</span>
                      <span className="text-right text-[#667085]">{row.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-t border-line pt-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full border border-line text-[#e60013]">
                      <CardIcon name="globe" />
                    </span>
                    <h3 className="text-lg font-semibold">{copy.support}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#667085]">{copy.supportBody}</p>
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(16,24,40,.04)]">
                <iframe
                  title={copy.title}
                  className="h-72 w-full"
                  src="https://maps.google.com/maps?q=27.78657,120.67780&hl=en&z=16&output=embed"
                />
                <div className="px-5 py-4">
                  <p className="font-semibold">{store.name}</p>
                  <p className="mt-1 text-sm text-[#667085]">{copy.mapLine}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="wrap py-16">
          <Reveal variant="fade" className="text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#667085]">{copy.faqKicker}</p>
            <h2 className="mt-2 text-4xl font-semibold">{copy.faqTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#667085]">{copy.faqLede}</p>
          </Reveal>
          <div className="mx-auto mt-8 grid max-w-3xl gap-4">
            {copy.faqs.map((item, index) => (
              <Reveal key={item.q} variant="up" delay={index * 70}>
                <article className="rounded-2xl bg-[#f6f7fb] px-6 py-5">
                  <h3 className="font-semibold">Q: {item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#667085]">{item.a}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="wrap pb-16 text-center">
          <Reveal variant="up">
            <p className="text-[#1a1a2e]">{copy.still}</p>
            <a href={`mailto:${email}`} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#e60013] px-5 py-3 text-sm font-semibold text-white">
              {copy.mailCta} <span aria-hidden>→</span>
            </a>
          </Reveal>
        </section>
      </main>
    </StoreShell>
  );
}

function CardIcon({ name }: { name: "mail" | "phone" | "chat" | "pin" | "clock" | "globe" }) {
  const common = "size-5";
  if (name === "mail") return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
  if (name === "phone") return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M8 4h2l1.2 3.2-1.6 1a12 12 0 0 0 5.2 5.2l1-1.6L20 14v2a2 2 0 0 1-2.2 2A16 16 0 0 1 4 6.2 2 2 0 0 1 6 4h2Z" /></svg>;
  if (name === "chat") return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 16.5 4 20l4-1.5A8 8 0 1 0 6 16.5Z" /></svg>;
  if (name === "pin") return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" /><circle cx="12" cy="11" r="2" /></svg>;
  if (name === "clock") return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="8" /><path d="M12 8v5l3 2" /></svg>;
  return <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2.2 2.4 3.3 5.1 3.3 8S14.2 17.6 12 20c-2.2-2.4-3.3-5.1-3.3-8S9.8 6.4 12 4Z" /></svg>;
}

type Copy = {
  kicker: string;
  title: string;
  lede: string;
  email: string;
  mailHint: string;
  phone: string;
  phoneHint: string;
  chat: string;
  waHint: string;
  address: string;
  office: string;
  inquiry: string;
  how: string;
  steps: string[];
  send: string;
  hoursKicker: string;
  when: string;
  replyTitle: string;
  hours: { label: string; value: string }[];
  support: string;
  supportBody: string;
  mapLine: string;
  faqKicker: string;
  faqTitle: string;
  faqLede: string;
  faqs: { q: string; a: string }[];
  still: string;
  mailCta: string;
};

const COPY: Record<Lang, Copy> = {
  zh: {
    kicker: "联系我们",
    title: "取得联系",
    lede: "有问题，或要报价？把 OEM 号发过来。工厂 24 小时内回复。",
    email: "邮箱",
    mailHint: "我们通常会在 24 小时内回复。",
    phone: "电话",
    phoneHint: "周一至周五，北京时间上午 9 点至下午 6 点。",
    chat: "在线沟通",
    waHint: "快速回复紧急咨询。",
    address: "地址",
    office: "制造与出口办事处",
    inquiry: "发送询价",
    how: "怎么合作",
    steps: ["发来 OEM 号或产品清单。", "我们确认是哪只传感器，并报价。", "先做样品或排产，出货前检查功能。", "从温州包装、出口。"],
    send: "发送询价",
    hoursKicker: "回复时间",
    when: "什么时候联系",
    replyTitle: "回复",
    hours: [
      { label: "邮件", value: "24 小时内回复" },
      { label: "WhatsApp", value: "急单优先" },
      { label: "样品", value: "按报价里的交期" },
    ],
    support: "各时区",
    supportBody: "买家在不同时区。邮件随时可以发，我们 24 小时内回复。",
    mapLine: "中国浙江省温州市瑞安市",
    faqKicker: "常见问题",
    faqTitle: "常见问题",
    faqLede: "关于氧传感器、编号和起订量。",
    faqs: [
      { q: "你们做什么？", a: "汽车、摩托车、工业与家电、氮氧传感器。目录里现在是 302 个柜号、601 个 OEM 号。不做进气歧管或其他零件。" },
      { q: "网站上没有我的编号怎么办？", a: "网站上并未列出全部型号和编号。把原厂编号（OE）、博世编号（Bosch）、电装编号（Denso）或其他参考编号发过来，我们会帮您找到对应的氧传感器。" },
      { q: "起订量是多少？", a: "目录样品 32 美元。批量起订通常是 100，以产品页为准。批量价格另报，不在页面上标死。" },
      { q: "为什么同一个号会出两条？", a: "这个 OEM 印在两个柜号上。搜索没有错。下单前对一下车型。" },
    ],
    still: "还有问题？直接发邮件。",
    mailCta: "给我们发邮件",
  },
  en: {
    kicker: "CONTACT US",
    title: "Get in Touch",
    lede: "Have a question or need a quote? Send the OEM number. The factory replies within 24 hours.",
    email: "Email",
    mailHint: "We typically respond within 24 hours.",
    phone: "Phone",
    phoneHint: "Monday to Friday, 9:00 to 18:00 China time.",
    chat: "Chat with us",
    waHint: "Quick replies for urgent inquiries.",
    address: "Address",
    office: "Manufacturing and export office",
    inquiry: "SEND INQUIRY",
    how: "How We Work",
    steps: ["Send the OEM number or your list.", "We confirm the sensor and the price.", "Sample or production, then a function check.", "Packing and shipment from Wenzhou."],
    send: "Send Inquiry",
    hoursKicker: "WORKING HOURS",
    when: "When to Reach Us",
    replyTitle: "Reply time",
    hours: [
      { label: "Email", value: "Reply within 24 hours" },
      { label: "WhatsApp", value: "Urgent numbers first" },
      { label: "Samples", value: "Lead time is on the quote" },
    ],
    support: "Global Support",
    supportBody: "Buyers write from every time zone. Email any time. We reply within 24 hours.",
    mapLine: "Ruian, Wenzhou, Zhejiang, China",
    faqKicker: "FAQ",
    faqTitle: "Frequently Asked Questions",
    faqLede: "Oxygen sensors, numbers, and order quantity.",
    faqs: [
      { q: "What do you make?", a: "Automotive, motorcycle, industrial and household, and NOx oxygen sensors. The catalog holds 302 factory codes and 601 OEM numbers. We do not list intake manifolds or other parts." },
      { q: "What if my number is not listed?", a: "Not every model and part number is listed on this site. Send an OE, Bosch, Denso, or other reference number, and we will match the right oxygen sensor." },
      { q: "What is the minimum order?", a: "Catalog samples are $32. Bulk minimum is usually 100, as shown on the product page. Bulk price is quoted, not printed as a list price." },
      { q: "Why do two results appear for one number?", a: "That OEM is printed on two factory codes. The search is not wrong. Check the vehicle before ordering." },
    ],
    still: "Still have a question? Email us.",
    mailCta: "Email us directly",
  },
  es: {
    kicker: "CONTACTO",
    title: "Hablemos",
    lede: "¿Tiene una pregunta o necesita precio? Envíe el número OEM. La fábrica responde en 24 horas.",
    email: "Correo",
    mailHint: "Solemos responder en 24 horas.",
    phone: "Teléfono",
    phoneHint: "Lunes a viernes, de 9:00 a 18:00 hora de China.",
    chat: "Escríbanos",
    waHint: "Respuesta rápida para consultas urgentes.",
    address: "Dirección",
    office: "Oficina de fabricación y exportación",
    inquiry: "ENVIAR CONSULTA",
    how: "Cómo trabajamos",
    steps: ["Envíe el OEM o su lista.", "Confirmamos el sensor y el precio.", "Muestra o producción, y revisión de función.", "Embalaje y envío desde Wenzhou."],
    send: "Enviar consulta",
    hoursKicker: "HORARIO",
    when: "Cuándo escribir",
    replyTitle: "Respuesta",
    hours: [
      { label: "Correo", value: "Respuesta en 24 horas" },
      { label: "WhatsApp", value: "Lo urgente primero" },
      { label: "Muestras", value: "El plazo va en la oferta" },
    ],
    support: "Atención global",
    supportBody: "Escriba desde cualquier zona horaria. Respondemos en 24 horas.",
    mapLine: "Ruian, Wenzhou, Zhejiang, China",
    faqKicker: "FAQ",
    faqTitle: "Preguntas frecuentes",
    faqLede: "Sensores de oxígeno, números y cantidad mínima.",
    faqs: [
      { q: "¿Qué fabrican?", a: "Sensores de oxígeno para auto, moto, industria y hogar, y NOx. El catálogo tiene 302 códigos y 601 OEM. No listamos colectores ni otras piezas." },
      { q: "¿Qué hago si mi número no está?", a: "No todos los modelos y números están en este sitio. Envíe el número OE, Bosch, Denso u otra referencia, y encontraremos el sensor correspondiente." },
      { q: "¿Cuál es el pedido mínimo?", a: "La muestra del catálogo cuesta 32 USD. El mínimo de volumen suele ser 100. El precio de volumen se cotiza." },
      { q: "¿Por qué un número da dos resultados?", a: "Ese OEM está impreso en dos códigos de fábrica. La búsqueda no falla. Compruebe el vehículo." },
    ],
    still: "¿Sigue con una duda? Escríbanos.",
    mailCta: "Enviar un correo",
  },
  pt: {
    kicker: "CONTACTO",
    title: "Fale connosco",
    lede: "Tem uma pergunta ou precisa de preço? Envie o número OEM. A fábrica responde em 24 horas.",
    email: "E-mail",
    mailHint: "Normalmente respondemos em 24 horas.",
    phone: "Telefone",
    phoneHint: "Segunda a sexta, das 9h às 18h, hora da China.",
    chat: "Fale connosco",
    waHint: "Resposta rápida para consultas urgentes.",
    address: "Morada",
    office: "Escritório de fabrico e exportação",
    inquiry: "ENVIAR PEDIDO",
    how: "Como trabalhamos",
    steps: ["Envie o OEM ou a lista.", "Confirmamos o sensor e o preço.", "Amostra ou produção, depois o teste de função.", "Embalagem e envio a partir de Wenzhou."],
    send: "Enviar pedido",
    hoursKicker: "HORÁRIO",
    when: "Quando contactar",
    replyTitle: "Resposta",
    hours: [
      { label: "E-mail", value: "Resposta em 24 horas" },
      { label: "WhatsApp", value: "Urgências primeiro" },
      { label: "Amostras", value: "O prazo vai na proposta" },
    ],
    support: "Apoio global",
    supportBody: "Escreva de qualquer fuso. Respondemos em 24 horas.",
    mapLine: "Ruian, Wenzhou, Zhejiang, China",
    faqKicker: "FAQ",
    faqTitle: "Perguntas frequentes",
    faqLede: "Sensores de oxigénio, números e quantidade mínima.",
    faqs: [
      { q: "O que fabricam?", a: "Sensores de oxigénio para automóvel, moto, indústria e casa, e NOx. O catálogo tem 302 códigos e 601 OEM. Não listamos coletores nem outras peças." },
      { q: "E se o meu número não estiver listado?", a: "Nem todos os modelos e números estão neste site. Envie o número OE, Bosch, Denso ou outra referência, e encontramos o sensor correspondente." },
      { q: "Qual é a encomenda mínima?", a: "A amostra do catálogo custa 32 USD. O mínimo de volume costuma ser 100. O preço de volume é orçamentado." },
      { q: "Porque é que um número dá dois resultados?", a: "Esse OEM está impresso em dois códigos de fábrica. A pesquisa não falhou. Confirme o veículo." },
    ],
    still: "Ainda tem uma dúvida? Escreva-nos.",
    mailCta: "Enviar e-mail",
  },
  ru: {
    kicker: "КОНТАКТЫ",
    title: "Напишите нам",
    lede: "Нужен ответ или цена? Пришлите номер OEM. Завод ответит в течение 24 часов.",
    email: "Почта",
    mailHint: "Обычно отвечаем в течение 24 часов.",
    phone: "Телефон",
    phoneHint: "На этот номер также приходит WhatsApp.",
    chat: "Написать",
    waHint: "Срочный номер — сразу в сообщение.",
    address: "Адрес",
    office: "Завод и экспортный офис",
    inquiry: "ЗАПРОС",
    how: "Как мы работаем",
    steps: ["Пришлите OEM или список.", "Подтверждаем датчик и цену.", "Образец или партия, затем проверка функции.", "Упаковка и отгрузка из Вэньчжоу."],
    send: "Отправить запрос",
    hoursKicker: "ВРЕМЯ ОТВЕТА",
    when: "Когда писать",
    replyTitle: "Ответ",
    hours: [
      { label: "Почта", value: "Ответ за 24 часа" },
      { label: "WhatsApp", value: "Срочные номера раньше" },
      { label: "Образцы", value: "Срок указан в предложении" },
    ],
    support: "Все часовые пояса",
    supportBody: "Пишите из любого пояса. Ответим в течение 24 часов.",
    mapLine: "Жуйань, Вэньчжоу, Чжэцзян, Китай",
    faqKicker: "ВОПРОСЫ",
    faqTitle: "Частые вопросы",
    faqLede: "Датчики кислорода, номера и минимальный заказ.",
    faqs: [
      { q: "Что вы производите?", a: "Датчики кислорода для авто, мото, промышленности и NOx. В каталоге 302 кода и 601 OEM. Впускные коллекторы и другие детали не указываем." },
      { q: "Что делать, если моего номера нет?", a: "На сайте указаны не все модели и номера. Пришлите номер OE, Bosch, Denso или другой справочный номер — мы подберём нужный датчик." },
      { q: "Какой минимальный заказ?", a: "Образец из каталога — 32 доллара. Опт обычно от 100. Оптовая цена в предложении." },
      { q: "Почему один номер даёт два результата?", a: "Этот OEM напечатан на двух заводских кодах. Поиск не ошибся. Сверьте автомобиль." },
    ],
    still: "Остался вопрос? Напишите на почту.",
    mailCta: "Написать нам",
  },
  ar: {
    kicker: "اتصل بنا",
    title: "تواصل معنا",
    lede: "لديك سؤال أو تحتاج سعرًا؟ أرسل رقم OEM. المصنع يرد خلال 24 ساعة.",
    email: "البريد",
    mailHint: "نرد عادة خلال 24 ساعة.",
    phone: "الهاتف",
    phoneHint: "هذا الرقم يستقبل واتساب أيضًا.",
    chat: "راسلنا",
    waHint: "للأرقام العاجلة أرسل رسالة.",
    address: "العنوان",
    office: "المصنع ومكتب التصدير",
    inquiry: "أرسل استفسارًا",
    how: "كيف نعمل",
    steps: ["أرسل رقم OEM أو قائمتك.", "نؤكد الحساس والسعر.", "عينة أو إنتاج، ثم فحص الوظيفة.", "التغليف والشحن من ونتشو."],
    send: "إرسال الاستفسار",
    hoursKicker: "وقت الرد",
    when: "متى تتواصل",
    replyTitle: "الرد",
    hours: [
      { label: "البريد", value: "رد خلال 24 ساعة" },
      { label: "واتساب", value: "العاجل أولًا" },
      { label: "العينات", value: "المدة في عرض السعر" },
    ],
    support: "كل المناطق الزمنية",
    supportBody: "راسلنا من أي منطقة زمنية. نرد خلال 24 ساعة.",
    mapLine: "رويآن، ونتشو، تشجيانغ، الصين",
    faqKicker: "أسئلة",
    faqTitle: "أسئلة شائعة",
    faqLede: "حساسات الأكسجين والأرقام والحد الأدنى.",
    faqs: [
      { q: "ماذا تصنعون؟", a: "حساسات أكسجين للسيارات والدراجات والصناعة وأكاسيد النيتروجين. الكتالوج فيه 302 رمزًا و601 رقم OEM. لا نعرض مشعبات السحب أو قطعًا أخرى." },
      { q: "ماذا لو لم يكن رقمي مدرجًا؟", a: "ليست كل الطرازات والأرقام مدرجة في هذا الموقع. أرسل رقم OE أو Bosch أو Denso أو أي رقم مرجعي آخر، وسنجد الحساس المناسب." },
      { q: "ما الحد الأدنى للطلب؟", a: "عينة الكتالوج 32 دولارًا. حد الكمية عادة 100. سعر الكمية في العرض." },
      { q: "لماذا يظهر الرقم في نتيجتين؟", a: "هذا الـ OEM مطبوع على رمزين للمصنع. البحث ليس خاطئًا. تحقق من السيارة." },
    ],
    still: "ما زال لديك سؤال؟ راسلنا.",
    mailCta: "أرسل بريدًا",
  },
  mn: {
    kicker: "ХОЛБОО БАРИХ",
    title: "Холбогдоорой",
    lede: "Асуулт эсвэл үнэ хэрэгтэй юу? OEM дугаараа илгээнэ үү. Үйлдвэр 24 цагийн дотор хариулна.",
    email: "Имэйл",
    mailHint: "Ихэвчлэн 24 цагийн дотор хариулна.",
    phone: "Утас",
    phoneHint: "Энэ дугаар WhatsApp хүлээн авна.",
    chat: "Мессеж бичих",
    waHint: "Яаралтай дугаарыг шууд бичнэ үү.",
    address: "Хаяг",
    office: "Үйлдвэр ба экспортын оффис",
    inquiry: "ЛАВЛАГАА",
    how: "Бид хэрхэн ажилладаг",
    steps: ["OEM дугаар эсвэл жагсаалтаа илгээнэ.", "Мэдрэгч болон үнийг батална.", "Дээж эсвэл үйлдвэрлэл, дараа нь ажиллагааны шалгалт.", "Вэньжоугаас савлаж ачина."],
    send: "Лавлагаа илгээх",
    hoursKicker: "ХАРИУЛАХ ХУГАЦАА",
    when: "Хэзээ холбогдох вэ",
    replyTitle: "Хариу",
    hours: [
      { label: "Имэйл", value: "24 цагийн дотор" },
      { label: "WhatsApp", value: "Яаралтайг эхэлж" },
      { label: "Дээж", value: "Хугацаа үнийн санал дээр" },
    ],
    support: "Бүх цагийн бүс",
    supportBody: "Аль бүсээс ч бичнэ үү. Бид 24 цагийн дотор хариулна.",
    mapLine: "Жуйань, Вэньжоу, Жэжян, Хятад",
    faqKicker: "АСУУЛТ",
    faqTitle: "Түгээмэл асуулт",
    faqLede: "Хүчилтөрөгчийн мэдрэгч, дугаар, доод захиалга.",
    faqs: [
      { q: "Та юу үйлдвэрлэдэг вэ?", a: "Автомашин, мотоцикл, үйлдвэр ба гэр ахуй, NOx хүчилтөрөгчийн мэдрэгч. Каталогт 302 код, 601 OEM. Оролтын коллектор болон бусад эд ангийг жагсаахгүй." },
      { q: "Дугаар жагсаалтад байхгүй бол яах вэ?", a: "Бүх загвар, дугаар энэ сайтад байхгүй. OE, Bosch, Denso эсвэл өөр лавлах дугаараа илгээнэ үү. Бид тохирох мэдрэгчийг олно." },
      { q: "Доод захиалга хэд вэ?", a: "Каталогийн дээж 32 ам.доллар. Бөөн захиалга ихэвчлэн 100-аас. Бөөний үнийг тусад нь гаргана." },
      { q: "Яагаад нэг дугаар хоёр үр дүн гаргадаг вэ?", a: "Тэр OEM хоёр үйлдвэрийн код дээр хэвлэгдсэн. Хайлт буруу биш. Захиалахын өмнө машинаа шалгана уу." },
    ],
    still: "Асуулт үлдсэн үү? Имэйл илгээнэ үү.",
    mailCta: "Шууд имэйл илгээх",
  },
};
