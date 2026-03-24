# Project Structure

```

## preview_react — Feature-Based Architecture

```
preview_react/src/
├── app/
│   ├── App.tsx                  # Root component (useRoutes)
│   ├── providers/               # AppProviders (QueryClient, Router, etc.)
│   └── router/
│       └── routes.tsx           # Centralized route definitions
├── features/                    # Domain feature modules
│   ├── notices/
│   │   ├── api/                 # TanStack Query hooks (*.queries.ts)
│   │   ├── model/               # types.ts + mock-data.ts
│   │   └── ui/                  # Feature UI components
│   ├── qna/
│   ├── requirements/
│   ├── sbf/                     # Standard Business Framework
│   └── ssf/                     # System Structure Framework
├── pages/                       # Page-level route components (compose features only)
│   ├── notices/
│   ├── qna/
│   ├── requirements/
│   └── ...
└── shared/
    ├── hooks/                   # Shared React hooks (usePageHeader, etc.)
    ├── model/                   # Zustand stores (mdi.store.ts, pageHeader.store.ts)
    ├── ui/
    │   ├── global/              # Primitive UI components (Button, Input, SelectBox, etc.)
    │   ├── service/             # Layout/app-level components (LNB, PageHeader, BpmnViewer, etc.)
    │   ├── popup/               # Shared popup components (ReasonPopup, TermsPopup, etc.)
    │   ├── styles.ts            # Centralized inline style system (listStyles, detailStyles, popupStyles, typography)
    │   └── LayoutRoute.tsx      # Main layout wrapper (LNB + PageHeader + content + PageFooter)
    └── utils/
```

## Key Conventions

- **Feature modules** own their API layer, types, mock data, and UI. Features must only depend on `shared/` — never on other features.
- **Pages** only compose features; they must not know feature internals.
- **API calls** live exclusively in `features/*/api/` or `shared/api/`. No direct fetch/axios in components.
- **All styles are inline `CSSProperties`** — no CSS files, no Tailwind. Use `shared/ui/styles.ts` for common patterns; extend it when a needed style is missing.
- **Named exports only** — `export default` is prohibited for components.
- **Props via `interface`** — all component props must be typed with an interface.
- **State ownership**:
  - Server state → TanStack React Query only
  - UI/client state → Zustand only
  - List filters/pagination/tabs → URL search params only
- **Mock data**: Each feature keeps its own `model/mock-data.ts`. Data is accessed via Query hooks, not imported directly into components.
- **New routes**: When adding a page under `pages/`, register the route in `src/app/router/routes.tsx`.
- **Storybook stories**: Co-located as `*.stories.tsx` next to components. When a component in `shared/ui/global`, `shared/ui/service`, or `shared/ui/popup` is changed, update its story too.
- **MDI tabs**: Pages register their own tab via `useMdiStore.addTab()` in a `useEffect`.
- **Page header**: Pages set breadcrumb/title via `usePageHeader()` hook — never render `PageHeader` or `PageFooter` directly.
