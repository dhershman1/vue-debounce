# vue-debounce

[![npm](https://img.shields.io/npm/v/vue-debounce.svg?style=flat-square)](https://www.npmjs.com/package/vue-debounce)
[![Downloads](https://img.shields.io/npm/dm/vue-debounce.svg?style=flat-square)](https://www.npmjs.com/package/vue-debounce)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/dhershman1/vue-debounce.svg?style=flat-square&logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/dhershman1/vue-debounce/context:javascript)

A simple to use directive for debounce solutions

It attaches itself to an event for actions

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Content

- [Features](#features)
- [Installation](#installation)
- [Modifiers](#modifiers)
- [Options](#options)
- [Option Defaults](#option-defaults)
- [getDirective Usage](#getdirective-usage)
- [Usage](#usage)
- [Modifier Usage](#modifier-usage)
- [Overwriting Events](#overwriting-events)
- [Use Just Debounce](#using-just-debounce)
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

As of `v3.0.2` CDN support is fixed to work with ESM projects. If you need to use the esm setup simply import them like so:

```js
import debounce from 'https://unpkg.com/vue-debounce@3.0.2/dist/debounce.min.mjs';

// Or all of vue-debounce

import vueDebounce from 'https://unpkg.com/vue-debounce@3.0.2/dist/vue-debounce.min.mjs';
```

## getDirective Usage

As of v3.0.0 a new function called `getDirective` is now exported, this allows you to import a function that lets you create the debounce directive at any level in your app instead of just globally.

### Arguments

This function takes in 2 arguments, they are:

- `version` : `String` - This is the version of vue you're using, simply put `'2'` or `'3'` here
  - Version automatically defaults to version 2
  - This is so that backwards compatibility can still be supported, since I don't have access to the Vue context when you don't install globally
- `opts` : `Object` - This is the options object, use it the same way you would use it if using vue-debounce globally

```js
import { getDirective } from 'vue-debounce'

const component = {
  directives: {
    // Please see above for arguments you can pass to this function
    debounce: getDirective()
  }
}

// If you are using vue 3 you MUST tell the function this by passing in the first argument
const component = {
  directives: {
    // Pass in 3 to tell the function you're using vue 3, I'm going to work on improving this in the future
    debounce: getDirective(3)
  }
}
```

## Usage

First make sure we tell vue to use it

```js
import Vue from 'vue'
import vueDebounce from 'vue-debounce'

Vue.use(vueDebounce)

// Or if you want to pass in the lock option
Vue.use(vueDebounce, {
  lock: true
})

// Setting a different event to listen to
Vue.use(vueDebounce, {
  listenTo: 'input'
})

// Listening to multiple events
Vue.use(vueDebounce, {
  listenTo: ['input', 'keyup']
})

// Setting a default timer This is set to '300ms' if not specified
Vue.use(vueDebounce, {
  defaultTime: '700ms'
})
```

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

There is a caveat explained in issue [#36](https://github.com/dhershman1/vue-debounce/issues/36) which states you're unable to intercept manually triggered events automatically and instead have to trigger the debounced function at the catching point.

For example, if you have a custom component that is manually firing an input event back to the parent, you might do something like this:

```vue
<CustomComponent
  v-model="options"
  @input="debouncedSelectUpdate"
/>
```

Where `debounceSelectedUpdate` looks like this:

```js
debounceSelectedUpdate () {
  return debounce(() => {
    // Taken from issue #36 as an example
    this.refreshDefaultSelect()
  }, 300)
}
```


Or have a method that handles it for you and calls debounce etc. If anyone has advice on handling manual vue events automatically please don't hesitate to share!
