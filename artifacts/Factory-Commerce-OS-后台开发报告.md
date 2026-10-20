# Factory Commerce OS 后台开发报告

日期：2026-10-20  
范围：工厂后台（Portal）与总站后台（Super Admin）  
仓库：https://github.com/yuriswj12-bit/factory-commerce-os（私有）  
本地源码：`/workspace/artifacts/my-factory-commerce`

---

## 1. 项目定位

Factory Commerce OS 是面向中国制造业出海的多租户 B2B 分站矩阵。一套 Next.js 代码库按请求 Host 分流到不同工厂的独立分站，后台集中管理。

当前样例租户是「鑫达汽车传感器」（slug `xinda-sensor`，域名 `www.xinda-sensor.com`），种子 SKU 为氧传感器 `OS-B0258006027`。

两条线要分开看：

| 线 | 是什么 | 状态 |
|---|---|---|
| 真实后台 | Next.js + Prisma + PostgreSQL，在本地源码与 GitHub | 代码已写，未配数据库与支付环境，不能当线上系统 |
| 预览演示 | 浏览器里能点的 ERP 风格界面 | 本地状态，不连库，不真实扣款 |

本报告以真实后台为准。

---

## 2. 总体架构

- 单代码库 + Host 分流。中间件根据 Host 解析 Tenant，写入 `x-tenant-id` 等请求头。
- 本地无 Host 命中时，回退到最早的 `active` 租户，方便开发。
- 前台路由组 `(storefront)/[lang]`。无语言前缀时按国家 / Accept-Language 重定向。
- 后台两套：
  - `/portal`：工厂管理员
  - `/super-admin`：总站管理员
- 登录不接 NextAuth / Clerk。用户名 + 密码（scrypt），会话放在 `fc_session` Cookie。
- API 统一用 `getSession()` 校验，不再信任客户端传来的 `x-tenant-id` / `x-role`。

技术栈：Next.js 15、React 19、Prisma 6、PostgreSQL、Redis、Zod。支付依赖 Stripe、PayPal SDK。

---

## 3. 数据模型

Prisma 九张表，约束按约定落地。

| 模型 | 用途 | 关键约束 |
|---|---|---|
| Tenant | 工厂分站主体 | `slug` / `customDomain` 唯一；`settings` JSON（logo、主色、飞书 Webhook 等） |
| User | 账号 | 用户名唯一，密码哈希 |
| TenantMember | 成员与角色 | `(tenantId, userId)` / `(tenantId, email)` 唯一 |
| Product | 产品主表 | `(tenantId, sku)` 唯一；样品价、库存、规格 JSON |
| OeCrossReference | OE 交叉互换 | 入库前必须 `normalizeOeNumber` |
| Fitment | 车型适配 | YMM 只从本租户 Fitment 去重 |
| Inquiry | 询盘 | 状态默认 `new` |
| SampleOrder | 样品订单 | `paymentTxId` 唯一，Webhook 幂等 |
| AnalyticsEvent | 轻量埋点 | 按租户、事件类型、时间索引 |

核心业务规则：

- OE 归一化：去掉所有非字母数字字符并转大写。例：`0 258 006 027` → `0258006027`。检索必须同时约束 `product.tenantId`。
- YMM 级联：只从当前租户 Fitment 去重，不跨租户。
- RFQ / 样品支付：走飞书 interactive 卡片（蓝卡询盘、绿卡样品）。

---

## 4. 权限与登录

角色：`tenant_admin`（工厂）、`super_admin`（总站）。

门禁分两层：

1. 中间件：访问 `/portal` 或 `/super-admin` 时检查 `fc_session`，没有则跳 `/login`。
2. Layout：再校验角色。工厂后台要求 `tenant_admin` 或 `super_admin`；总站只允许 `super_admin`。

API 守卫：

- `requireSession()`：401
- `requireTenantAdmin()`：必须有 `tenantId` 且角色为工厂或总站，否则 403
- `requireSuperAdmin()`：必须是总站，否则 403

演示账号（seed）：

- `xinda`：工厂管理员，对应鑫达租户
- `superadmin`：总站管理员

`/login` 注册时会自动开一个工厂租户。

---

## 5. 后台功能

### 工厂后台 `/portal`

侧栏：看板、产品、询盘、内容、站点。顶部栏 + 用户区。UI 已按跨境电商 ERP 风格升级（侧边栏、KPI、表格、状态徽章、表单网格）。

| 页面 | 能力 |
|---|---|
| 看板 `/portal/dashboard` | 运营概览，近 30 天数据 |
| 产品 `/portal/products` | 列表、行内编辑、上下架；Excel 批量导入产品 + OE |
| 询盘 `/portal/inquiries` | 列表含留言；状态流转 new → contacted → quoted → closed |
| 内容 `/portal/content` | 内容营销窗口。娱乐线与科普线，一周娱乐 4、科普 3 |
| 站点 `/portal/settings` | logo、主色、联系方式、WhatsApp、飞书 Webhook、域名 |

对应 API：

- `GET/POST /api/v1/tenant/products`
- `POST /api/v1/tenant/products/import`
- `GET/PATCH /api/v1/tenant/inquiries`
- `GET/PATCH /api/v1/tenant/settings`

### 总站 `/super-admin`

| 页面 | 能力 |
|---|---|
| 总览 | 平台级入口 |
| 租户 `/super-admin/tenants` | 租户列表与创建 |
| 域名 | 自定义域名绑定（接 Vercel Domains） |
| 大盘 `/super-admin/analytics` | 跨租户概览 |

对应 API：

- `/api/v1/super-admin/tenants`
- `/api/v1/super-admin/domains`

---

## 6. 后台依赖的周边能力

后台不是孤立的。它管理的数据来自前台和支付。

前台 `(storefront)/[lang]`：

- 首页、目录 `/products`、SKU `/products/[sku]`、样品收银 `/checkout/sample`
- OE 搜索、YMM 级联、询盘提交

支付契约：

| 渠道 | 实现要点 |
|---|---|
| Stripe | PaymentIntent + `payment_intent.succeeded` |
| PayPal | create / capture |
| Binance Pay | `v3/order`；出站 HMAC-SHA512；Webhook RSA-SHA256/SHA512（无公钥时回退 HMAC） |
| TRC20 | 静态地址，提交 TxHash 后 `pending_review` |

环境变量名以 `.env.example` 为准：数据库、Redis、飞书、Stripe、PayPal、Binance、TRC20、Vercel Domains、R2。

域名解析：Edge 中间件 + Redis 缓存，未命中时打内部接口查库。

---

## 7. 代码位置与仓库

本地完整源码在 `/workspace/artifacts/my-factory-commerce`，包含：

- 后台页面与组件
- 前台页面与组件
- 全部 API（登录、产品、询盘、设置、支付、YMM、埋点）
- Prisma schema 与 seed
- 中间件、auth、支付、飞书、Excel 导入

GitHub 私有仓库：

https://github.com/yuriswj12-bit/factory-commerce-os

最后更新：2026-10-12。推送的是核心子集，不是本地全量：

- 配置：`package.json`、`next.config.ts`、`tsconfig.json`、`.env.example`
- Prisma：`schema.prisma`、`seed.ts`
- 中间件、`auth.ts`、`auth-guard.ts`、`prisma.ts`、`store-context.ts`、`normalizer.ts`、`inquiry-status.ts`
- 后台 layout：`portal/layout.tsx`、`super-admin/layout.tsx`

未进仓库的包括：后台各页、前台页面、支付 API、Excel 导入、飞书、组件。预览演示也不在这个仓库里。

---

## 8. 进度判断

已完成（代码层）：

- 多租户数据模型与种子
- Host 分流与语言重定向
- 用户名密码登录与角色门禁
- 工厂四页 + 内容页 + 总站页的页面骨架与主要 API
- OE 归一化、YMM 级联、Excel 导入
- 四条支付通道的路由与契约
- ERP 风格后台壳

未完成 / 未验证：

- 数据库、Redis、飞书、支付密钥未配置，支付与通知没有跑通
- 仓库只同步了核心文件，与本地源码不一致
- 真实订单履约、发货、对账没有做
- 多语言内容、域名自动绑定只停在接口层
- 预览是独立演示，不代表后台已上线

结论：后台处于「可继续开发的完整骨架」。页面、权限、模型和 API 都在，但还不能当生产系统用。

---

## 9. 建议下一步

按优先级：

1. 把本地全量源码推到 GitHub，避免仓库与工作区脱节。
2. 配 `DATABASE_URL` 与 Redis，跑通 seed，用 `xinda` / `superadmin` 登录后台。
3. 配飞书 Webhook，验证询盘蓝卡与样品绿卡。
4. 用沙箱密钥跑通 Stripe / PayPal；Binance 与 TRC20 可后置。
5. 补产品图片上传（R2）和域名绑定的真实联调。

---

演示账号仅用于本地 seed，不要用于生产。
