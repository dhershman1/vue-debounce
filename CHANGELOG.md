# Change Log

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