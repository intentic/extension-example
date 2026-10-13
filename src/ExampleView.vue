<script setup lang="ts">
import { SkeletonSnapshot, vSkeletonSource } from "@intentic/extension-ui";
import { onMounted, watch } from "vue";
import { markSeen } from "./badge";
import { NOTES_PATH } from "./notes";
import { useNotes } from "./useNotes";

/* The rail view. Mounted by the host at /ext/example with `repo` (and any Activation props) bound — this
 * activation is workspace-wide, so it takes none.
 *
 * ON STYLING, which is the one place a git-installed extension differs from a first-party one. The app's
 * Tailwind build scans its own sources and the first-party extension packages; it cannot scan a bundle it
 * doesn't build, so utility classes in a third-party view resolve only by accident — whichever ones the app uses
 * elsewhere. What IS reliably available is everything the design system SHIPS as authored CSS: the `.ui-*`
 * component classes (`.ui-page`, `.ui-card`, `.ui-field`, `.ui-code`), the `.skeleton` class every loading
 * placeholder is painted with, and the role tokens behind them (`--color-card`, `--color-content`,
 * `--color-muted`, `--color-line`), which flip with the light/dark scheme on their own. So this view is built from
 * those, and it recolors with the shell for free.
 *
 * Note also that vite's lib build emits an SFC style block as a SEPARATE css asset, and the loader imports one
 * JS file from a blob URL — nothing fetches that asset. So: style inline, or inject a sheet from activate().
 *
 * ON LOADING: a placeholder in the list's own shape rather than a "Loading…" line, from two pieces of
 * @intentic/extension-ui. `v-skeleton-source="name"` marks the ONE element the placeholder stands in for (here the
 * list, and the empty card that takes its place); once that element has settled, its layout is remembered for this
 * sandbox. The next time the read is in flight, `<SkeletonSnapshot of="name">` draws that layout back: as many cards
 * as there were, each line as long as it was, no words. Its slot, a hand-drawn placeholder, shows only until there
 * is a layout to draw. Prefix the name with your extension's id, since every extension's names share one store. */

const { all, shown, limit, isLoading } = useNotes();

// One list style for the notes and their placeholder, so the two can't drift apart and the page doesn't move when
// the notes land.
const LIST = { marginTop: `1rem`, display: `flex`, flexDirection: `column`, gap: `0.5rem`, listStyle: `none`, padding: 0 } as const;
// The first visit's placeholder: three cards, a bar for the note and a shorter one for its time. Fixed widths, not
// random ones, so it doesn't reshuffle on every render.
const PLACEHOLDER_WIDTHS = [`70%`, `45%`, `60%`];

// Opening the view IS the acknowledgement the badge clears on.
onMounted(() => markSeen(all.value.length));
watch(all, (notes) => markSeen(notes.length));
</script>

<template>
    <div class="ui-page">
        <h1 :style="{ fontSize: `1.25rem`, fontWeight: 600, color: `var(--color-content)` }">Example</h1>
        <p :style="{ color: `var(--color-muted)`, marginTop: `0.25rem` }">
            Notes the agent left with <code class="ui-code">intentic-example add "…"</code>, read from
            <code class="ui-code">{{ NOTES_PATH }}</code> and refreshed by the daemon's file watcher — no polling.
        </p>

        <!-- `.skeleton` is shipped CSS like `.ui-card`, so it paints in a third-party bundle too. aria-busy, not
             aria-hidden: a screen reader should hear "loading", not silence that reads as an empty list. -->
        <SkeletonSnapshot v-if="isLoading" of="example.notes" label="Loading notes">
            <div role="status" aria-busy="true" aria-label="Loading notes" :style="LIST">
                <div v-for="width in PLACEHOLDER_WIDTHS" :key="width" class="ui-card" aria-hidden="true">
                    <span class="skeleton" :style="{ display: `block`, width, height: `1rem` }"></span>
                    <span class="skeleton" :style="{ display: `block`, width: `10rem`, height: `0.75rem`, marginTop: `0.25rem` }"></span>
                </div>
            </div>
        </SkeletonSnapshot>

        <!-- Both answers carry the source, so an empty sandbox remembers an empty card rather than three notes. Never
             the placeholder itself: it would remember its own bars. -->
        <div v-else-if="shown.length === 0" v-skeleton-source="`example.notes`" class="ui-card ui-card-dashed" :style="{ marginTop: `1rem` }">
            <p :style="{ color: `var(--color-muted)` }">
                No notes yet. Ask the agent to <em>leave an example note</em>, or run <code class="ui-code">intentic-example add "hello"</code> in a
                terminal.
            </p>
        </div>

        <ul v-else v-skeleton-source="`example.notes`" :style="LIST">
            <li v-for="note in shown" :key="note.at" class="ui-card">
                <div :style="{ color: `var(--color-content)` }">{{ note.text }}</div>
                <div :style="{ color: `var(--color-muted)`, fontSize: `0.75rem`, marginTop: `0.25rem` }">{{ note.at }}</div>
            </li>
        </ul>

        <p v-if="all.length > limit" :style="{ color: `var(--color-muted)`, fontSize: `0.75rem`, marginTop: `0.75rem` }">
            Showing {{ limit }} of {{ all.length }} — raise <strong>Notes shown</strong> in Settings → Extensions.
        </p>
    </div>
</template>
