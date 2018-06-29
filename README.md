# vue-debounce
A simple to use directive for debounce solutions

It attaches itself and uses `oninput` to keep track of changes

## Features

- Dynamic debouncing for input based requests
- Easy to use, just slap it into your vue instance and attach it to your inputs/components
- Self regulating no need to worry about it, set it and forget it
- Multiple time formats supported (miliseconds, seconds, and minutes)

## Usage

Usage is fairly straight forward, you'll be passing an object to the directive to use.

This object should contain the function you want called whent he timer finishes, and how long you want it to wait before calling that function.

Example:

```vue
<input v-debounce:300ms="myFunc" type="text" />
```

If no wait timer is passed in, then the directive will default to 300ms.

You can pass the time in multiple formats:

```vue
<!-- If no time format is attached ms is used -->
<input v-debounce:300="myFunc" type="text" />

<!-- Seconds format is supported -->
<input v-debounce:1s="myFunc" type="text" />

<!-- Minutes format is also supported -->
<!-- For what I hope are rare cases? -->
<input v-debounce:1min="myFunc" type="text" />
```
