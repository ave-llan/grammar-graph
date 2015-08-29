var test = require('tape')
var DecisionGraph = require('../lib/decision-graph.js')

test('new DecisionGraph methods', function (t) {
  var dg = new DecisionGraph()

  t.true(dg instanceof DecisionGraph)
  t.equal(dg.V(), 0)

  dg.addVertex('NounPhrase', false)
  t.equal(dg.V(), 1)
  t.deepEqual(dg.adj('NounPhrase'), [])
  t.true(dg.isTerminal('NounPhrase'))
  t.false(dg.isTypeAND('NounPhrase'))

  dg.addVertex('NP1', true)
  t.equal(dg.V(), 2)
  t.deepEqual(dg.adj('NP1'), [])
  t.true(dg.isTypeAND('NP1'))

  dg.addVertex('NP2')
  t.equal(dg.V(), 3)
  t.deepEqual(dg.adj('NP2'), [])
  t.true(dg.isTypeAND('NP2'))

  dg.addVertex('Noun', false)
  dg.addVertex('RelativeClause')

  var terminals = ['the', 'dog', 'cat', 'bird', 'squirrel']
  terminals.forEach(function (terminal) {
    dg.addVertex(terminal)
  })
  t.equal(dg.V(), 10)

  t.end()
})
