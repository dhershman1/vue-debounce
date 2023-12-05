# vue-debounce

[![npm](https://img.shields.io/npm/v/vue-debounce.svg?style=flat-square)](https://www.npmjs.com/package/vue-debounce)
[![Downloads](https://img.shields.io/npm/dm/vue-debounce.svg?style=flat-square)](https://www.npmjs.com/package/vue-debounce)

A simple to use directive for debounce solutions

It attaches itself to an event for actions

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Important

As of now [vue2-debounce](https://github.com/dhershman1/vue2-debounce) is published on npm, if you are using vue2 I highly recommend migrating to this package as this one is going to start focusing on vue3 from v5 onward. Consider vue2 support deprecated for this module.

## Content

- [Features](#features)
- [Installation](#installation)
- [Modifiers](#modifiers)
- [Options](#options)
- [Option Defaults](#option-defaults)
- [CDN Support](#cdn-support)
- [Setup](#setup)
- [Use Just Debounce](#using-just-debounce)
- [Usage](#usage)
- [Modifier Usage](#modifier-usage)
- [Overwriting Events](#overwriting-events)
- [Typescript Support](#typescript-support)
- [Caveats](#caveats)

## Features

- Dynamic debouncing for input based requests
- Easy to use, just place it into your vue instance and attach it to your inputs/components
- Self regulating no need to worry about it, set it and forget it
- Multiple time formats supported (miliseconds and seconds)
- Enter key support to automatically fire the desired function when the user hits the enter key in the desired input (Can also be disabled)
- Supports the ability to have multiple event listeners, and specify events at the element level

## Installation
```
npm i vue-debounce
```

## Modifiers

- `lock` : Used to lock the debounce and prevent the enter key from triggering the function when pressed
  - Example: `v-debounce:400ms.lock="cb"`
- `unlock` : Used to unlock the enter key on a debounced input, useful if you want to use the `lock` option and only want a few debounced inputs unlocked
- `fireonempty` : Use to signify that when that specific input is emptied, you want the function to fire right away
- `cancelonempty` : Use this to specify that when the input is emptied you **DO NOT** want your debounced function to trigger at all
- `trim` : `Boolean` - Tells debounce to trim out white space using the `String.prototype.trim()` function

## Options

- `lock` : `Boolean` - This works the same way as the modifier does, however using the option will lock _ALL_ of the debounced inputs within that vue instance, where as using the modifer only locks the one it's attached to
- `listenTo` : `String|Array` - Allows you to set a custom event attached to an element like `input` for example
  - This is given to the `addEventListener` method attached to the element
- `defaultTime` : `String` - Set the default timer for debounce directives that you don't give a time to
- `fireOnEmpty` : `Boolean` - Tells debounce that if the input is empty, then fire the function immediately
- `trim` : `Boolean` - Tells debounce to trim out white space using the `String.prototype.trim()` function

## Option Defaults

```js
{
  lock: false,
  listenTo: 'keyup',
  defaultTime: '300ms',
  fireOnEmpty: false,
  trim: false
}
```

## CDN Support

You can use vue debounce via CDN like so: (It is recommended that you don't use `@latest` however)

```html
<script src="https://unpkg.com/vue-debounce@latest/dist/vue-debounce.min.js">
<script>
  vueDebounce.vueDebounce({ lock: true })
</script>
```

## Setup

With vue3 we simply need to import the new directive function `vueDebounce` this function takes in an object of options (found above)

Using `vue-debounce` Globally:
```js
import vueDebounce from 'vue-debounce'
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App)
app
  .directive('debounce', vueDebounce({ lock: true }))
  .mount('#app');
```

Using the setup API at the component level:
```vue
<script setup>
import vueDebounce from 'vue-debounce'

const vDebounce = vueDebounce({ lock: true })
</script>
```

Using `vue-debounce` at a component level using the option API:
```js
import vueDebounce from 'vue-debounce'

export default {
  directives: {
    debounce: vueDebounce({ lock: true })
  }
}
```

## Using Just Debounce

With Vue-debounce you're also able to just use the debouncing function.

Simply require the debounce file.

```js
import { debounce } from 'vue-debounce'
```

The `debounce` function returns a function back which in turn is debounced, so you can set them up ahead of time:

```js
const dFn = debounce(val => console.log('normal format', val), '400ms')

dFn(10) // => 'normal format' 10
// Or
debounce(val => console.log('just a number!'), 400)(10) // => 'just a number!' 10
```


## Usage

Then attach a time:format to the directive, and set the value to the function you want to call and attach it to your input element

Example:

```vue
<input v-debounce:300ms="myFunc" type="text" />
```

If no wait timer is passed in, then the directive will default to whatever you set `defaultTime` to, **OR** `300ms` if that isn't set.

You can pass the time in multiple formats:

```vue
<!-- If no time format is attached ms is used -->
<input v-debounce:300="myFunc" type="text" />

<!-- Seconds format is supported -->
<input v-debounce:1s="myFunc" type="text" />
```

The value of the input is passed along to your function as the first parameter, and the 2nd parameter is the event object itself.

## Modifier Usage

Using modifiers works just like normal Vue directives. You can chain them to the timeout value and each other. Some examples include:

> **IMPORTANT NOTE**: Modifiers WILL overwrite options you have set, for example if you set the `fireOnEmpty` option set to true and then tag a input with the `cancelonempty` modifier then the debounced function will cancel when **THAT** input is empty instead of fire.

```vue
<!-- Using Modifiers locking the input so the enter key isn't registered -->
<input v-debounce:1s.lock="myFunc" type="text" />

<!-- Using Modifiers unlocking the input so the enter key is registered -->
<!-- If you've set lock to true as an option when adding this module -->
<input v-debounce:1s.unlock="myFunc" type="text" />

<!-- Using the fireonempty modifier triggers your debounced function when this specific input field is empty -->
<input v-debounce:1s.fireonempty="myFunc" type="text" />

<!-- Using the cancelonempty modifier tells debounce to cancel function execution when the field is empty -->
<input v-debounce:1s.cancelonempty="myFunc" type="text" />
```

## Overwriting Events

As of Version 1.2.0 you can assign specific event listeners to specific inputs. Doing so overwrites **ANY** of the listed events set with `listenTo`

Example:
```vue
// This can accept an array or a single string when using the bind `:` syntax
<input v-debounce:1s="myFunc" :debounce-events="['click', 'keydown']">
<input v-debounce:1s="myFunc" :debounce-events="'click'">

// You can also just use it as an attribute, though if passing multiple events binding it is preferred
<input v-debounce:1s="myfunc" debounce-events="click">
```

A full example:

```vue
<template>
  <input v-debounce:400ms="myFn" type="text" />
  <input v-debounce:400ms="myFn" debounce-events="click" type="text" />
</template>
<script>
export default {
  methods: {
    myFn(val, e) {
      console.log(val) // => The value of the input
      console.log(e) // => The event object
    }
  }
}
</script>
```

## Typescript Support
While this project is not written in typescript, we do define types in the `types` directory. Unfortunately the way Vue is currently typed
the only type support you will get is when you `Vue.use(vueDebounce)`.

i.e.

```typescript
import Vue from 'vue'
import vueDebounce, { PluginConfig, debounce } from 'vue-debounce'

debounce(() => console.log('just a number!'), 400)
debounce(() => console.log('normal format'), '400ms')

Vue.use<PluginConfig>(vueDebounce, { lock: true, defaultTime: '400ms', listenTo: 'keyup' })
```

Hopefully in the future Vue will allow directives to type the modifiers and values that are accepted.

## Caveats

If a library you are using such as `Vueftify` is already using a specified event, it will block vue debounce from being able to listen to that event.

As of `v3.1.0` I have significantly improved compatability with these kinds of libraries, however this problem still remains.

For example, Vuetify makes pretty heavy use of the `onblur` event for a lot of it's styles/animatons, so I'd recommend telling vue-debounce to listen for `focusout` instead, if you want debounce to trigger on a blur like event.

I will keep doing research into a better way to solve this little issue, but for now the improved compatability should help a lot!
