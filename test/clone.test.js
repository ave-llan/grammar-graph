var test = require('tape')
var clone = require('../lib/utils/clone.js')

test('clone()', function (t) {
  var sample = [1, 'a', 3, '4', 22, true, null, 0]
  t.deepEqual(clone(sample), sample)
  t.notEqual(clone(sample), sample)

  var sample2 = {tree: 'acorn', test: true, state: 42, nothing: null}
  t.deepEqual(clone(sample2), sample2)
  t.notEqual(clone(sample2), sample2)

  t.end()
})
