# Contributing

Contributing changes to `@s-group/react-usercentrics` is almost fully automated through Git branches and GitHub Actions.

1. Create a new Git branch for your change
1. Commit changes to the branch following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification
1. Create a [changeset](https://github.com/changesets/changesets) that describes the new version bump (patch/minor/major) and what should be added to the [CHANGELOG.md](./CHANGELOG.md) by running `npm run changeset`
1. Push your branch to the GitHub origin, and open a new Pull Request
1. GitHub Actions will automatically run checks against your changes
    - You can also see a preview of the upcoming version bump in the checks
1. After the checks have successfully passed, you can merge your Pull Request to the default branch
1. GitHub Actions will automatically open a 🦋 Changeset Pull Request
1. Verify the 🦋 Changeset Pull Request and merge it
1. GitHub Actions will automatically create a new version commit, attach a Git tag to it (for example `v3.0.4`), create a GitHub release, and [stage the version](https://docs.npmjs.com/staged-publishing) to the [npmjs.com](https://www.npmjs.com/package/@s-group/react-usercentrics) official registry!
