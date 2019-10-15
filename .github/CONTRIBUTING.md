# Contributing

I am open to, and grateful for, any contributions made to this project.

Please abide by the linter setup which uses [Standardjs](http://standardjs.com) rules

Please make sure all PRs are pointed at and processed through the main Development branch

## Commit Messages

Please write and use meaningful and helpful commit messages for your contributions and changes.

## Testing

All changes are expected to continue to pass the tests in place.

If you are adding new functionality to the library you are expected to also unit test and create appropriate testing for your additions

To run all tests use `npm t`

If you want to test only your functionality feel free to change the test script to your `.js` file but **please** remember to change it back to `*.js` and re run `npm t` afterwards!

## Documentation

If you are editing or adding functionality please make sure the readme reflects youyr changes accordingly.

## Developing

- Run unit tests with `npm test`
- You can use `npm run watch` to run the rollup watcher for the source code as you use the html file for testing
- Before opening a PR make sure you do `npm run build` to generate new build files

## Releasing

Currently the CHANGELOG is updated manually before each release. You can document your changes here, or I will document them using your provided commit messages.

Releases follow standard [semantic versioning](https://semver.org/).

I will handle publishing to npm for now after your PR is merged in
