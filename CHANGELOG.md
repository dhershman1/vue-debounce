# Change Log

## v2.3.0

### New

- Added a new `fireOnEmpty` option that you can enable to fire the debounce function immediately if the input is empty

## v2.2.1

### Fixed

- Added Typescript section to the table of contents
- Fixed author data to have my email

## v2.2.0

### New

- Added Typescript Support thanks to @itmayziii

## v2.1.0

### New

- Added instructions on how to just use the debounce api
- Added ability to send the debounce function just a number and it will get treated as miliseconds

## v2.0.0

### BREAKING CHANGES

- Now using the `addEventListener` method attached to the given el to properly set the event rather than overriding the native callback

## v1.3.0

- Added ability to set default timeout within the options of the plugin

## v1.2.0

- Added ability to send an array of events to have the elments listen to
- Removed deprecated `keyCode` in favor of just `key`
- `listenTo` is no longer case sensitive
- Added ability to listen for the `debounce-events` attribute

## v1.1.0

- Tweaked the Syntax of the debounce function
- Added additional tests
- Updated dependencies
- Added ability to set the event to listen to in options

## v1.0.0

- Some small tweaks to code nothing breaking
- Removed the long deleted `min` from the regex check
- Removed unused code
- Mainly to just get it to v1.0.0 no breaking changes added

## v0.2.0

- Slight Tweaks to optimization
- Removed unused data pieces
- Switched the event to `keyup` instead of `input` for key events
- Added some options and modifiers support (See next tick)
- Pressing enter on a debounced input now automatically fires the desired function
  - You can disable this by using the `.lock` modifier on the directive
  - You can also disable it by passing `lock` to the directive as an option, however this will disable it for _ALL_ debounced inputs
  - If you are using the lock option and want to make an exception for an input you can use the `.unlock` modifier to do so
- Removed support for minutes

## v0.1.2

- Replaced `null` type with a `false` Boolean
- Removed empty config object
- Added `Vue` as a peer dependency
- Removed `Vue` as a dev dependency
- Created the changelog md

## v0.1.1

- Fixed the Build files

## v0.1.0

- Initial Release
