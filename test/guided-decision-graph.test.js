var test = require('tape')
var DecisionGraph = require('../lib/decision-graph.js')
var GuidedDecisionGraph = require('../lib/guided-decision-graph.js')

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
    dg.addVertexOR(orVertex)
  })

  dg.addEdge('Sentence', ['NounPhrase', 'VerbPhrase'])
  dg.addEdge('NounPhrase', ['_NounPhrase_1', '_NounPhrase_2'])
  dg.addEdge('VerbPhrase', ['Verb', '_VerbPhrase_1'])
  dg.addEdge('_NounPhrase_1', ['the', 'Noun'])
  dg.addEdge('_NounPhrase_2', ['the', 'Noun', 'RelativeClause'])
  dg.addEdge('_VerbPhrase_1', ['Verb', 'NounPhrase'])
  dg.addEdge('RelativeClause', ['that', 'VerbPhrase'])
  dg.addEdge('Noun', ['dog', 'cat', 'squirrel', 'bird'])
  dg.addEdge('Verb', ['befriended', 'loved', 'ate', 'attacked'])

  t.equal(dg.V(), 19)

  var guide = new GuidedDecisionGraph(dg, 'Sentence')
  t.deepEqual(guide.construction(), [])
  t.deepEqual(guide.choices(), ['the'])
  t.throws(function () {guide.pop()}, Error,
    'Should not be able to pop empty construction')

  guide.choose('the')
  t.deepEqual(guide.construction(), ['the'])
  t.deepEqual(guide.choices().sort(), ['dog', 'cat', 'squirrel', 'bird'].sort())

  guide.choose('dog')
  t.deepEqual(guide.construction(), ['the', 'dog'])
  t.deepEqual(guide.choices().sort(),
    ['befriended', 'loved', 'attacked', 'ate', 'that'].sort())

  guide.choose('ate')
  t.deepEqual(guide.construction(), ['the', 'dog', 'ate'])
  t.deepEqual(guide.choices().sort(),
    ['', 'the'].sort())

  t.equal(guide.pop(), 'ate')
  t.deepEqual(guide.construction(), ['the', 'dog'])
  t.deepEqual(guide.choices().sort(),
    ['befriended', 'loved', 'attacked', 'ate', 'that'].sort())

  guide.choose('ate')
  t.deepEqual(guide.construction(), ['the', 'dog', 'ate'])
  t.deepEqual(guide.choices().sort(),
    ['', 'the'].sort())

  guide.choose('the')
  t.deepEqual(guide.construction(), ['the', 'dog', 'ate', 'the'])
  t.deepEqual(guide.choices().sort(),
    ['dog', 'cat', 'squirrel', 'bird'].sort())

  ;'cat that ate the bird that attacked the squirrel'.split(' ').forEach(function (t) {
    guide.choose(t)
  })

  t.equal(guide.construction().join(' '),
    'the dog ate the cat that ate the bird that attacked the squirrel')

  // throws errors when given a terminal which is not a valid next choice
  t.throws(function () {guide.choose('the')}, Error)
  t.throws(function () {guide.choose(' ')}, Error)

  t.equal(guide.pop(), 'squirrel')
  t.equal(guide.pop(), 'the')
  t.deepEqual(guide.choices().sort(),
    ['the', ''].sort())

  guide.choose('')
  t.deepEqual(guide.choices(), [])

  t.end()
})
