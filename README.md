
# 🔁 derive-rx

A tiny RxJS helper library to create *reactive derived observables* from one or more source streams. Designed to simplify `combineLatest`, `withLatestFrom`, and `switchMap` patterns while keeping everything **type-safe**, **reactive**, and **readable**.

## 📦 Installation

```bash
npm install derive-rx
# or
yarn add derive-rx
```

## 🚀 Functions

### `deriveFromBoth(...observables, computeFn)`

Creates a derived observable that reacts to **any change** in the source observables. Similar to `combineLatest`, but with a clean compute function.

✅ Supports both spread and array style.

#### Example (spread):
```ts
deriveFromBoth(obs1$, obs2$, (a, b) => a + b);
```

#### Example (array):
```ts
deriveFromBoth([obs1$, obs2$], ([a, b]) => a * b);
```

---

### `deriveFromAWithB(a$, b$, computeFn)`

Emits a derived value **only when `a$` emits**, using the **latest value(s)** from `b$`.

✅ Supports one or multiple `b$` observables.  
🔁 Useful for avoiding unnecessary emissions from B.

#### Example (single B):
```ts
deriveFromAWithB(a$, b$, (a, b) => a + b);
```

#### Example (multiple Bs):
```ts
deriveFromAWithB(a$, [b1$, b2$], (a, b1, b2) => a + b1 - b2);
```

---

### `deriveFromDynamicB(a$, getB$, computeFn)`

Use when `B` is **dynamic based on A** — i.e., `a$` determines which observable(s) to listen to.

🔄 Internally uses `switchMap`.

✅ Supports single or multiple dynamic B observables.

#### Example (single B):
```ts
deriveFromDynamicB(a$, a => fetchB$(a), (a, b) => a + b);
```

#### Example (multiple Bs):
```ts
deriveFromDynamicB(
  a$,
  a => [fetchB1$(a), fetchB2$(a)],
  (a, b1, b2) => a + b1 - b2
);
```

---

## ✅ Type Safety

All functions are fully typed. Your compute function will always get autocompletion for the correct values, with no need to cast or destructure manually.

---

## 🧪 Testing

This library uses [`vitest`](https://vitest.dev) for unit testing.

```bash
npm run test
```

Tests cover all functional cases, including edge cases like hot/cold observables, multiple subscriptions, and delayed emissions.

---

## 🧠 Why Use This?

- Replaces verbose RxJS glue code with clean utilities
- Maintains full reactivity (no imperatives)
- Works well in component libraries, signals, or state systems
- Easy to reason about and test

---

## 📄 License

MIT
```

---

Let me know if you want to include usage with `React`, `Angular`, or in `Signals`/state stores!