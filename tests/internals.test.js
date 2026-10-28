import test from 'node:test'
import assert from 'node:assert/strict'
import { toLowerMap, ensureArray, mapOutListeningEvents, isEmpty, isLocked, shouldFireOnEmpty } from '../src/_internals.js'

test('toLowerMap lowercases every entry', () => {
  assert.deepEqual(toLowerMap(['Click', 'KEYUP']), ['click', 'keyup'])
})

test('ensureArray wraps a single value, passes arrays through, and nullish becomes empty', () => {
  assert.deepEqual(ensureArray('keyup'), ['keyup'])
  assert.deepEqual(ensureArray(['keyup', 'click']), ['keyup', 'click'])
  assert.deepEqual(ensureArray(null), [])
  assert.deepEqual(ensureArray(undefined), [])
})

test('mapOutListeningEvents falls back to listenTo when no debounce-events attr is set', () => {
  assert.deepEqual(mapOutListeningEvents({}, 'keyup'), ['keyup'])
  assert.deepEqual(mapOutListeningEvents(undefined, ['keyup', 'click']), ['keyup', 'click'])
})

test('mapOutListeningEvents overrides listenTo with a string debounce-events attr', () => {
  assert.deepEqual(mapOutListeningEvents({ 'debounce-events': 'click' }, 'keyup'), ['click'])
})

test('mapOutListeningEvents overrides listenTo with a comma separated string', () => {
  assert.deepEqual(mapOutListeningEvents({ 'debounce-events': 'click,focusout' }, 'keyup'), ['click', 'focusout'])
})

test('mapOutListeningEvents overrides listenTo with an array debounce-events attr', () => {
  assert.deepEqual(mapOutListeningEvents({ 'debounce-events': ['click', 'focusout'] }, 'keyup'), ['click', 'focusout'])
})

test('isEmpty only treats an exact empty string as empty', () => {
  assert.ok(isEmpty(''))
  assert.ok(!isEmpty(' '))
  assert.ok(!isEmpty('0'))
})

test('isLocked fires on Enter unless lock is set, and unlock overrides lock', () => {
  assert.ok(isLocked('Enter', { lock: false }))
  assert.ok(!isLocked('Enter', { lock: true }))
  assert.ok(isLocked('Enter', { lock: true, unlock: true }))
  assert.ok(!isLocked('a', { lock: false }))
})

test('shouldFireOnEmpty fires whenever the value is empty and fireonempty is enabled', () => {
  assert.ok(shouldFireOnEmpty('', { fireonempty: true }))
  assert.ok(!shouldFireOnEmpty('not empty', { fireonempty: true }), 'value is not actually empty')
  assert.ok(!shouldFireOnEmpty('', { fireonempty: false }), 'fireonempty is disabled')
})
