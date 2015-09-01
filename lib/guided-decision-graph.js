/**
 * step-by-step construction of a language from a decision graph
 * @constructor
 *
 * @param {DecisionGraph} dg - a Decision Graph that defines a grammar
 * @param {string} start - the name of a vertex in the decision graph
 * that indicates this is an end of a construction. Defaults to the
 * empty string.
 */
var GuidedDecisionGraph = function (dg, start) {
  var construction = []   // chosen terminals, i.e. the current construction
  var unexpanded = []     // array of stateStacks that need to be expanded
  var expanded = {}       // dictionary of possible next terminals, + their stateStacks
  var history = []        // array of previous expanded objects (see previous line)

  // expands all stateStacks in unexpanded and adds them to expanded
  function expand () {
    while (unexpanded.length !== 0) {
      var stateStack = unexpanded.pop()
      console.log('\npopped from unexpanded:')
      console.log(stateStack)

      var node = stateStack.pop()

      if (dg.isTerminal(node)) {        // terminal, add to expanded dictionary
        if (!(node in expanded)) expanded[node] = []
        if (stateStack.length === 0) stateStack.push(dg.epsilon()) // mark as end of construction
        expanded[node].push(stateStack)
        console.log('added terminal:', node)
      } else if (dg.isTypeAND(node)) {  // type AND, expand and put back on unexpanded
        var children = dg.adj(node)
        // add to stateStack in reverse order
        for (var i = children.length - 1; i >= 0; i--) {
          stateStack.push(children[i])
        }
        unexpanded.push(stateStack)
        console.log('processed AND node:', node)
      } else {                          // type OR, add all possible stacks to unexpanded
        console.log('processing OR node:', node)
        var orChildren = dg.adj(node)
        orChildren.forEach(function (child) {
          var stackCopy = stateStack.slice()
          stackCopy.push(child)
          console.log('adding OR expansion', stackCopy)
          unexpanded.push(stackCopy)
        })
        console.log('processed OR node:', node)
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
   * returns an array of the possible next terminals
   * @returns {string[]} a terminal symbol chain
   */
  this.choices = function () {
    return Object.keys(expanded)
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
    console.log('CURRENT HISTORY:')
    console.log(history)
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

}

// helper function to clone a simple object made up of primitives
function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

module.exports = GuidedDecisionGraph
