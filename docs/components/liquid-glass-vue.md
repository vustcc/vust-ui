# Vue Liquid Glass

`@vustcc/vue` defaults to a Liquid Glass material on applicable surfaces. Shared material defaults live in `@vustcc/tokens` as `--vdl-glass-*`; Vue owns the renderer. React and pre-existing shared background tokens are unchanged.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { VustGlassProvider, VustButton, VustInput } from "@vustcc/vue";
import "@vustcc/tokens/index.css";
import "@vustcc/vue/style.css";

const intensity = ref(1);
const refraction = ref(0.5);
const draft = ref("");
</script>

<template>
  <!-- The consuming app owns settings UI, labels, persistence and storage. -->
  <label>
    Glass intensity
    <input
      v-model.number="intensity"
      type="range"
      min="0"
      max="1"
      step="0.01"
    />
  </label>
  <VustGlassProvider :glass="{ intensity }">
    <VustInput v-model="draft" />
    <VustButton :glass="{ intensity, refraction }">Save</VustButton>
    <VustButton :glass="false">Solid surface</VustButton>
  </VustGlassProvider>
</template>
```

## Public contract

```ts
interface VustGlassOptions {
  intensity?: number;
  refraction?: number;
  blur?: number;
  opacity?: number;
  highlight?: number;
}
type VustGlassValue = boolean | VustGlassOptions;
type VustGlassMode = "refraction" | "blur" | "solid";
```

Applicable components accept `glass?: VustGlassValue`. All numeric values are normalized to 0–1. Finite out-of-range values are clamped; NaN/infinity/invalid values use defaults.

- Omitted: inherit the nearest Provider, otherwise use the component's profile.
- `false`: disable glass and use an opaque material surface. This is not a pixel-for-pixel legacy theme switch.
- `true`: explicitly enable the component's default material.
- Object: replace the inherited configuration for this component. Fields omitted from this object use that component's profile, not the Provider object. Pass `{ ...shared, refraction: 0 }` when a field-level override is wanted.
- `intensity`: interpolates from solid (`0`) to the profile (`1`, default). Explicit independent fields override the interpolation, including at intensity zero.
- `refraction`: edge displacement, up to a 28px SVG displacement scale. The actual offset follows the rounded surface normal.
- `blur`: background blur, 0–20 CSS px.
- `opacity`: material tint opacity; never sets foreground/element opacity. Primary and danger buttons and checked checkboxes retain at least 85% semantic tint for legibility. Data cells retain a solid backing.
- `highlight`: surface sheen and rim reflection, without continuous animation.

Default profiles at intensity `1` (defined in the tokens package and overridable with CSS):

| Profile | Refraction | Blur | Opacity | Highlight |
| ------- | ---------: | ---: | ------: | --------: |
| Control |        0.5 | 0.18 |     0.3 |       0.6 |
| Surface |       0.35 | 0.35 |     0.3 |      0.45 |
| Input   |        0.2 |  0.2 |     0.3 |       0.3 |

`VustGlassProvider` accepts the same `glass` prop and a default slot. It renders a `display: contents` scope element. Nested Providers replace the inherited configuration when supplied, and inherit when omitted. Put the Provider inside the local `[data-theme]` scope; its teleported surfaces follow changes to that theme. A component's own configuration does not propagate into consumer slot content.

## Material areas

| Components                  | Material area                                             |
| --------------------------- | --------------------------------------------------------- |
| Button, Pagination          | Button surface                                            |
| Switch                      | Thumb; track keeps selected-state color                   |
| Tabs                        | Active tab only                                           |
| Menu, SelectionBar          | Navigation/selection container                            |
| Select, ActionMenu          | Trigger and teleported menu                               |
| Tooltip, Toast              | Floating content / each toast                             |
| Alert                       | Banner surface; readable text and semantic accent         |
| Card, Dialog, Modal, Drawer | Shell; content has a restrained backing                   |
| Input                       | Input frame or textarea                                   |
| Checkbox                    | Check surface                                             |
| DateTimeRangePicker         | Trigger and teleported panel                              |
| Table                       | Container, not rows/cells; internal checkboxes stay solid |
| Descriptions                | Grid container, values keep a solid backing               |

Icon, Breadcrumb/BreadcrumbItem, FormItem, Loading, Empty and Tag do not gain a glass prop. Their existing content/status presentation is retained.

## Rendering and accessibility

The background is filtered; text/icons remain ordinary DOM content. A small canvas generates a rounded-rectangle displacement map (maximum dimension 512 pixels), never a screenshot or clone of the application. Each live surface owns its SVG filter; size changes rebuild its map, parameter changes reuse it. Updates coalesce into animation frames; there is no idle animation loop. Unmounting or disabling refraction releases the SVG resources.

Chrome/Edge select SVG background refraction after CSS capability checks. Firefox/WebKit use CSS blur. `[data-glass-mode]` on each material surface reports the selected renderer, not a runtime optical proof; the browser tests separately verify pixels. Browser changes, restrictive content policies, unsupported SVG background filtering or embedded webviews need their own validation. Generated displacement maps use `data:image/png` URLs, which must be allowed by the host's image policy.

Reduced transparency and forced colors select solid surfaces. Reduced motion disables material transitions and press deformation. Consumers can also set `glass=false`. Extreme transparency cannot guarantee text contrast against arbitrary application backgrounds; use the default surface profile for dense content.

The effect approximates iOS 26 visual behavior; it does not reproduce Apple's native compositor or perform automatic backdrop-luminance sampling. WebKit automation is a fallback check, not an iPhone Safari device certification.

## Vue-only development and verification

Open `http://127.0.0.1:4173/?glass` after starting the Vue playground on port 4173. The lab demonstrates global intensity, independent overrides, local solid overrides, theme changes, inputs, Teleport, many instances and teardown. The ordinary component gallery remains available at `/`.

```sh
pnpm check:vue
pnpm exec playwright install firefox webkit
pnpm test:e2e:vue
```

The browser suite uses installed Chrome and Edge plus Playwright Firefox/WebKit. It starts only the Vue playground and excludes React cases. Reports include refraction on/off images, a foreground pixel comparison, theme/narrow screenshots and headless performance measurements. `pnpm check:vue` runs Vue type checking, library build, Vue unit tests and the Vue consuming playground build. It intentionally does not invoke the repository's mixed-framework `check` command.

React migration is a separate task after the Vue API and visual defaults are accepted.
