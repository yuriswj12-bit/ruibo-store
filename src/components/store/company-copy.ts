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
  return en;
}
