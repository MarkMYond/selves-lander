# Frontend Styling Guide

This document outlines conventions for applying consistent styling across Payload blocks in the Nuxt frontend, primarily focusing on background colors and container widths managed via Tailwind CSS.

## Background Colors

Payload blocks can define two background color properties:

1.  `sectionBackgroundColor`: Controls the background of the entire block section.
2.  `contentBackgroundColor`: Controls the background of the main content area within the block (if applicable).

These properties accept specific string values defined in Payload (`payload-cms/src/fields/backgroundColor.ts`). Vue components map these values to Tailwind utility classes using computed properties (e.g., `sectionBgClass`, `contentBgClass`).

### Available Colors & Mapping

| Payload Value  | Tailwind Class   | Notes                                    |
| -------------- | ---------------- | ---------------------------------------- |
| `white`        | `bg-white`       | Standard white                           |
| `light-grey`   | `bg-light-grey`  | Custom color: `#F1F1F1`                  |
| `brand-50`     | `bg-brand-50`    | Custom color: `#F7F3FF` (Brand Purple) |
| `brand-900`    | `bg-brand-900`   | Custom color: `#280772` (Brand Purple) |
| `brand-primary`| `bg-brand-primary`| Custom color: `#3713A2` (Brand Purple) |
| *Default*      | `bg-white`       | Default if no value is provided          |

**Important:** Ensure that any Tailwind class used in these mappings is included in the `safelist` within `frontend/tailwind.config.js` to prevent it from being purged during the build process.

## Container Width

Payload blocks can define a `containerWidth` property to control the maximum width of the main content container.

### Available Widths & Mapping

| Payload Value | Tailwind Class(es) | Notes                                     |
| ------------- | ------------------ | ----------------------------------------- |
| `default`     | *(none)*           | Uses default container padding/max-width  |
| `medium`      | `max-w-5xl`        | Medium width constraint                   |
| `wide`        | `max-w-7xl`        | Wide width constraint (often the default) |
| `full`        | `max-w-none`       | Spans the full viewport width             |
| *Default*     | `max-w-7xl`        | Default if no value is provided           |

Components use a computed property (e.g., `containerClass`) to apply the appropriate `max-w-*` utility class to the container element. Note that `px-*` padding might need adjustment, especially for `full` width.

## Body Text

There are two standard sizes for body text content like descriptions:

### Standard Body Text

-   **Purpose:** Default descriptive text within most blocks (e.g., `SolutionsList` main description, `TextImageSection` description).
-   **Tailwind Classes:** `text-xl leading-8`
-   **Notes:** Use this size for standard descriptive text. Apply color directly (e.g., `text-gray-700`).
-   **Example:**
    ```html
    <p class="text-xl leading-8 text-gray-700">
      Your standard body text goes here...
    </p>
    ```

### Small Body Text

-   **Purpose:** Smaller descriptive text, often used within items or cards (e.g., `SolutionItem` description).
-   **Tailwind Classes:** `text-base leading-relaxed`
-   **Notes:** Use this size for smaller descriptive text within items or cards. Apply color directly (e.g., `text-gray-700`).
-   **Example:**
    ```html
    <p class="text-base leading-relaxed text-gray-700">
      Your small body text goes here...
    </p>
    ```

## Buttons

Standard button styles are applied using utility classes, often within helper functions (like `getButtonClasses`) or directly in the template. The global style uses a large, oval shape.

### Base Classes (Large Oval)

-   `inline-flex items-center justify-center px-7 py-3.5 text-xl font-medium rounded-[68px] shadow-sm transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 max-md:px-6 max-md:py-3 max-md:text-base max-sm:px-5 max-sm:py-3 max-sm:text-sm`

### Primary Button

-   **Purpose:** Main call-to-action.
-   **Tailwind Classes (Combined):** `[Base Classes] border border-transparent text-white bg-brand-primary hover:bg-brand-900`
-   **Key Colors:** `bg-brand-primary`, `text-white`, `hover:bg-brand-900`

### Secondary Button

-   **Purpose:** Alternative or less prominent actions.
-   **Tailwind Classes (Combined):** `[Base Classes] border-[3px] border-brand-primary text-brand-primary bg-white hover:bg-brand-primary hover:text-white`
-   **Key Colors:** `bg-white`, `text-brand-primary`, `border-brand-primary`
-   **Hover State:** `hover:bg-brand-primary`, `hover:text-white`
-   **Note:** Uses a 3px border (`border-[3px]`).

## Cards

Specific components like `TemplateCard` might have unique styling elements.

### Template Card Border

-   **Purpose:** Applied conditionally to `TemplateCard` components via the `hasBorder` prop.
-   **Tailwind Classes:** `border-[3px] border-solid border-brand-primary`
-   **Notes:** This provides a single, 3px border using the primary brand color, similar in style to the `Secondary Button` border.

## Component Implementation Pattern

When updating or creating new block components, follow this pattern:

1.  Use `<script setup lang="ts">`.
2.  Import the specific block type from `payload-cms/src/payload-types`.
3.  Define props using `defineProps<BlockType & { id?: string }>()`. Include `sectionBackgroundColor`, `contentBackgroundColor` (if applicable), and `containerWidth`.
4.  Create computed properties (`sectionBgClass`, `contentBgClass`, `containerClass`) that map the prop values to the corresponding Tailwind classes based on the tables above.
5.  Bind these computed properties in the template using `:class="computedPropertyName"`.
6.  Use the `useMediaUrl` composable for rendering image URLs from Payload media objects.
