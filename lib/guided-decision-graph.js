var clone = require('./utils/clone.js')

/**
 * step-by-step construction of a language from a decision graph
 * @constructor
 *
 * @param {DecisionGraph} dg - a Decision Graph that defines a grammar
 * @param {string} start - the name of a vertex in the decision graph from which
 * to start the guided expansion
 */
var GuidedDecisionGraph = function (dg, start) {
  if (!(dg.isVertex(start))) throw new Error('given start is not a vertex in dg:', start)

  var construction = []   // chosen terminals, i.e. the current construction
  var unexpanded = []     // array of stateStacks that need to be expanded
  var expanded = {}       // dictionary of possible next terminals, + their stateStacks
  var history = []        // array of previous expanded objects (see previous line)
  var guide = this        // scope to be used in recursive functions

  // expands all stateStacks in unexpanded and adds them to expanded
  function expand () {
    while (unexpanded.length !== 0) {
      var stateStack = unexpanded.pop()

      var node = stateStack.pop()

      if (dg.isTerminal(node)) {        // terminal, add to expanded dictionary
        if (!(node in expanded)) expanded[node] = []
        if (stateStack.length === 0) stateStack.push(dg.epsilon()) // mark as end of construction
        expanded[node].push(stateStack)
      } else if (dg.isTypeAND(node)) {  // type AND, expand and put back on unexpanded
        var children = dg.adj(node)
        // add to stateStack in reverse order
        for (var i = children.length - 1; i >= 0; i--) {
          stateStack.push(children[i])
        }
        unexpanded.push(stateStack)
      } else {                          // type OR, add all possible stacks to unexpanded
        var orChildren = dg.adj(node)
        orChildren.forEach(function (child) {
          var stackCopy = stateStack.slice()
          stackCopy.push(child)
          unexpanded.push(stackCopy)
        })
      }
    }
  }

  // initialize the guided decision graph by adding the start state and expanding
  unexpanded.push([start])
  expand()

  /**
   * the current construction
   * @returns {string[]} a terminal symbol chain
   */
  this.construction = function () {
    return construction
  }

  /**
   * is the current construction a valid, complete construction from the starting
   * nonterminal? ie, does the construction end in epsilon?
   * @returns {boolean} is the construction complete
   */
  this.isComplete = function () {
    return construction ? (dg.epsilon() === construction[construction.length - 1])
                        : false
  }

  /**
   * adds the given terminal to the construction
   * @param {string} terminal - the name of a terminal vertex in the
   * Decision Graph which is in the current set of possible choices.
   */
  this.choose = function (terminal) {
    if (!(terminal in expanded)) throw new Error('Not a valid next terminal:', terminal)

    construction.push(terminal)       // add terminal to construction
    history.push(clone(expanded))     // add expanded dictionary to history

    if (terminal !== dg.epsilon()) {
      unexpanded = expanded[terminal] // move this terminal's stateStacks to unexpanded
      expanded = {}                   // reset expanded
      expand()                        // expand again
    } else {
      expanded = {}                   // also reset expanded if this is epsilon
    }
  }

  /**
   * get a sorted array of possible construction strings from the current state,
   * possibly including nonterminals after the next terminal
   * @returns {string[]} a list of possible constructions
   * @example
   * // guide is an in-progress GuidedDecisionGraph
   * guide.construction()   => ['the', 'dog', 'ate']
   * guide.choices()        => ['', 'the']
   * guide.constructs()
   *  => [ 'the dog ate',
   *       'the dog ate the Noun'
   *       'the dog ate the Noun RelativeClause' ]
   */
  this.constructs = function () {
    // if construction is finished, return it immediately removing epsilon
    if (this.isComplete()) {
      return [construction.slice(0, -1).join(' ')]
    }

    var states = []
    for (var terminal in expanded) {
      expanded[terminal].forEach(function (stack) {
        var choice = clone(stack)
        if (choice[0] === dg.epsilon()) choice = [] // do not display epsilon
        choice.push(terminal)
        choice.reverse()
        var cur = construction.length > 0 ? construction.join(' ')
                                               : ''
        var next = choice.join(' ')
        var sentence = (cur && next) ? cur + ' ' + next
                                     : cur + next
        states.push(sentence)
      })
    }
    return states.sort()
  }

  /**
   * pop the last choice off the construction
   * @throws throws an error if called when construction is empty
   * @returns {string} the last element of the construction that was
   * submitted through {@link GuidedDecisionGraph#choose}
   */
  this.pop = function () {
    if (construction.length === 0) throw new Error('Cannot pop empty construction.')
    expanded = history.pop()
    return construction.pop()
  }

  /**
   * returns all possible next terminals chains of length nDeep. Some chains may
   * have a length less than nDeep or if that chain reaches epsilon.
   *
   * @param {number} [nDeep=1] - will search for nDeep possible choices
   * @returns {string[]|Array.<string[]>} if nDeep=1, an array of terminal symbols, else
   * an array of nDeep length arrays of terminal choices
   * @example
   * // guide is an in-progress GuidedDecisionGraph
   * guide.construction()   => ['the', 'dog', 'ate']
   * guide.choices()        => ['', 'the']
   * guide.choices(3)       =>
   * [ [ '' ],
   *   [ 'the', 'squirrel', 'that' ],
   *   [ 'the', 'squirrel', '' ],
   *   [ 'the', 'bird', 'that' ],
   *   [ 'the', 'bird', '' ],
   *   [ 'the', 'cat', 'that' ],
   *   [ 'the', 'cat', '' ],
   *   [ 'the', 'dog', 'that' ],
   *   [ 'the', 'dog', '' ] ]
   */
  this.choices = function (nDeep) {
    if (nDeep === undefined || nDeep === 1) {
      return Object.keys(expanded)
    }

    var firstChoices = Object.keys(expanded)
    if (!firstChoices) return []

    // if >1 deep
    var nChoices = []
    firstChoices.forEach(function (choice) {
      if (choice === dg.epsilon()) {
        nChoices.push(Array.isArray(choice) ? choice
                                            : [choice]
        )
      } else {
        guide.choose(choice)
        guide.choices(nDeep - 1).forEach(function (nextChoice) {
          if (Array.isArray(nextChoice)) {
            nextChoice.unshift(choice)
            nChoices.push(nextChoice)
          } else {
            nChoices.push([choice, nextChoice])
          }
        })
        guide.pop()
      }
    })
    return nChoices
  }
}

module.exports = GuidedDecisionGraph
