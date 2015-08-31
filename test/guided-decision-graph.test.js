var test = require('tape')
var DecisionGraph = require('../lib/decision-graph.js')
// var GuidedDecisionGraph = require('../lib/guided-decision-graph.js')

test('GuidedDecisionGraph methods', function (t) {
  var dg = new DecisionGraph()

  var ANDs = ['Sentence', '_NounPhrase_1', '_NounPhrase_2', '_VerbPhrase_1',
              'RelativeClause', 'the', 'that', 'dog', 'cat', 'bird', 'squirrel',
              'befriended', 'loved', 'ate', 'attacked']
  var ORs = ['NounPhrase', 'VerbPhrase', 'Noun', 'Verb']

  ANDs.forEach(function (andVertex) {
    dg.addVertexAND(andVertex)
  })

  ORs.forEach(function (orVertex) {
    dg.addVertexAND(orVertex)
  })

  dg.addEdge('Sentence', ['NounPhrase', 'VerbPhrase'])
  dg.addEdge('NounPhrase', ['_NounPhrase_1', '_NounPhrase_2'])
  dg.addEdge('VerbPhrase', ['Verb', '_VerbPhrase_1'])
  dg.addEdge('_NounPhrase_1', ['the', 'Noun'])
  dg.addEdge('_NounPhrase_2', ['the', 'Noun', 'RelativeClause'])
  dg.addEdge('_VerbPhrase_1', ['Verb', 'Nounphrase'])
  dg.addEdge('RelativeClause', ['that', 'Verbphrase'])
  dg.addEdge('Noun', ['dog', 'cat', 'squirrel', 'bird'])
  dg.addEdge('Verb', ['befriended', 'loved', 'ate', 'attacked'])

  t.equal(dg.V(), 19)

  t.end()
})
