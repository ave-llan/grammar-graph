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

  var construction = []       // chosen terminals, i.e. the current construction
  var expanded                // dictionary of possible next terminals, + their stateStacks
  var acceptState = false     // could the current construction stand complete as-is?
  var history = []            // stack of previous expanded objects (see previous line)
  var acceptStateHistory = [] // stack of booleans remembering old acceptStates
  var guide = this            // scope to be used in recursive functions: choose & choices

  // expands all stateStacks in unexpanded until they begin in a terminal symbol
  // and adds them to expanded
  function expand (unexpanded) {
    acceptState = false       // reset for this expansion
    var expandedChoices = {}  // dictionary of possible next terminals, + their stateStacks
    while (unexpanded.length !== 0) {
      var stateStack = unexpanded.pop()
      if (stateStack.length === 0) {      // if true, the current construction could be complete
        acceptState = true
      } else {
        var node = stateStack.pop()

        if (dg.isTerminal(node)) {        // terminal, add to expandedChoices dictionary
          if (!(node in expandedChoices)) expandedChoices[node] = []
          expandedChoices[node].push(stateStack)
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
            var stackCopy = clone(stateStack)
            stackCopy.push(child)
            unexpanded.push(stackCopy)
          })
        }
      }
    }
    return expandedChoices
  }

  // initialize the guided decision graph with an array of possible state stacks,
  // in this case, just a single state stack consisting of the start symbol
  expanded = expand([[start]])

  /**
   * the current construction
   * @returns {string[]} a terminal symbol chain
   */
  this.construction = function () {
    return clone(construction)
  }

  /**
   * is the current construction a valid, complete construction from the starting
   * nonterminal? ie, could the construction be haulted at this point? Depending
   * on the grammar, this may be true even if there are more choices at this point.
   * @returns {boolean} is the construction complete
   */
  this.isComplete = function () {
    return acceptState
  }

  /**
   * adds the given terminal to the construction
   * @param {string|string[]} terminal - the name of a terminal vertex in the
   * Decision Graph which is in the current set of possible choices. Or a valid
   * sequence of terminal symbols as an array.
   */
  this.choose = function (terminal) {
    if (Array.isArray(terminal)) {
      terminal.forEach(function (t) {
        guide.choose(t)
      })
    } else {
      if (!(terminal in expanded)) throw new Error('Not a valid next terminal:', terminal)

      construction.push(terminal)              // add terminal to construction
      history.push(clone(expanded))            // add expanded dictionary to history
      acceptStateHistory.push(acceptState)     // add acceptState to history
      expanded = expand(expanded[terminal])    // expand the stateStacks of the choice
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
    var states = []
    for (var terminal in expanded) {
      expanded[terminal].forEach(function (stack) {
        var choice = clone(stack)
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
    if (guide.isComplete()) {   // also add the current construction as a seperate choice
      states.push(guide.construction().join(' '))
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
    acceptState = acceptStateHistory.pop()
    return construction.pop()
  }

  /**
   * returns all possible next terminals, or an array of nDeep [TreeNodes]{@link TreeNode}
   *
   * @param {number} [nDeep=1] - will search for nDeep possible choices
   * @returns {string[]|TreeNode[]} if nDeep=1, an array of terminal symbols (strings),
   * else an array of [TreeNodes]{@link TreeNode}
   * @example
   * // guide is an in-progress GuidedDecisionGraph
   * guide.construction()   => ['the', 'dog', 'ate']
   * guide.choices()        => ['', 'the']
   * guide.choices(3)       =>
   * [ { val: '',
   *     next: [] },
   *   { val: 'the',
   *     next: [ { val: 'squirrel',
   *              next: [ { val: 'that', next: [] },
   *                      { val: '',     next: [] } ]
   *             },
   *             { val: 'bird',
   *              next: [ { val: 'that', next: [] },
   *                      { val: '',     next: [] } ]
   *             },
   *             { val: 'cat',
   *              next: [ { val: 'that', next: [] },
   *                      { val: '',     next: [] } ]
   *             },
   *             { val: 'dog',
   *              next: [ { val: 'that', next: [] },
   *                      { val: '',     next: [] } ]
   *             }
   *           ]
   *   }
   * ]
   */
  this.choices = function (nDeep) {
    if (nDeep === undefined || nDeep === 1) {
      return Object.keys(expanded)
    }
    // if nDeep > 1, map to TreeNodes and recursively expand to nDeep choices
    return Object.keys(expanded).map(function (choice) {
      var node = new TreeNode(choice)
      guide.choose(choice)
      node.next = (nDeep - 1 > 1) ? guide.choices(nDeep - 1)
                                  : guide.choices(nDeep - 1).map(TreeNode)
      guide.pop()
      return node
    })
  }
}

/**
 * Tree nodes to return decision trees
 *
 * @param {string} val - a terminal string
 * @property {string} val - a terminal string
 * @property {TreeNode[]} next - a list of TreeNodes this node links to
 * @see TreeNodes are returned from [GuidedDecisionGraph.choices]{@link GuidedDecisionGraph#choices}
 */
var TreeNode = function (val) {
  if (!(this instanceof TreeNode)) return new TreeNode(val)
  this.val = val
  this.next = []
}

module.exports = GuidedDecisionGraph
