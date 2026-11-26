<script setup lang="ts">
import { SkeletonSnapshot, vSkeletonSource } from "@intentic/extension-ui";
import { onMounted, watch } from "vue";
import { markSeen } from "./badge";
import { NOTES_PATH } from "./notes";
import { useNotes } from "./useNotes";

/* Workspace-wide rail view at /ext/example. Use shipped .ui-* CSS, .skeleton and role tokens: the host cannot scan third-party Tailwind classes.
 * Library-build SFC CSS is a separate asset the blob loader never fetches; style inline or inject a sheet from activate().
 * v-skeleton-source marks the one element remembered per sandbox; SkeletonSnapshot redraws it, using its fallback until a layout is stored.
 * Prefix snapshot names with the extension id because all extensions share the store. */

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
        <p
            v-else-if="shown.length === 0"
            v-skeleton-source="`example.notes`"
            class="ui-card ui-card-dashed"
            :style="{ marginTop: `1rem`, color: `var(--color-muted)` }"
        >
            No notes yet. Ask the agent to <em>leave an example note</em>, or run <code class="ui-code">intentic-example add "hello"</code> in a terminal.
        </p>

        <ul v-else v-skeleton-source="`example.notes`" :style="LIST">
            <li v-for="note in shown" :key="note.at" class="ui-card" :style="{ color: `var(--color-content)` }">
                {{ note.text }}<div :style="{ color: `var(--color-muted)`, fontSize: `0.75rem`, marginTop: `0.25rem` }">{{ note.at }}</div>
            </li>
        </ul>

        <p v-if="all.length > limit" :style="{ color: `var(--color-muted)`, fontSize: `0.75rem`, marginTop: `0.75rem` }">
            Showing {{ limit }} of {{ all.length }} — raise <strong>Notes shown</strong> in Settings → Extensions.
        </p>
    </div>
</template>
