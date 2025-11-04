# Contributing

Contributing changes to `@s-group/react-usercentrics` is almost fully automated through Git branches and GitHub Actions.

1. Create a new Git branch for your change
1. Commit changes to the branch following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification
    - The commit messages you use will determine the type of new version bump that will be created. See the complete list of release types in the [`@semantic-release/commit-analyzer` default configuration](https://github.com/semantic-release/commit-analyzer/blob/master/lib/default-release-rules.js)
    - `feat` commit types will create a _minor_ `0.1.0` bump
    - `fix` and `Revert` commit types will create a _patch_ `0.0.1` bump
    - Writing `BREAKING CHANGE:` as a prefix in the commit message body, or adding an exclamation mark after any commit type (for example `feat!`) will create a _major_ `1.0.0` bump
1. Push your branch to the GitHub origin, and open a new Pull Request
1. GitHub Actions will automatically run checks against your changes
    - You can also see a preview of the upcoming version bump in the checks
1. After the checks have successfully passed, you can merge your Pull Request to the default branch
1. GitHub Actions will automatically create a new version commit, attach a Git tag to it (for example `v3.0.4`), create a GitHub release, and publish the new npm package to the [npmjs.com](https://www.npmjs.com/package/@s-group/react-usercentrics) official registry!
