export type PillarId = "tina" | "mia" | "marin" | "symptom" | "position" | "oe";
export type MarketId = "waf" | "eaf" | "mena" | "latam" | "us" | "cis";
export type TrackId = "entertain" | "knowledge";

export const tracks = [
  {
    id: "entertain" as const,
    name: "娱乐性 · 出镜",
    job: "停住滑动。固定一张脸、一句口头禅、一个仓库。对标 Tina 的副歌和 Mia 的展会人设。",
    rule: "前 2 秒露脸报名字，第 3 秒零件进画面。不拍跟配件无关的纯颜值。衣服颜色固定，方便算法认人。",
    metric: "看 3 秒留存和评论问价。",
  },
  {
    id: "knowledge" as const,
    name: "知识性 · 传感器科普",
    job: "给修理厂一个能转给学徒的事实。氧传感器只讲位置、故障和 OE，不讲空泛的发动机原理。",
    rule: "同一位出镜。手和零件占画面一半，字幕写结论。一条只讲一个易错点。",
    metric: "看收藏、转发和带着 OE 号来的询盘。",
  },
];

export const lessons = [
  {
    id: "position",
    title: "前氧和后氧不是同一只",
    fact: "Sensor 1 在三元催化前，给 ECU 做燃油修正。Sensor 2 在催化后，只看催化器效率。种子 SKU 是 Corolla 后氧，不能拿去替代前氧。",
  },
  {
    id: "symptom",
    title: "故障灯先分位置",
    fact: "后氧常见 P0136–P0141 这一组。油耗差、怠速不稳更多是前氧。只说 check engine 不说 sensor 1/2，评论区会问错件。",
  },
  {
    id: "oe",
    title: "看旧件号，不看别人的盒子",
    fact: "Bosch 0 258 006 027 对 Toyota 89465-02130、Denso DOX-0109。螺纹 M18×1.5，4 针加热型，扳手 22mm。年款要对 2014–2019 Corolla 1.8。",
  },
];

export const benchmarks = [
  {
    handle: "@auto.parts.store.tina",
    role: "对标",
    name: "Auto parts store TiNa",
    url: "https://www.tiktok.com/@auto.parts.store.tina",
    snapshot: "约 7.6 万粉。单条引擎墙口播常见 58 万–550 万播放。",
    lane: "广州发动机仓。人格 + 库存规模。",
    formula: "15–25 秒原创曲。开口报名字和国别，中段扫库存墙，结尾重复 “find me / choose me”。",
    steal: "固定副歌，不换人设。画面必须是真仓，不要棚拍静物。",
  },
  {
    handle: "@miachinesefactory",
    role: "对标",
    name: "Auto parts Queen Mia",
    url: "https://www.tiktok.com/@miachinesefactory",
    snapshot: "约 36 万粉。展会指南类收藏高，瑞安 / 广交会 / 吉达访谈是主形态。",
    lane: "中国采购助手。全品类代采，不是单 SKU 广告。",
    formula: "问三句：哪里来、做什么件、做了几年。再给名片和 “DM me”。",
    steal: "把买家脸和口音留在画面里。信任来自对话，不来自参数表。",
  },
  {
    handle: "@auto_parts_chinacar",
    role: "参考",
    name: "China car motors",
    url: "https://www.tiktok.com/@auto_parts_chinacar",
    snapshot: "小号，约 1.1k 粉 / 5.6 万赞。规模不是参照，栏目是参照。",
    lane: "发动机、变速箱、中国车型总成。",
    formula: "一只手持件，口播 OE / 车型 / 档位，结尾丢独立站。",
    steal: "一条视频只讲一个总成。算法需要能归类的车道。",
  },
  {
    handle: "@autoparts.marin",
    role: "参考",
    name: "Marin Autoparts",
    url: "https://www.tiktok.com/@autoparts.marin",
    snapshot: "价格锚短片能到 20 万+ 播放。评论区直接问价。",
    lane: "出厂价、无中间商。",
    formula: "前 3 秒喊价。“Factory price, no middleman, $2.” 重复三遍再报身份。",
    steal: "价格写在屏幕上，口播再说一遍。询盘来自评论，不是主页简介。",
  },
] as const;

export const windows = [
  {
    id: "waf" as const,
    market: "西非",
    buyers: "尼日利亚、加纳修理厂 / 进口商",
    local: "18:30–21:30 WAT",
    china: "次日 01:30–04:30",
    lang: "英语，价用 USD",
    note: "定时发，不要真人守夜。封面写 OEM number。",
  },
  {
    id: "eaf" as const,
    market: "东非",
    buyers: "肯尼亚、坦桑、乌干达配件商",
    local: "19:00–22:00 EAT",
    china: "00:00–03:00",
    lang: "英语",
    note: "和中东可以同一条素材，字幕分开。",
  },
  {
    id: "mena" as const,
    market: "中东",
    buyers: "迪拜、利雅得、伊斯坦布尔分销",
    local: "20:00–23:00 当地",
    china: "00:00–04:00",
    lang: "英语口播 + 阿语字幕",
    note: "展会和仓位视频比唱歌更稳。",
  },
  {
    id: "latam" as const,
    market: "拉美",
    buyers: "墨西哥、巴西、哥伦比亚修理厂",
    local: "19:00–22:00",
    china: "次日 06:00–09:00",
    lang: "西语或葡语字幕",
    note: "早班剪完直接排。OE 用 Bosch / Denso 对照号。",
  },
  {
    id: "us" as const,
    market: "北美修理厂",
    buyers: "美国独立修理厂、eBay 卖家",
    local: "18:00–21:00 ET",
    china: "次日 06:00–09:00",
    lang: "英语，必须带 fitment 年款",
    note: "样品价和交期写进字幕，减少空询盘。",
  },
  {
    id: "cis" as const,
    market: "俄语区",
    buyers: "俄罗斯、中亚进口商",
    local: "19:00–22:00 MSK",
    china: "00:00–03:00",
    lang: "俄语字幕，英语口播",
    note: "总成件和发动机仓比传感器更容易停住。",
  },
];

export const pillars: {
  id: PillarId;
  track: TrackId;
  name: string;
  from: string;
  length: string;
  shots: string[];
}[] = [
  {
    id: "tina",
    track: "entertain",
    name: "库存副歌",
    from: "Tina",
    length: "18–24 秒",
    shots: ["出镜报名字", "推轨扫传感器货架", "手里举起这一只", "副歌收在 choose me"],
  },
  {
    id: "mia",
    track: "entertain",
    name: "买家三问",
    from: "Mia",
    length: "35–70 秒",
    shots: ["仓门口出镜", "问国家、问氧传感器还是别的件", "问做了几年", "名片和 WhatsApp"],
  },
  {
    id: "marin",
    track: "entertain",
    name: "价格锚",
    from: "Marin",
    length: "12–16 秒",
    shots: ["出镜喊样品价", "价签贴在传感器上", "重复三遍", "字幕打 MOQ"],
  },
  {
    id: "symptom",
    track: "knowledge",
    name: "故障灯分位置",
    from: "科普",
    length: "20–30 秒",
    shots: ["出镜抛出 check engine", "白板写 sensor 1 / sensor 2", "手持后氧", "字幕给故障码范围"],
  },
  {
    id: "position",
    track: "knowledge",
    name: "前氧后氧",
    from: "科普",
    length: "20–28 秒",
    shots: ["排气管简图指催化前", "指催化后", "这只放在后段", "说装错灯会回来"],
  },
  {
    id: "oe",
    track: "knowledge",
    name: "旧件对号",
    from: "科普",
    length: "22–32 秒",
    shots: ["旧件钢印特写", "对照 Bosch / Toyota / Denso", "螺纹和针脚", "年款再收一次"],
  },
];

export const weekPlan = [
  { day: "周一", pillar: "tina" as const, job: "娱乐。库存副歌，同一张脸，换一排传感器货架。" },
  { day: "周二", pillar: "position" as const, job: "科普。前氧后氧。评论区置顶这只是 downstream。" },
  { day: "周三", pillar: "mia" as const, job: "娱乐。买家三问。没有展会就拍仓库来访。" },
  { day: "周四", pillar: "oe" as const, job: "科普。一条只对一个 OE，字幕写交叉号。" },
  { day: "周五", pillar: "marin" as const, job: "娱乐。样品价喊三遍。箱唛只写国家。" },
  { day: "周六", pillar: "symptom" as const, job: "科普。故障灯。加第二市场字幕再发。" },
  { day: "周日", pillar: "tina" as const, job: "娱乐。质检或打包，副歌不变。不单发颜值。" },
];

export type ScriptProduct = {
  sku: string;
  title: string;
  oe: string;
  fitment: string;
  samplePrice: string;
  moq: number;
};

export function buildScript(input: {
  factoryName: string;
  product: ScriptProduct;
  pillar: PillarId;
  market: MarketId;
  whatsapp?: string;
  domain?: string;
}) {
  const market = windows.find((item) => item.id === input.market) ?? windows[0];
  const { product, factoryName } = input;
  const contact = input.whatsapp ? `WhatsApp ${input.whatsapp}` : input.domain || "the link in bio";

  const spoken: Record<PillarId, string> = {
    tina: `My name is ${factoryName}. I am from China. I have many many oxygen sensors in my factory. This one is ${product.title}. OE ${product.oe}. If you need them, find me. I hope you choose me.`,
    mia: `Where are you from? Do you need oxygen sensors, or another part? How long have you done this business? If you cannot match ${product.sku}, I am your assistant in China. ${contact}.`,
    marin: `Factory price. No middleman. Sample ${product.samplePrice}. MOQ ${product.moq}. OE ${product.oe}. I do auto parts. Message me.`,
    symptom: `Check engine is not enough. Sensor 2, after the catalytic converter, is often P0136 to P0141. Bad fuel economy is usually sensor 1. This downstream sensor is ${product.oe}, fit ${product.fitment}. Sample ${product.samplePrice}.`,
    position: `Sensor 1 is before the cat. It trims fuel. Sensor 2 is after the cat. It watches the catalyst. This SKU is downstream. Do not install it as the upstream sensor. OE ${product.oe}.`,
    oe: `Read the old sensor, not another car's box. ${product.oe}. Four-pin heated, M18 thread. Fit ${product.fitment}. If the number matches, message ${contact}.`,
  };

  const caption = [
    input.pillar === "marin" ? `Factory price ${product.samplePrice}. No middleman.` : product.title,
    input.pillar === "position" ? "Sensor 1 trims fuel. Sensor 2 watches the cat." : "",
    input.pillar === "symptom" ? "Downstream codes are not the same as upstream codes." : "",
    `OE ${product.oe}. Fitment: ${product.fitment}.`,
    `MOQ ${product.moq}. Sample ${product.samplePrice}.`,
    contact,
  ].filter(Boolean).join(" ");

  const knowledge = input.pillar === "symptom" || input.pillar === "position" || input.pillar === "oe";

  return {
    market: market.market,
    postAt: `${market.china}（买家当地 ${market.local}）`,
    lang: market.lang,
    duration: pillars.find((item) => item.id === input.pillar)?.length ?? "20 秒",
    track: knowledge ? "知识性" : "娱乐性",
    spoken: spoken[input.pillar],
    caption,
    hashtags: knowledge
      ? "#o2sensor #oxygensensor #checkengine #catalyticconverter #oem #autoparts #carrepair"
      : "#autoparts #factory #chinesefactory #o2sensor #oem #spareparts",
    cta: `评论区置顶：样品 ${product.samplePrice} · ${contact}`,
  };
}
