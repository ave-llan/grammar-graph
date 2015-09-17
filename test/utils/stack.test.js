var test = require('tape')
var Stack = require('../../lib/utils/stack.js')

test('Stack', function (t) {
  var stack = new Stack()
  t.true(stack.isEmpty())
  var sample = [1, 'a', 3, '4', 22, true, null, 0]

  sample.forEach(stack.push)
  t.false(stack.isEmpty())
  var stackClone = stack.clone()
  t.notEqual(stackClone, stack)
  for (var i = 0; i < sample.length; i++) {
    t.equal(stackClone.pop(), stack.pop())
  }
  t.true(stack.isEmpty())
  t.true(stackClone.isEmpty())
  stack.push(1)
  t.true(stackClone.isEmpty())
  t.end()
})
