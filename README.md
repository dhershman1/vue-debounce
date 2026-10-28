# vue-debounce

[![npm](https://img.shields.io/npm/v/vue-debounce.svg?style=flat-square)](https://www.npmjs.com/package/vue-debounce)
[![Downloads](https://img.shields.io/npm/dm/vue-debounce.svg?style=flat-square)](https://www.npmjs.com/package/vue-debounce)

A simple to use directive for debounce solutions

It attaches itself to an event for actions

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Important

This package is Vue 3 only as of v5.0.0. If you're on Vue 2, use [vue2-debounce](https://github.com/dhershman1/vue2-debounce) instead - Vue 2 support here is deprecated.

## Content

- [Features](#features)
- [Installation](#installation)
- [Modifiers](#modifiers)
- [Options](#options)
- [Option Defaults](#option-defaults)
- [CDN Support](#cdn-support)
- [Setup](#setup)
- [Using Just Debounce](#using-just-debounce)
- [Using The Composable](#using-the-composable)
- [Usage](#usage)
- [Modifier Usage](#modifier-usage)
- [Overwriting Events](#overwriting-events)
- [Typescript Support](#typescript-support)
- [Testing](#testing)
- [Caveats](#caveats)

## Features

- Dynamic debouncing for input based requests
- Easy to use, just place it into your vue instance and attach it to your inputs/components
- Self regulating no need to worry about it, set it and forget it
- Multiple time formats supported (milliseconds and seconds)
- Enter key support to automatically fire the desired function when the user hits the enter key in the desired input (Can also be disabled)
- Supports the ability to have multiple event listeners, and specify events at the element level
- Reacts to changed bindings on re-render: a new bound function, time, or `debounce-events` takes effect instead of staying frozen to whatever was there at mount time
- A `useDebounce` composable for the Composition API, which cancels any pending call automatically on unmount

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
- `cancelOnEmpty` : `Boolean` - This works the same way as the modifier does, however using the option will cancel the debounce for _ALL_ debounced inputs within that vue instance when they're emptied, where as using the modifier only cancels the one it's attached to
- `trim` : `Boolean` - Tells debounce to trim out white space using the `String.prototype.trim()` function

## Option Defaults

```js
{
  lock: false,
  listenTo: 'keyup',
  defaultTime: '300ms',
  fireOnEmpty: false,
  cancelOnEmpty: false,
  trim: false
}
```

## CDN Support

You can use vue debounce via CDN like so: (It is recommended that you don't use `@latest` however)

```html
<script src="https://unpkg.com/vue-debounce@latest/dist/vue-debounce.min.js"></script>
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
debounce(val => console.log('just a number!', val), 400)(10) // => 'just a number!' 10
```

Note that `debounce` doesn't bind a `this` context to the function you pass it, however if you need one, bind it yourself before passing the function in:

```js
const dFn = debounce(myMethod.bind(this), '300ms')
```

## Using The Composable

If you're in the Composition API and want to debounce a function without the directive, `useDebounce` works just like `debounce`, but also cancels any pending call automatically when the component that created it unmounts:

```js
import { useDebounce } from 'vue-debounce'

export default {
  setup () {
    const search = useDebounce(val => fetchResults(val), '300ms')

    return { search }
  }
}
```

The same rule as `debounce` applies, call it once (in `setup()`) and reuse the function it returns. Avoid calling `useDebounce` fresh on every event, as this creates a fresh, unrelated debounce each time instead of collapsing calls.

`useDebounce` has to be called during `setup()` (or a composable called from it) since it relies on Vue's `onUnmounted` hook, which only works within an active component.

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

The value of the input is passed along to your function as the first parameter, and the 2nd parameter is the event object itself. If the bound element has no `.value` (a button, a div, anything you're debouncing via `debounce-events` rather than an input) the event itself is passed as the first parameter instead, so callbacks get the raw event like `vue-router`'s `navigate`

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
<!-- This can accept an array or a single string when using the bind `:` syntax -->
<input v-debounce:1s="myFunc" :debounce-events="['click', 'keydown']">
<input v-debounce:1s="myFunc" :debounce-events="'click'">

<!-- You can also just use it as an attribute, though if passing multiple events binding it is preferred -->
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
While this project is not written in typescript, we do define types in the `types` directory. These are typed against Vue 3's own directive types (`ObjectDirective`/`DirectiveBinding`), so the options, the bound callback, and the known modifiers (`lock`, `unlock`, `fireonempty`, `cancelonempty`, `trim`) are all typed, not just `any`.

i.e.

```typescript
import { createApp } from 'vue'
import vueDebounce, { PluginConfig, debounce } from 'vue-debounce'
import App from './App.vue'

debounce(() => console.log('just a number!'), 400)
debounce(() => console.log('normal format'), '400ms')

const options: PluginConfig = { lock: true, defaultTime: '400ms', listenTo: 'keyup' }

createApp(App)
  .directive('debounce', vueDebounce(options))
  .mount('#app')
```

## Testing

Since the directive relies on real timers, the simplest way to test a component that uses it is to stub it out with a version that calls your function immediately instead of waiting:

```js
const debounceStub = {
  created (el, binding) {
    el.addEventListener('input', (event) => {
      binding.value(event.target.value, event)
    })
  }
}
```

Then swap it in via `@vue/test-utils`'s `global.directives` when mounting:

```js
import { mount } from '@vue/test-utils'

mount(MyComponent, {
  global: {
    directives: {
      debounce: debounceStub
    }
  }
})
```

Your component fires on input immediately instead of waiting, so you can assert against it synchronously.

## Caveats

If a library you are using such as `Vuetify` is already using a specified event, it will block vue debounce from being able to listen to that event.

As of `v3.1.0` I have significantly improved compatability with these kinds of libraries, however this problem still remains.

For example, Vuetify makes pretty heavy use of the `onblur` event for a lot of it's styles/animatons, so I'd recommend telling vue-debounce to listen for `focusout` instead, if you want debounce to trigger on a blur like event.

I will keep doing research into a better way to solve this little issue, but for now the improved compatability should help a lot!
