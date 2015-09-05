var test = require('tape')
var GrammarGraph = require('../lib/grammar-graph.js')
var GuidedDecisionGraph = require('../lib/guided-decision-graph.js')

test('GrammarGraph', function (t) {
  var g = {
    Sentence: ['NounPhrase VerbPhrase'],
    NounPhrase: ['the Noun', 'the Noun RelativeClause'],
    VerbPhrase: ['Verb', 'Verb NounPhrase'],
    RelativeClause: ['that VerbPhrase'],
    Noun: ['dog', 'cat', 'bird', 'squirrel'],
    Verb: ['befriended', 'loved', 'ate', 'attacked']
  }

  var graph = new GrammarGraph(g)
  t.deepEqual(graph.vertices(),
    [ 'Sentence', 'NounPhrase', 'VerbPhrase', 'RelativeClause', 'Noun',
      'Verb', '_NounPhrase_1', '_NounPhrase_2', '_VerbPhrase_1', 'that',
      'dog', 'cat', 'bird', 'squirrel', 'befriended', 'loved', 'ate',
      'attacked', 'the' ])

  t.true(graph instanceof GrammarGraph)

  var guide = graph.guide('NounPhrase')
  t.true(guide instanceof GuidedDecisionGraph)

  t.end()

})
