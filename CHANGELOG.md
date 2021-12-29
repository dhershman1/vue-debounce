# Change Log

## v3.0.2

### New

- The build will now push out a esm module as well with the other minified versions check the readme on how to use it

### Chores

- Updated dependencies
- Ran Audit on dev deps (and fixed)

### Fixed

- Some documentation mis communications

## v3.0.1

### Improved

- Types for debounce (thanks to [hrobertson](https://github.com/hrobertson))
- Placement of the readme for `getDirective`

## v3.0.0

### BREAKING CHANGES

- Lots of code condencing, shouldn't break anything but just in case
- Changed how debouncing `fireonempty` works. It had a bug so I made it a bit more strict to fix this
  - Please open issues ASAP if this functionality is not working as expected

### New

- Added new `trim` option and modifier, this allows you to trim inputs that come through
  - The value given to your function will **NOT** be the trimmed value, trim is only used for logic to see if things should be ran
- Added `getDirective` function which allows you to create a directive instance at lower levels other than global

### Improved

- Some small code cleanup
- Updated dependencies

## v2.6.0

### New

- Added Vue 3 Compatibility :tada:
  - This involves the backwards compatibility change I brought up in discussions

### Improved

- Dropped `dist/` from the repo
  - This is so it doesnt bog down PRs
  - dist is still available on npm as its built before deploy
  - Your CDN (if using) should _NOT_ be affected

## v2.5.8

### Improved

- Updated all dev dependencies
- Started planning vue 3 compatibility

### Fixed

- Removed david-md badges from readme since it seems to be down for good
- Linting fixes in the test files

## v2.5.7

### Fixed

- Took out Kyanite for compatibility reasons

## v2.5.6

### Fixed

- Restored IE11 support by updating kyanite to its latest version

## v2.5.5

### Improved

- Converted over to `Terser` instead of `uglify`
- Converted over to `babel` instead of `buble`
- Switched over to my library `kyanite` for some of the utility work, removing some excess code

## v2.5.4

### Improved

- Caveats section added [#36](https://github.com/dhershman1/vue-debounce/issues/36)

### Fixed

- Unclear documentation for `modifiers` [#37](https://github.com/dhershman1/vue-debounce/issues/37)

## v2.5.3

### Fixed

- Unclear documentation on using the `debounce` function [#34](https://github.com/dhershman1/vue-debounce/issues/34)

## v2.5.2

### Improved

- Added support for scope inheritance for `debounce` utility function this might address [#28](https://github.com/dhershman1/vue-debounce/issues/28) [ilyasfoo](https://github.com/ilyasfoo)
- Dependencies updated

## v2.5.1

### Fixed

- typescript typing for the return on the debounce function [@bobvandevijver](https://github.com/bobvandevijver)

## v2.5.0

### New

- Added `fireOnEmpty` modifier, which allow you to choose individual inputs you want to have fireOnEmpty
- Added `cancelOnEmpty` modifier which cancels the debounce all together if the input value is empty

### Improved

- Drastic code cleanup

### Fixed

- Bug with `fireOnEmpty` where debounce function would fire twice even when input was empty

## v2.4.0

### New

- Added the `event` Object itself to the function call, it is passed as the 2nd parameter

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
