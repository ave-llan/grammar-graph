var test = require('tape')
var DecisionGraph = require('../lib/decision-graph.js')

test('DecisionGraph methods', function (t) {
  var dg = new DecisionGraph()

  t.true(dg instanceof DecisionGraph)
  t.equal(dg.V(), 0)

  dg.addVertexAND('Sentence')
  t.equal(dg.V(), 1)
  t.deepEqual(dg.adj('Sentence'), [])
  t.true(dg.isTerminal('Sentence'))
  t.true(dg.isTypeAND('Sentence'))

  dg.addVertexOR('NounPhrase')
  t.equal(dg.V(), 2)
  t.deepEqual(dg.adj('NounPhrase'), [])
  t.true(dg.isTerminal('Sentence'))
  t.false(dg.isTypeAND('NounPhrase'))

  var ANDs = ['Sentence', '_NounPhrase1', '_NounPhrase2', '_VerbPhrase1',
              'RelativeClause', 'the', 'that', 'dog', 'cat', 'bird', 'squirrel',
              'befriended', 'loved', 'ate', 'attacked']
  ANDs.forEach(function (andVertex) {
    dg.addVertexAND(andVertex)
  })
  t.equal(dg.V(), 17)

  var ORs = ['VerbPhrase', 'Noun', 'Verb']
  ORs.forEach(function (orVertex) {
    dg.addVertexAND(orVertex)
  })
  t.equal(dg.V(), 20)

  dg.addEdge('Sentence', ['NounPhrase', 'VerbPhrase'], 'add edges as array')
  t.deepEqual(dg.adj('Sentence'), ['NounPhrase', 'VerbPhrase'])
  t.false(dg.isTerminal('Sentence'))

  dg.addEdge('NounPhrase', '_NounPhrase1')
  t.deepEqual(dg.adj('NounPhrase'), ['_NounPhrase1'])
  t.false(dg.isTerminal('NounPhrase'))

  dg.addEdge('NounPhrase', '_NounPhrase2')
  t.deepEqual(dg.adj('NounPhrase'), ['_NounPhrase1', '_NounPhrase2'],
    'add edges one by one as string')
  t.false(dg.isTerminal('NounPhrase'))

  dg.addEdge('VerbPhrase', ['Verb', '_VerbPhrase1'])
  t.deepEqual(dg.adj('VerbPhrase'), ['Verb', '_VerbPhrase1'])

  dg.addEdge('_NounPhrase1', ['the', 'Noun'])
  dg.addEdge('_NounPhrase2', ['the', 'Noun', 'RelativeClause'])
  dg.addEdge('_VerbPhrase1', ['Verb', 'Nounphrase'])
  dg.addEdge('RelativeClause', ['that', 'Verbphrase'])
  dg.addEdge('Noun', ['dog', 'cat', 'squirrel', 'bird'])
  dg.addEdge('Verb', ['befriended', 'loved', 'ate', 'attacked'])

  t.equal(dg.V(), 20)
  t.true(dg.isTerminal('that'))

  t.end()
})
