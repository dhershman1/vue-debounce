# vue-debounce
A simple to use directive for debounce solutions

It attaches itself and uses `oninput` to keep track of changes

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Features

- Dynamic debouncing for input based requests
- Easy to use, just place it into your vue instance and attach it to your inputs/components
- Self regulating no need to worry about it, set it and forget it
- Multiple time formats supported (miliseconds, seconds, and minutes)

## Usage

First make sure we tell vue to use it

```js
import Vue from 'vue'
import vueDebounce from 'vue-debounce'

Vue.use(vueDebounce)
```

Then attach a time:format to the directive, and set the value to the function you want to call and attach it to your input element

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
