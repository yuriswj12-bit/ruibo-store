import type { Lang } from "@/lib/i18n";

type Block = { title: string; body: string };
type Page = { title: string; lede: string; blocks: Block[] };

const zh = {
  about: {
    title: "温州瑞铂传感",
    lede: "做氧传感器的工厂。买家用 OEM 号找产品，工厂按柜号发货。",
    blocks: [
      { title: "做什么", body: "汽车、摩托车、工业和氮氧传感器。目录里现在是 302 个产品、601 个 OEM 号。" },
      { title: "不做什么", body: "不把别的厂的年限、产能和准时率写到自己的页面上。交期和认证以报价单为准。" },
      { title: "买家看到什么", body: "页面上是他搜的 OEM 号。瑞铂柜号只出现在工厂后台、询盘和样品单。" },
    ],
  },
  manufacturing: {
    title: "制造",
    lede: "传感器在温州生产。这一页只写工厂实际在做的事。",
    blocks: [
      { title: "汽车和摩托车", body: "加热型氧传感器，按 OEM 接口和线束做替换件。" },
      { title: "工业和氮氧", body: "连续工况和排放监测用的传感器。号码没进画册时，直接询价。" },
      { title: "出厂", body: "发货前做功能检查。不在这里宣称没有提供证书的体系认证。" },
    ],
  },
  downloads: {
    title: "下载",
    lede: "公开目录就是站上的 OEM 搜索。印刷画册向工厂索取，不在这里放一份对不上的文件。",
    blocks: [
      { title: "氧传感器目录", body: "302 个产品已经可以按 OEM 号搜。要印刷版，在联系页留下邮箱。" },
    ],
  },
  contact: {
    title: "联系",
    lede: "把 OEM 号、数量和目的地写在下面。工厂按询盘回复。",
    blocks: [
      { title: "怎么处理", body: "询盘进工厂后台。销售看到的是柜号和你搜的 OEM，买家页面不显示柜号。" },
      { title: "样品", body: "样品价 32 美元，起订量以产品页为准。批量价单独报。" },
    ],
  },
  faq: {
    title: "常见问题",
    lede: "",
    blocks: [
      { title: "为什么搜某个号没有结果？", body: "画册里没有这个 OEM。可以询价，工厂确认能不能做。开头相同但不是同一个号，不会算作命中。" },
      { title: "一个号为什么出现两条？", body: "这个 OEM 印在两个柜号上。不是搜错了。下单前对一下车系。" },
      { title: "最小起订和样品？", body: "目录产品样品 32 美元。批量起订一般是 100，以产品页为准。" },
      { title: "货号在哪里？", body: "买家看 OEM。工厂发货看柜号，在后台和订单里。" },
    ],
  },
  privacy: {
    title: "隐私",
    lede: "询盘只用于回复这笔采购。",
    blocks: [
      { title: "收集什么", body: "姓名、邮箱、公司、电话和你写下的需求。样品单还会记下国家和数量。" },
      { title: "不用来做什么", body: "不出售这批联系方式。不在页面上公开你的询盘。" },
    ],
  },
  terms: {
    title: "条款",
    lede: "目录用于找号。下单以报价单为准。",
    blocks: [
      { title: "价格", body: "样品价是页面上的 32 美元。批量价写的是“工厂报价”，不是标价。" },
      { title: "号码", body: "OEM 号用来对照。对上号才是这颗传感器。工厂保留按柜号发货的口径。" },
    ],
  },
} satisfies Record<string, Page>;

const en: typeof zh = {
  about: {
    title: "Wenzhou Ruibo Sensing",
    lede: "An oxygen-sensor factory. Buyers search an OEM number. The factory ships by its own code.",
    blocks: [
      { title: "What we make", body: "Automotive, motorcycle, industrial, and NOx sensors. The catalog currently holds 302 parts and 601 OEM numbers." },
      { title: "What we do not claim", body: "We do not paste another company's years, capacity, or on-time rate onto this site. Lead time and certificates belong on the quote." },
      { title: "What a buyer sees", body: "The page shows the OEM they searched. The Ruibo code stays in the factory desk, the inquiry, and the sample order." },
    ],
  },
  manufacturing: {
    title: "Manufacturing",
    lede: "The sensors are made in Wenzhou. This page only describes work the factory actually does.",
    blocks: [
      { title: "Automotive and motorcycle", body: "Heated oxygen sensors built as replacements for that OEM connector and harness." },
      { title: "Industrial and NOx", body: "Sensors for continuous duty and emission monitoring. If the number is not in the book, ask." },
      { title: "Before shipment", body: "Function is checked before the part leaves. This page does not claim a certificate we have not put on the quote." },
    ],
  },
  downloads: {
    title: "Downloads",
    lede: "The public catalog is the OEM search on this site. Ask the factory for the printed book. We do not host a file that does not match the live numbers.",
    blocks: [
      { title: "Oxygen sensor catalog", body: "302 parts can already be searched by OEM. For the printed edition, leave an email on the contact page." },
    ],
  },
  contact: {
    title: "Contact",
    lede: "Write the OEM number, quantity, and destination. The factory replies to the inquiry.",
    blocks: [
      { title: "What happens next", body: "The inquiry goes to the factory desk. Sales see the factory code and the OEM you searched. The buyer page does not show the factory code." },
      { title: "Samples", body: "The sample price is $32. Minimum order is on the product page. Bulk price is quoted." },
    ],
  },
  faq: {
    title: "Questions",
    lede: "",
    blocks: [
      { title: "Why is a number missing?", body: "That OEM is not in the printed catalog. You can still ask. A shared beginning is not treated as a hit." },
      { title: "Why do two results appear?", body: "That OEM is printed on two factory codes. The search is not wrong. Check the vehicle before ordering." },
      { title: "Sample and minimum order?", body: "Catalog samples are $32. Bulk minimum is usually 100, as shown on the product page." },
      { title: "Where is the factory code?", body: "Buyers see the OEM. The factory ships by its code, which is on the desk and the order." },
    ],
  },
  privacy: {
    title: "Privacy",
    lede: "An inquiry is used to answer that purchase.",
    blocks: [
      { title: "What is stored", body: "Name, email, company, phone, and the note you wrote. A sample order also stores country and quantity." },
      { title: "What we do not do", body: "We do not sell these contacts. Your inquiry is not published on the site." },
    ],
  },
  terms: {
    title: "Terms",
    lede: "The catalog is for finding a number. The order follows the quote.",
    blocks: [
      { title: "Price", body: "The sample price on the page is $32. Bulk is marked Factory quote. That is not a list price." },
      { title: "Numbers", body: "The OEM number is the cross-reference. A matched number is that sensor. The factory ships by its own code." },
    ],
  },
};

export function companyCopy(lang: Lang) {
  if (lang === "zh") return zh;
  if (lang === "ru") return ru;
  if (lang === "ar") return ar;
  return en;
}

const ru: typeof zh = {
  about: {
    title: "Wenzhou Ruibo Sensing",
    lede: "Завод кислородных датчиков. Покупатель ищет номер OEM. Завод отгружает по своему коду.",
    blocks: [
      { title: "Что делаем", body: "Датчики для автомобилей, мотоциклов, промышленности и NOx. Сейчас в каталоге 302 позиции и 601 номер OEM." },
      { title: "Чего не пишем", body: "Не переносим на сайт чужие годы, мощность и процент своевременности. Срок и сертификаты — в предложении." },
      { title: "Что видит покупатель", body: "На странице номер OEM, который он искал. Код Ruibo остаётся в кабинете завода, в запросе и в заказе образца." },
    ],
  },
  manufacturing: {
    title: "Производство",
    lede: "Датчики делают в Вэньчжоу. На этой странице только то, что завод действительно делает.",
    blocks: [
      { title: "Автомобили и мотоциклы", body: "Нагреваемые кислородные датчики как замена под разъём OEM и жгут." },
      { title: "Промышленность и NOx", body: "Датчики для постоянной работы и контроля выбросов. Если номера нет в каталоге, спросите." },
      { title: "Перед отгрузкой", body: "Перед отправкой проверяют работу. Здесь нет сертификата, которого нет в предложении." },
    ],
  },
  downloads: {
    title: "Загрузки",
    lede: "Открытый каталог — это поиск OEM на сайте. Печатный каталог запрашивайте у завода. Файл, который не совпадает с живыми номерами, мы не выкладываем.",
    blocks: [
      { title: "Каталог кислородных датчиков", body: "302 позиции уже ищутся по OEM. Для печатной версии оставьте почту на странице контактов." },
    ],
  },
  contact: {
    title: "Контакты",
    lede: "Напишите номер OEM, количество и направление. Завод отвечает на запрос.",
    blocks: [
      { title: "Что дальше", body: "Запрос попадает на стол завода. Продажи видят заводской код и OEM, который вы искали. На странице покупателя заводского кода нет." },
      { title: "Образцы", body: "Цена образца 32 доллара. Минимальный заказ — на странице товара. Оптовая цена отдельно." },
    ],
  },
  faq: {
    title: "Вопросы",
    lede: "",
    blocks: [
      { title: "Почему номера нет?", body: "Этого OEM нет в печатном каталоге. Спросить всё равно можно. Общее начало номера не считается совпадением." },
      { title: "Почему два результата?", body: "Этот OEM напечатан на двух заводских кодах. Поиск не ошибся. Перед заказом проверьте автомобиль." },
      { title: "Образец и минимум?", body: "Образцы из каталога стоят 32 доллара. Оптовый минимум обычно 100, как на странице товара." },
      { title: "Где заводской код?", body: "Покупатель видит OEM. Завод отгружает по своему коду, он есть в кабинете и в заказе." },
    ],
  },
  privacy: {
    title: "Конфиденциальность",
    lede: "Запрос используется, чтобы ответить на эту закупку.",
    blocks: [
      { title: "Что сохраняется", body: "Имя, почта, компания, телефон и ваш текст. В заказе образца также страна и количество." },
      { title: "Чего не делаем", body: "Эти контакты не продаём. Ваш запрос на сайте не публикуется." },
    ],
  },
  terms: {
    title: "Условия",
    lede: "Каталог нужен, чтобы найти номер. Заказ идёт по предложению.",
    blocks: [
      { title: "Цена", body: "Цена образца на странице — 32 доллара. Опт помечен как цена завода. Это не прайс." },
      { title: "Номера", body: "Номер OEM — для сверки. Совпавший номер и есть этот датчик. Завод отгружает по своему коду." },
    ],
  },
};

const ar: typeof zh = {
  about: {
    title: "Wenzhou Ruibo Sensing",
    lede: "مصنع حساسات أكسجين. المشتري يبحث برقم OEM. المصنع يشحن حسب رمزه.",
    blocks: [
      { title: "ماذا نصنع", body: "حساسات للسيارات والدراجات والصناعة وأكاسيد النيتروجين. الكتالوج الآن فيه 302 قطعة و601 رقم OEM." },
      { title: "ما لا ندّعيه", body: "لا ننسخ سنوات أو طاقة أو نسبة التزام شركة أخرى على هذا الموقع. المدة والشهادات في عرض السعر." },
      { title: "ماذا يرى المشتري", body: "الصفحة تعرض رقم OEM الذي بحث عنه. رمز Ruibo يبقى في مكتب المصنع والاستفسار وطلب العينة." },
    ],
  },
  manufacturing: {
    title: "التصنيع",
    lede: "الحساسات تُصنع في ونتشو. هذه الصفحة تصف فقط ما يفعله المصنع فعلًا.",
    blocks: [
      { title: "سيارات ودراجات", body: "حساسات أكسجين مسخّنة كبديل لموصل OEM وحزام الأسلاك." },
      { title: "صناعة وNOx", body: "حساسات للعمل المستمر ومراقبة الانبعاث. إذا لم يكن الرقم في الكتالوج، اسأل." },
      { title: "قبل الشحن", body: "تُفحص الوظيفة قبل خروج القطعة. لا ندّعي هنا شهادة غير موجودة في عرض السعر." },
    ],
  },
  downloads: {
    title: "التنزيلات",
    lede: "الكتالوج العام هو بحث OEM على هذا الموقع. اطلب النسخة المطبوعة من المصنع. لا نضع ملفًا لا يطابق الأرقام الحية.",
    blocks: [
      { title: "كتالوج حساسات الأكسجين", body: "302 قطعة يمكن البحث عنها برقم OEM. للنسخة المطبوعة اترك بريدًا في صفحة الاتصال." },
    ],
  },
  contact: {
    title: "اتصل بنا",
    lede: "اكتب رقم OEM والكمية والوجهة. المصنع يرد على الاستفسار.",
    blocks: [
      { title: "ماذا يحدث بعد ذلك", body: "الاستفسار يصل إلى مكتب المصنع. المبيعات ترى رمز المصنع ورقم OEM الذي بحثت عنه. صفحة المشتري لا تعرض رمز المصنع." },
      { title: "العينات", body: "سعر العينة 32 دولارًا. الحد الأدنى في صفحة المنتج. سعر الكمية منفصل." },
    ],
  },
  faq: {
    title: "أسئلة",
    lede: "",
    blocks: [
      { title: "لماذا الرقم غير موجود؟", body: "هذا OEM ليس في الكتالوج المطبوع. يمكنك السؤال. البداية المشتركة لا تُحسب تطابقًا." },
      { title: "لماذا تظهر نتيجتان؟", body: "هذا OEM مطبوع على رمزين للمصنع. البحث ليس خاطئًا. تحقق من السيارة قبل الطلب." },
      { title: "العينة والحد الأدنى؟", body: "عينات الكتالوج بـ 32 دولارًا. حد الكمية عادة 100، كما في صفحة المنتج." },
      { title: "أين رمز المصنع؟", body: "المشتري يرى OEM. المصنع يشحن حسب رمزه، وهو في المكتب والطلب." },
    ],
  },
  privacy: {
    title: "الخصوصية",
    lede: "الاستفسار يُستخدم للرد على هذا الشراء.",
    blocks: [
      { title: "ما الذي يُحفظ", body: "الاسم والبريد والشركة والهاتف والنص الذي كتبته. طلب العينة يحفظ أيضًا الدولة والكمية." },
      { title: "ما لا نفعله", body: "لا نبيع هذه العناوين. استفسارك لا يُنشر على الموقع." },
    ],
  },
  terms: {
    title: "الشروط",
    lede: "الكتالوج للعثور على الرقم. الطلب يتبع عرض السعر.",
    blocks: [
      { title: "السعر", body: "سعر العينة في الصفحة 32 دولارًا. الكمية معلّمة بسعر المصنع. هذا ليس قائمة أسعار." },
      { title: "الأرقام", body: "رقم OEM للمطابقة. الرقم المطابق هو هذا الحساس. المصنع يشحن حسب رمزه." },
    ],
  },
};
