import test from 'tape'
import { toLowerMap, ensureArray, mapOutListeningEvents, isEmpty, isLocked, shouldFireOnEmpty } from '../src/_internals.js'

test('toLowerMap lowercases every entry', t => {
  t.same(toLowerMap(['Click', 'KEYUP']), ['click', 'keyup'])
  t.end()
})

test('ensureArray wraps a single value, passes arrays through, and nullish becomes empty', t => {
  t.same(ensureArray('keyup'), ['keyup'])
  t.same(ensureArray(['keyup', 'click']), ['keyup', 'click'])
  t.same(ensureArray(null), [])
  t.same(ensureArray(undefined), [])
  t.end()
})

test('mapOutListeningEvents falls back to listenTo when no debounce-events attr is set', t => {
  t.same(mapOutListeningEvents({}, 'keyup'), ['keyup'])
  t.same(mapOutListeningEvents(undefined, ['keyup', 'click']), ['keyup', 'click'])
  t.end()
})

test('mapOutListeningEvents overrides listenTo with a string debounce-events attr', t => {
  t.same(mapOutListeningEvents({ 'debounce-events': 'click' }, 'keyup'), ['click'])
  t.end()
})

test('mapOutListeningEvents overrides listenTo with a comma separated string', t => {
  t.same(mapOutListeningEvents({ 'debounce-events': 'click,focusout' }, 'keyup'), ['click', 'focusout'])
  t.end()
})

test('mapOutListeningEvents overrides listenTo with an array debounce-events attr', t => {
  t.same(mapOutListeningEvents({ 'debounce-events': ['click', 'focusout'] }, 'keyup'), ['click', 'focusout'])
  t.end()
})

test('isEmpty only treats an exact empty string as empty', t => {
  t.ok(isEmpty(''))
  t.notOk(isEmpty(' '))
  t.notOk(isEmpty('0'))
  t.end()
})

test('isLocked fires on Enter unless lock is set, and unlock overrides lock', t => {
  t.ok(isLocked('Enter', { lock: false }))
  t.notOk(isLocked('Enter', { lock: true }))
  t.ok(isLocked('Enter', { lock: true, unlock: true }))
  t.notOk(isLocked('a', { lock: false }))
  t.end()
})

test('shouldFireOnEmpty only applies to Enter/space on an emptied value', t => {
  t.ok(shouldFireOnEmpty('', 'Enter', { fireonempty: true }))
  t.ok(shouldFireOnEmpty('', ' ', { fireonempty: true }))
  t.notOk(shouldFireOnEmpty('', 'Backspace', { fireonempty: true }), 'clearing via Backspace is not currently covered')
  t.notOk(shouldFireOnEmpty('not empty', 'Enter', { fireonempty: true }))
  t.notOk(shouldFireOnEmpty('', 'Enter', { fireonempty: false }))
  t.end()
})
