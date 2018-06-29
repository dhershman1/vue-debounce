import test from 'tape'
import debounce from '../src/debounce'

test('Handles defaults', t => {
  const runner = debounce((val) => {
    t.ok(val)
    t.same(val, 'testing')
    t.end()
  })

  runner('testing')
})

test('Handles sepcific time', t => {
  const runner = debounce((val) => {
    t.ok(val)
    t.same(val, 'testing')
    t.end()
  }, '500ms')

  runner('testing')
})
