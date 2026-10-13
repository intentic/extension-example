import { ref as O, computed as m, defineComponent as C, onMounted as j, watch as z, openBlock as l, createElementBlock as i, createElementVNode as n, createTextVNode as a, toDisplayString as u, unref as s, createBlock as A, withCtx as D, Fragment as h, renderList as x, normalizeStyle as I, withDirectives as b, createCommentVNode as P } from "vue";
import { SkeletonSnapshot as V, vSkeletonSource as k } from "@intentic/extension-ui";
import { useQuery as B } from "@tanstack/vue-query";
let y;
const H = (e) => {
  y = e;
}, g = () => {
  if (y === void 0)
    throw new Error("intentic.example: host() called before activate()");
  return y;
}, E = ".intentic/example-notes.json", M = (e) => typeof e == "object" && e !== null && typeof e.at == "string" && typeof e.text == "string", q = (e) => {
  const o = e?.content;
  return typeof o == "string" ? o : void 0;
}, N = async () => {
  let e;
  try {
    e = q(await g().sandbox.json(`/workspace/file?path=${encodeURIComponent(E)}`));
  } catch {
    return [];
  }
  if (e === void 0)
    return [];
  try {
    const o = JSON.parse(e).notes;
    return Array.isArray(o) ? o.filter(M).toReversed() : [];
  } catch {
    return [];
  }
}, p = O(0);
let T = 0;
const R = 3e4, S = async () => {
  try {
    if (!g().sandbox.reachable())
      return;
    p.value = Math.max(0, (await N()).length - T);
  } catch {
    p.value = 0;
  }
}, $ = () => {
  S();
  const e = setInterval(() => {
    S();
  }, R);
  return { dispose: () => clearInterval(e) };
}, F = () => p.value, w = (e) => {
  T = e, p.value = 0;
}, se = (e, o) => {
  H(e), o.subscriptions.push(
    $(),
    e.views.register({
      id: "example",
      label: "Example",
      surface: "rail",
      // Unconditional: the note file is a property of the workspace, not of any repo in it, so there is no
      // per-repo evidence to detect on and one activation is the honest answer. A view that IS about repos
      // filters `repos` here and returns one activation each.
      detect: () => [{ key: "example", title: "Example", icon: "sparkles" }],
      badge: () => {
        const r = F();
        return r > 0 ? { count: r, tone: "info", tooltip: `${r} new note${r === 1 ? "" : "s"}` } : void 0;
      },
      view: async () => (await Promise.resolve().then(() => ee)).default
    }),
    e.commands.register("example.reload", () => e.navigate("/ext/example"))
  );
}, W = () => {
  const e = g(), o = B({
    queryKey: e.sandbox.key("example-notes"),
    queryFn: N,
    enabled: m(() => e.sandbox.reachable())
  }), r = m(() => Number(e.settings.get("limit") ?? 5)), d = m(() => o.data.value ?? []);
  return {
    all: d,
    shown: m(() => d.value.slice(0, r.value)),
    limit: r,
    isLoading: m(() => o.isLoading.value),
    refetch: o.refetch
  };
}, J = { class: "ui-page" }, K = { style: { color: "var(--color-muted)", marginTop: "0.25rem" } }, Q = { class: "ui-code" }, U = {
  key: 1,
  class: "ui-card ui-card-dashed",
  style: { marginTop: "1rem" }
}, G = { style: { color: "var(--color-content)" } }, X = { style: { color: "var(--color-muted)", fontSize: "0.75rem", marginTop: "0.25rem" } }, Y = {
  key: 3,
  style: { color: "var(--color-muted)", fontSize: "0.75rem", marginTop: "0.75rem" }
}, Z = /* @__PURE__ */ C({
  __name: "ExampleView",
  setup(e) {
    const { all: o, shown: r, limit: d, isLoading: _ } = W(), f = { marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", listStyle: "none", padding: 0 }, L = ["70%", "45%", "60%"];
    return j(() => w(o.value.length)), z(o, (v) => w(v.length)), (v, t) => (l(), i("div", J, [
      t[8] || (t[8] = n("h1", { style: { fontSize: "1.25rem", fontWeight: 600, color: "var(--color-content)" } }, "Example", -1)),
      n("p", K, [
        t[0] || (t[0] = a(" Notes the agent left with ", -1)),
        t[1] || (t[1] = n("code", { class: "ui-code" }, 'intentic-example add "…"', -1)),
        t[2] || (t[2] = a(", read from ", -1)),
        n("code", Q, u(s(E)), 1),
        t[3] || (t[3] = a(" and refreshed by the daemon's file watcher — no polling. ", -1))
      ]),
      s(_) ? (l(), A(s(V), {
        key: 0,
        of: "example.notes",
        label: "Loading notes"
      }, {
        default: D(() => [
          n("div", {
            role: "status",
            "aria-busy": "true",
            "aria-label": "Loading notes",
            style: f
          }, [
            (l(), i(h, null, x(L, (c) => n("div", {
              key: c,
              class: "ui-card",
              "aria-hidden": "true"
            }, [
              n("span", {
                class: "skeleton",
                style: I({ display: "block", width: c, height: "1rem" })
              }, null, 4),
              t[4] || (t[4] = n("span", {
                class: "skeleton",
                style: { display: "block", width: "10rem", height: "0.75rem", marginTop: "0.25rem" }
              }, null, -1))
            ])), 64))
          ])
        ]),
        _: 1
      })) : s(r).length === 0 ? b((l(), i("div", U, [...t[5] || (t[5] = [
        n("p", { style: { color: "var(--color-muted)" } }, [
          a(" No notes yet. Ask the agent to "),
          n("em", null, "leave an example note"),
          a(", or run "),
          n("code", { class: "ui-code" }, 'intentic-example add "hello"'),
          a(" in a terminal. ")
        ], -1)
      ])])), [
        [s(k), "example.notes"]
      ]) : b((l(), i("ul", {
        key: 2,
        style: f
      }, [
        (l(!0), i(h, null, x(s(r), (c) => (l(), i("li", {
          key: c.at,
          class: "ui-card"
        }, [
          n("div", G, u(c.text), 1),
          n("div", X, u(c.at), 1)
        ]))), 128))
      ])), [
        [s(k), "example.notes"]
      ]),
      s(o).length > s(d) ? (l(), i("p", Y, [
        a(" Showing " + u(s(d)) + " of " + u(s(o).length) + " — raise ", 1),
        t[6] || (t[6] = n("strong", null, "Notes shown", -1)),
        t[7] || (t[7] = a(" in Settings → Extensions. ", -1))
      ])) : P("", !0)
    ]));
  }
}), ee = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Z
}, Symbol.toStringTag, { value: "Module" }));
export {
  se as activate
};
