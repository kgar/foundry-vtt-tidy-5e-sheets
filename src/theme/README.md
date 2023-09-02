## Tidy 5e Theming

Tidy 5e is designed so that all colors, fonts, font sizes, box shadows, and many other aspects are configurable via CSS variables.

### It Uses a Replaceable Style Tag

At the time of this writing, the variables are driven by a `<style>` element in the `<head>` of the page which is ID'd for Tidy 5e use. This style element contains a `:root` style rule which applies the CSS variables to the HTML element, thereby providing the entire site with Tidy 5e's current theme.

Upon page initialization, after settings are loaded, the current theme is applied to the DOM in this ID'd style tag. Then, whenever the theme is changed in settings, the existing style tag is removed, and a new one is created with the updated variables and their values.

The reason the style tag is replaced in its entirety is two-fold:

- Reduce clutter
  - Setting variables directly on the HTML element creates a visual mess and would crowd the DOM in confusing ways for the non-Tidy-5e developer or devtools viewer
  - Appending new style tags upon each theme change is unnecessary and feels wasteful
- Allow for optional variables
  - e.g., at the time of this writing, the default dark theme uses a sheet background, whereas the default light theme does not; so, replacing the style in its entirety ensures that optional variables are left out when a theme does not use them, all while not requiring the code to go looking for the unused fields to micro-manage them

### How To - Add a Variable

Adding a variable is a two-step process:

1. Add the variable to the `themeVariables` object in the `theme-reference` file;
   - these keys have a value type of `{ group: string, type: string }`. Look at how the others are set up to determine how you wish yours to be grouped and typed for theme editing (note: this is a future feature). These fields may not be fully implement yet, so look at the others and decide appropriately
2. Add the variable and its value to your theme, in the `variables` object

> **⚠ Warning**:  
> Text must be CSS compliant. If your variable name or variable value would not work in a regular `style` tag or CSS stylesheet, then it will not work in the theme-builder.
>
> New CSS variables must exist in the `themeVariables` object in `theme-reference` in order to be applied to a theme.
