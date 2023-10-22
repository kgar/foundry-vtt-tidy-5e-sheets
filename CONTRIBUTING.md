# Contributing to Tidy 5e Sheets

Code and content contributions are accepted. Please feel free to submit issues to the issue tracker or submit merge requests for code/content changes. Approval for such requests involves code and (if necessary) design review by the Maintainer(s) of this repo. Please reach out on the TODO ADD TIDY5E DISCORD SERVER HERE with any questions.

Please ensure there is an open issue about whatever contribution you are submitting. Please also ensure your contribution does not duplicate an existing one.

## Developer Tooling

TODO: Explain developer setup and how to test

### `npm install`

Installs all dependencies needed to run developer tooling scripts.

### etc.

TODO: Explain the rest of the commands and how to use them.

## Issues

Check that your Issue isn't a duplicate (also check the closed issues, as sometimes work which has not been released closes an issue).
Issues which are assigned to a Milestone are considered "Prioritized." This assignment is not permanent and issues might be pushed out of milestones if the milestone is approaching a releaseable state without that work being done.

### Bugs

- Ensure that the bug is reproducible with no other modules active. If the bug only happens when a module is active, report it to the module's author instead. Tidy 5e Sheets provides an API for module developers to utilize.
- Provide hosting details as they might be relevant.
- Provide clear step-by-step reproduction instructions, as well as what you expected to happen during those steps vs what actually happened.

### Feature Requests

Any feature request should be considered from the lens of "Is this in the scope of a sheets module?"

- This is a sheets module with the aim of providing a clean UI and a convenient user experience when running and playing D&D 5e. There are innumerable ways the sheets could be expanded and upgraded, but the central goal is to make sheets that improve the experience for the most users possible without bloating the module with excessive features.
- If the intended feature is more specialized or specific than what one would expect in the core sheets, consider making a module that extends Tidy 5e sheets through the API.
- Any feature addition should begin with a github issue and discussion with the maintainer and community. Surprise PRs with sweeping changes may be rejected.

### Module Compatibility

The goal of module compatibility is for module developers to utilize the Tidy 5e Sheets API to augment the sheets and provide the features they wish. **Tidy 5e Sheets will not automatically work with sheet-augmenting modules which target the default 5e sheets. Tidy 5e Sheets deviates from the HTML structure of the default sheets in a variety of ways and is subject to change over time as the layouts are updated to improve the user experience.**

If there is missing API functionality, the Maintainer(s) of this module will make efforts to provide the missing functionality.

## Content

All Content released with this system must come from the WotC [5e System Reference Document](https://dnd.wizards.com/articles/features/systems-reference-document-srd) (aka SRD).

If there is missing content, please open an issue detailing what is missing.

In general, content contributions will take the shape of fixing typos or bugs in the configuration of the existing items in the included compendia JSON files, which are then compiled into the appropriate db file.

Every PR which contributes content must change both the source JSON file and the db file.

### Translations

Non-English languages are not contained within the core dnd5e system, but instead they are managed by specialized [localization modules](https://foundryvtt.com/packages/tag/translation).

Instead of opening an PR with translation files, create one of these modules (or contribute to an existing one!).

## Code

Here are some guidelines for contributing code to this project.

To contribute code, [fork this project](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and submit a [pull request (PR)](https://docs.github.com/en/get-started/quickstart/contributing-to-projects#making-a-pull-request) against the correct development branch.

### Style

Please attempt to follow code style present throughout the project. An ESLint profile is included to help with maintaining a consistent code style. All warnings presented by the linter should be resolved before an PR is submitted.

- `gulp lint` or `npm run lint` - Run the linter and display any issues found.
- `gulp lint --fix` or `npm run lint:fix` - Automatically fix any code style issues that can be fixed.

### Linked Issues

Before (or alongside) submitting an PR, we ask that you open a feature request issue. This will let us discuss the approach and prioritization of the proposed change.

If you want to work on an existing issue, leave a comment saying you're going to work on the issue so that other contributors know not to duplicate work. Similarly, if you see an issue is assigned to someone, that member of the team has made it known they are working on it.

When you open an PR it is recommended to [link it to an open issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue). Include which issue it resolves by putting something like this in your description:

```text
Closes #32
```

### Priority of Review

Please appreciate that reviewing contributions constitutes a substantial amount of effort and our resources are limited. As a result of this, Pull Requests are reviewed with a priority that roughly follows this:

#### High Priority

- Bug Fix
- Small Features related to issues assigned to the current milestone

#### Medium Priority

- Large Features related to issues assigned to the current milestone
- Small Features which are out of scope for the current milestone

#### Not Prioritized

- Large Features which are out of scope for the current milestone

### Pull Request Review Process

PRs have a few phases:

0. **Prioritization.** If the PR relates to the current milestone, it is assigned to that milestone.
1. **Review from the Maintainer.** kgar has final review and is the only one with merge permission.

#### PR Size

Please understand that large and sprawling PRs are exceptionally difficult to review. As much as possible, break down the work for a large feature into smaller steps. Even if multiple PRs are required for a single Issue, this will make it considerably easier and therefore more likely that your contributions will be reviewed and merged in a timely manner.

## Releases

This repository includes a GitHub Actions configuration which automates the compilation and bundling required for a release when a Tag is pushed or created with the name `release-x.x.x`.

### Prerequisites

If either of these conditions are not met on the commit that tag points at, the workflow will error out and release assets will not be created.

- The `system.json` file's `version` must match the `x.x.x` part of the tag name.
- The `system.json` file's `download` url must match the expected outcome of the release CI artifact. This should simply be changing version numbers in the url to match the release version.

```text
https://github.com/foundryvtt/dnd5e/releases/download/release-1.6.3/dnd5e-1.6.3.zip
                                                     └─ Tag Name ──┘     └─ V ─┘ (version)
```

### Process for Release

`master` is to be kept as the "most recently released" version of the system. All work is done on development branches matching the milestone the work is a part of. Once the work on a milestone is complete, the following steps will create a system release:

0. [ ] Verify the `NEEDS_MIGRATION_VERSION` is correct.
1. [ ] `system.json` `version` and `download` fields are updated on the development branch (e.g. `1.5.x`).
2. [ ] A Tag is created at the tip of the development branch with the format `release-x.x.x`, triggering the CI workflow (which takes ~2 mins to complete).
3. [ ] Development Branch is merged to `master` after the workflow is completed.
4. [ ] The Foundryvtt.com admin listing is updated with the `manifest` url pointing to the `system.json` attached to the workflow-created release.
