var test = require('tape')
var GrammarGraph = require('../lib/grammar-graph.js')
var GuidedDecisionGraph = require('../lib/guided-decision-graph.js')

test('GrammarGraph', function (t) {
  var g = {
    Sentence       : ['NounPhrase VerbPhrase'],
    NounPhrase     : ['the Noun', 'the Noun RelativeClause'],
    VerbPhrase     : ['Verb', 'Verb NounPhrase'],
    RelativeClause : ['that VerbPhrase'],
    Noun           : ['dog', 'cat', 'bird', 'squirrel'],
    Verb           : ['befriended', 'loved', 'ate', 'attacked']
  }

  var graph = new GrammarGraph(g)
  t.deepEqual(graph.vertices(),
    [ 'Sentence', 'NounPhrase', 'VerbPhrase', 'RelativeClause', 'Noun',
      'Verb', '_NounPhrase_1', '_NounPhrase_2', '_VerbPhrase_1', 'that',
      'dog', 'cat', 'bird', 'squirrel', 'befriended', 'loved', 'ate',
      'attacked', 'the' ])

  t.true(graph instanceof GrammarGraph)

  var guide = graph.createGuide('NounPhrase')
  t.true(guide instanceof GuidedDecisionGraph)

  t.deepEqual(graph.adj('bird'), [])
  t.deepEqual(graph.adj('RelativeClause'), ['that', 'VerbPhrase'])

  t.true(graph.isTypeAND('loved'))
  t.false(graph.isTypeAND('NounPhrase'))

  var isNoun = graph.createRecognizer('Noun').isComplete
  t.true(isNoun('cat'))
  t.true(isNoun('bird'))
  t.false(isNoun('attacked'))

  var isSentence = graph.createRecognizer('Sentence').isComplete
  t.true(isSentence('the dog ate'))
  t.false(isSentence('the dog ate the'))
  t.true(isSentence('the dog ate the cat'))

  t.end()
})
