import { ref as S, computed as d, defineComponent as k, onMounted as N, watch as E, openBlock as a, createElementBlock as i, createElementVNode as r, createTextVNode as s, toDisplayString as m, unref as l, Fragment as T, renderList as L, createCommentVNode as O } from "vue";
import { useQuery as j } from "@tanstack/vue-query";
let g;
const V = (e) => {
  g = e;
}, y = () => {
  if (g === void 0)
    throw new Error("intentic.example: host() called before activate()");
  return g;
}, x = ".intentic/example-notes.json", z = (e) => typeof e == "object" && e !== null && typeof e.at == "string" && typeof e.text == "string", A = (e) => {
  const t = e?.content;
  return typeof t == "string" ? t : void 0;
}, b = async () => {
  let e;
  try {
    e = A(await y().sandbox.json(`/workspace/file?path=${encodeURIComponent(x)}`));
  } catch {
    return [];
  }
  if (e === void 0)
    return [];
  try {
    const t = JSON.parse(e).notes;
    return Array.isArray(t) ? t.filter(z).toReversed() : [];
  } catch {
    return [];
  }
}, u = S(0);
let w = 0;
const C = 3e4, v = async () => {
  try {
    if (!y().sandbox.reachable())
      return;
    u.value = Math.max(0, (await b()).length - w);
  } catch {
    u.value = 0;
  }
}, M = () => {
  v();
  const e = setInterval(() => {
    v();
  }, C);
  return { dispose: () => clearInterval(e) };
}, P = () => u.value, h = (e) => {
  w = e, u.value = 0;
}, X = (e, t) => {
  V(e), t.subscriptions.push(
    M(),
    e.views.register({
      id: "example",
      label: "Example",
      surface: "rail",
      // Unconditional: the note file is a property of the workspace, not of any repo in it, so there is no
      // per-repo evidence to detect on and one activation is the honest answer. A view that IS about repos
      // filters `repos` here and returns one activation each.
      detect: () => [{ key: "example", title: "Example", icon: "sparkles" }],
      badge: () => {
        const n = P();
        return n > 0 ? { count: n, tone: "info", tooltip: `${n} new note${n === 1 ? "" : "s"}` } : void 0;
      },
      view: async () => (await Promise.resolve().then(() => U)).default
    }),
    e.commands.register("example.reload", () => e.navigate("/ext/example"))
  );
}, q = () => {
  const e = y(), t = j({
    queryKey: e.sandbox.key("example-notes"),
    queryFn: b,
    enabled: d(() => e.sandbox.reachable())
  }), n = d(() => Number(e.settings.get("limit") ?? 5)), c = d(() => t.data.value ?? []);
  return {
    all: c,
    shown: d(() => c.value.slice(0, n.value)),
    limit: n,
    isLoading: d(() => t.isLoading.value),
    refetch: t.refetch
  };
}, B = { class: "ui-page" }, I = { style: { color: "var(--color-muted)", marginTop: "0.25rem" } }, $ = { class: "ui-code" }, D = {
  key: 0,
  style: { color: "var(--color-muted)", marginTop: "1rem" }
}, F = {
  key: 1,
  class: "ui-card ui-card-dashed",
  style: { marginTop: "1rem" }
}, H = {
  key: 2,
  style: { marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", listStyle: "none", padding: 0 }
}, R = { style: { color: "var(--color-content)" } }, J = { style: { color: "var(--color-muted)", fontSize: "0.75rem", marginTop: "0.25rem" } }, K = {
  key: 3,
  style: { color: "var(--color-muted)", fontSize: "0.75rem", marginTop: "0.75rem" }
}, Q = /* @__PURE__ */ k({
  __name: "ExampleView",
  setup(e) {
    const { all: t, shown: n, limit: c, isLoading: _ } = q();
    return N(() => h(t.value.length)), E(t, (f) => h(f.length)), (f, o) => (a(), i("div", B, [
      o[7] || (o[7] = r("h1", { style: { fontSize: "1.25rem", fontWeight: 600, color: "var(--color-content)" } }, "Example", -1)),
      r("p", I, [
        o[0] || (o[0] = s(" Notes the agent left with ", -1)),
        o[1] || (o[1] = r("code", { class: "ui-code" }, 'intentic-example add "…"', -1)),
        o[2] || (o[2] = s(", read from ", -1)),
        r("code", $, m(l(x)), 1),
        o[3] || (o[3] = s(" and refreshed by the daemon's file watcher — no polling. ", -1))
      ]),
      l(_) ? (a(), i("div", D, "Loading…")) : l(n).length === 0 ? (a(), i("div", F, [...o[4] || (o[4] = [
        r("p", { style: { color: "var(--color-muted)" } }, [
          s(" No notes yet. Ask the agent to "),
          r("em", null, "leave an example note"),
          s(", or run "),
          r("code", { class: "ui-code" }, 'intentic-example add "hello"'),
          s(" in a terminal. ")
        ], -1)
      ])])) : (a(), i("ul", H, [
        (a(!0), i(T, null, L(l(n), (p) => (a(), i("li", {
          key: p.at,
          class: "ui-card"
        }, [
          r("div", R, m(p.text), 1),
          r("div", J, m(p.at), 1)
        ]))), 128))
      ])),
      l(t).length > l(c) ? (a(), i("p", K, [
        s(" Showing " + m(l(c)) + " of " + m(l(t).length) + " — raise ", 1),
        o[5] || (o[5] = r("strong", null, "Notes shown", -1)),
        o[6] || (o[6] = s(" in Settings → Extensions. ", -1))
      ])) : O("", !0)
    ]));
  }
}), U = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Q
}, Symbol.toStringTag, { value: "Module" }));
export {
  X as activate
};
