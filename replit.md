# APEX TRAIL — E-commerce Product Catalog

A production-grade e-commerce product catalog for a premium outdoor gear brand. Users can browse, filter, inspect, wishlist, and add gear to cart across 6 categories and 17 products.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/apex-trail run dev` — run the frontend (dev port assigned via workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite, wouter (routing), TanStack Query, zustand (cart/wishlist), framer-motion, Tailwind CSS v4
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle for server), Vite (frontend)

## Where things live

- `lib/api-spec/openapi.yaml` — Single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle ORM table definitions (products, categories, contact_messages)
- `artifacts/api-server/src/routes/` — Express route handlers (products.ts, categories.ts, catalog.ts)
- `artifacts/apex-trail/src/` — React frontend
  - `lib/store/` — zustand cart + wishlist stores (localStorage-persisted)
  - `pages/` — Home, Products, ProductDetail, Categories, CategoryDetail, About, Contact, Cart, NotFound
  - `components/` — Navbar, Footer, ProductCard, skeleton loaders, etc.

## Architecture decisions

- **OpenAPI-first**: All API contracts defined in `openapi.yaml` before writing any code. Codegen produces typed React Query hooks and Zod validators — no hand-written types that drift from the spec.
- **Cart & wishlist are client-only**: Persisted in localStorage via zustand's `persist` middleware. No server round-trips, real-time badge count sync across all pages.
- **Service seam for backend swap**: ProductService is the generated hook layer — swapping the JSON data source for a real external API requires only changing the base URL, not touching UI components.
- **Express 5 async routes**: All route handlers use async/await with explicit try/catch and user-facing error responses (never silent console errors).
- **React Query for all server state**: Deduplication, background refresh, and skeleton loading states handled automatically.

## Product

- **Home**: Hero, live stats (products, categories, avg rating, new arrivals), featured gear, new arrivals, bestsellers, category highlights
- **Products**: Filterable/searchable grid with category, price range, tags, in-stock filters + sort (newest/price/rating) + load-more pagination
- **Product Detail**: Image gallery, specs table, quantity stepper, add-to-cart, wishlist toggle, related products
- **Categories**: Overview grid with product counts + category-filtered product view
- **Cart**: Full cart with quantity +/-, line totals, grand total, empty state, checkout intent
- **Contact**: Form with client-side validation + server submission via API
- **About**: Brand story page

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec change before touching route or frontend code
- `zustand` must be listed in `artifacts/apex-trail/package.json` — it is not in the workspace catalog
- DB seeding used `ON CONFLICT (slug) DO NOTHING` — safe to re-run
- The `featured` products endpoint filters on `products.featured = true` — set this flag in DB to surface items on homepage

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- DB schema: `lib/db/src/schema/index.ts`
- API contract: `lib/api-spec/openapi.yaml`
- Generated hooks: `lib/api-client-react/src/generated/api.ts`
