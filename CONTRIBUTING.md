# Contributing to Tidy 5e Sheets

Code contributions are accepted. Please feel free to submit issues to the issue tracker or submit pull requests for code changes. Approval for such requests involves code and (if necessary) design review by the Maintainer(s) of this repo. Please reach out on the [Tidy 5e Sheets discord server](https://discord.gg/PS7Xxpnh) with any questions.

Please ensure that there is an open issue about whatever contribution you are submitting. Please also ensure your contribution does not duplicate an existing one.

## Developer Tooling

Tidy 5e Sheets builds a rich UI with [svelte](https://svelte.dev/) and leverages [vite](https://vitejs.dev/) to provide a rapid feedback development experience with hot module replacement (HMR). When set up properly, the developer tooling can live-update the browser when component and SCSS changes occur.

### Prerequisites

- [Node.js LTS version](https://nodejs.org/en)
- (Recommended) A code editor, such as the free [VS Code](https://code.visualstudio.com/)

### Getting Started

1. Download the repo
2. Run `npm install`
3. Run `npm run dev`
4. Create a symlink from the newly-created `dist` folder to the Foundry `modules` folder as `tidy5e-sheet-kgar`
5. Start Foundry VTT

### `npm install`

Installs all dependencies needed to run developer tooling scripts and to build the module.

### `npm run dev`

Runs Tidy 5e Sheets in dev mode with HMR enabled.

> **Important**
> Dev mode runs on `http://localhost:30001`. Dev mode will not run on port `30000`.

### `npm run build`

Builds a production distribution of the module.

### Others

There are other scripts that are used for a variety of tasks outside the scope of contributing code. These scripts are subject to change moreso than those listed above.

## Issues

Check that your Issue isn't a duplicate (also check the closed issues, as sometimes work which has not been released closes an issue).

### Bugs

> Use the "Bug report" template.

- Ensure that the bug is reproducible with no other modules active. If the bug only happens when another module is active, see the section on [Module Compatibility](#module-compatibility).
- Provide clear step-by-step reproduction instructions, as well as what you expected to happen during those steps vs what actually happened.

### Feature Requests

> Use the "Feature request" template.

Any feature request should be considered from the lens of "Is this in the scope of a sheets module?"

- This is a sheets module with the aim of providing a clean UI and a convenient user experience when running and playing D&D 5e. There are innumerable ways the sheets could be expanded and upgraded, but the central goal is to make sheets that improve the experience for the most users possible without making the code base unmaintainable or the management of the sheets too complex in the UI.
- If the intended feature is more specialized or specific than what one would expect in the core sheets, consider making a module that extends Tidy 5e sheets through the API.
- Any feature addition should begin with a github issue and discussion with the maintainer and community. Surprise PRs with sweeping changes may be rejected.

### Module Compatibility

> **Important**
> Tidy 5e Sheets will not automatically work with sheet-augmenting modules which target the default 5e sheets. Tidy 5e Sheets deviates from the HTML structure of the default sheets in a variety of ways and is subject to change over time as the layouts are updated and new layouts are created.

Within reason, the Maintainer(s) of this repository can provide changes to improve compatibility, but in many cases, it will be up to the module developer to utilize the provided Tidy 5e Sheets API to augment the sheets in a supported way. If it is deemed beyond the threshold of simple adjustments which make sense for these sheets, report it to the module's author and request they use the API.

### API Needs

> Use the "API Request" template.

If there is missing API functionality, the Maintainer(s) of this module will make efforts to provide the missing functionality in a general way that will work for other module developers as well.

### Translations

PRs are welcome for localization to other languages. Currently, Tidy 5e Sheets keeps all translation files within this repository in the `lang` directory.

## Code

Here are some guidelines for contributing code to this project.

To contribute code, [fork this project](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and submit a [pull request (PR)](https://docs.github.com/en/get-started/quickstart/contributing-to-projects#making-a-pull-request) against the `main` branch.

### Style

The Maintainer(s) of this module intend to support it for as long as possible. As such, we request that code submissions attempt to use a coding style that is similar to what is in the repository. For formatting, we recommend using "prettier," which has extensions in popular code editors. 

The Maintainer(s) reserve the right to refactor code if it helps in maintaining it. This is not to say the Maintainer(s)' style is more correct; it is simply a matter of personal preference, because when the code goes into `main`, we become the caretakers.

### Linked Issues

Before (or alongside) submitting an PR, we ask that you open a feature request issue. This will let the Maintainer(s) discuss the approach and prioritization of the proposed change.

If you want to work on an existing issue, leave a comment saying you're going to work on the issue so that other contributors know not to duplicate work. Similarly, if you see an issue is assigned to someone, that member of the team has made it known they are working on it.

When you open an PR it is recommended to [link it to an open issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue). Include which issue it resolves by putting something like this in your description:

```text
Closes #32
```

### Pull Request Review Process

**Review from the Maintainer(s).** kgar has final review and is the only one with merge permission.

### Process for Release

Tidy 5e Sheets is intended to be able to make numerous small releases, introducing new features and fixing bugs quickly. All changes merged to `main` since the last release are bundled into the release write-up.