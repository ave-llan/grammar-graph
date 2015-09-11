var test = require('tape')
var DecisionGraph = require('../lib/decision-graph.js')
var GuidedDecisionGraph = require('../lib/guided-decision-graph.js')
var GrammarGraph = require('../lib/grammar-graph.js')

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

  t.throws(function () {
      var a = new GuidedDecisionGraph(dg)
      a // Standard is complaining that a is defined and not used
    }, Error)
  t.throws(function () {
      var a = new GuidedDecisionGraph(dg)
      a
    }, Error)

  var guide = new GuidedDecisionGraph(dg, 'Sentence')
  t.deepEqual(guide.construction(), [])
  t.deepEqual(guide.choices(), ['the'])
  t.false(guide.isComplete())
  t.throws(function () {guide.pop()}, Error,
    'Should not be able to pop empty construction')
  t.deepEqual(guide.constructs(),
    ['the Noun RelativeClause VerbPhrase',
     'the Noun VerbPhrase'])

  guide.choose('the')
  t.deepEqual(guide.construction(), ['the'])
  t.deepEqual(guide.choices().sort(), ['dog', 'cat', 'squirrel', 'bird'].sort())
  t.false(guide.isComplete())
  t.deepEqual(guide.constructs(),
    [ 'the bird RelativeClause VerbPhrase',
      'the bird VerbPhrase',
      'the cat RelativeClause VerbPhrase',
      'the cat VerbPhrase',
      'the dog RelativeClause VerbPhrase',
      'the dog VerbPhrase',
      'the squirrel RelativeClause VerbPhrase',
      'the squirrel VerbPhrase' ])

  guide.choose('dog')
  t.deepEqual(guide.construction(), ['the', 'dog'])
  t.deepEqual(guide.choices().sort(),
    ['befriended', 'loved', 'attacked', 'ate', 'that'].sort())
  t.deepEqual(guide.constructs(),
    [ 'the dog ate',
      'the dog ate NounPhrase',
      'the dog attacked',
      'the dog attacked NounPhrase',
      'the dog befriended',
      'the dog befriended NounPhrase',
      'the dog loved',
      'the dog loved NounPhrase',
      'the dog that VerbPhrase VerbPhrase' ])

  guide.choose('ate')
  t.deepEqual(guide.construction(), ['the', 'dog', 'ate'])
  t.deepEqual(guide.choices().sort(),
    ['', 'the'].sort())
  t.deepEqual(guide.constructs(),
    [ 'the dog ate',
      'the dog ate the Noun',
      'the dog ate the Noun RelativeClause' ])

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
  t.true(guide.isComplete())
  t.deepEqual(guide.constructs(),
    ['the dog ate the cat that ate the bird that attacked'])

  t.end()
})

test('GuidedDecisionGraph nDeep choices and multiple .choose()', function (t) {
  var g = {
    Sentence: ['NounPhrase VerbPhrase'],
    NounPhrase: ['the Noun', 'the Noun RelativeClause'],
    VerbPhrase: ['Verb', 'Verb NounPhrase'],
    RelativeClause: ['that VerbPhrase'],
    Noun: ['dog', 'cat', 'bird', 'squirrel'],
    Verb: ['befriended', 'loved', 'ate', 'attacked']
  }
  var graph = new GrammarGraph(g)
  var guide = graph.guide('Sentence')

  t.deepEqual(guide.choices(), ['the'])
  t.deepEqual(guide.choices(1), ['the'])
  t.deepEqual(guide.choices(2),
    [ { val: 'the',
      next: [ { val: 'squirrel', next: [] },
              { val: 'bird', next: [] },
              { val: 'cat', next: [] },
              { val: 'dog', next: [] }
            ]
      }
    ])

  guide.choose(['the', 'dog', 'ate'])
  t.deepEqual(guide.construction(), ['the', 'dog', 'ate'])

  t.deepEqual(guide.choices(3),
    [ { val: '',
        next: [] },
      { val: 'the',
        next: [ { val: 'squirrel',
                 next: [ { val: 'that', next: [] },
                         { val: '', next: [] } ]
                },
                { val: 'bird',
                 next: [ { val: 'that', next: [] },
                         { val: '', next: [] } ]
                },
                { val: 'cat',
                 next: [ { val: 'that', next: [] },
                         { val: '', next: [] } ]
                },
                { val: 'dog',
                 next: [ { val: 'that', next: [] },
                         { val: '', next: [] } ]
                }
              ]
      }
    ])

  guide.choose([ 'the', 'squirrel', 'that', 'loved', 'the' ])
  t.deepEqual(guide.construction(),
    [ 'the', 'dog', 'ate', 'the', 'squirrel', 'that', 'loved', 'the' ])
  t.end()
})
