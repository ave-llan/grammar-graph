/**
 * creates a new DecisionGraph
 * @constructor
 *
 * @param {string} [epsilonSymbol=""] - Special terminal symbol
 * that indicates this is an end of a construction. Defaults to the
 * empty string.
 */
var DecisionGraph = function (epsilonSymbol) {
  var V = 0          // the number of vertices
  var names = {}     // vertex string -> index number
  var keys = []      // vertex index number -> string
  var isAND = []     // boolean array: true = AND; false = OR
  var adj = []       // edge arrays
  var epsilon = (epsilonSymbol === undefined) ? '' : epsilonSymbol

  /**
   * add AND vertex to the graph. When moving through the decision graph, an AND vertex
   * will require a visit down each of its outgoing edges, in the order the edges were
   * added.
   * @param {string} name - the name of this vertex
   *
   * @see {@link DecisionGraph#addVertexOR}
   */
  this.addVertexAND = function (name) {
    if (names[name] !== undefined) return
    names[name] = V
    keys[V] = name
    isAND[V] = true
    adj[V] = []
    V++
  }

  /**
   * add OR vertex to the graph. When moving through the decision graph, an OR vertex
   * chooses just one of its outgoing vertices.
   * @param {string} name - the name of this vertex
   *
   * @see {@link DecisionGraph#addVertexAND}
   */
  this.addVertexOR = function (name) {
    if (names[name] !== undefined) return
    names[name] = V
    keys[V] = name
    isAND[V] = false
    adj[V] = []
    V++
  }

  /**
   * add edge v->w to the graph
   * @param {string} v - the name of a vertex this edge points from
   * @param {(string|string[])} w - the name of a vertex this edge points to or an
   * array of vertex names. If vertex v is type AND, the order of w will be the exact order
   * required.
   */
  this.addEdge = function (v, w) {
    if (Array.isArray(w)) {
      w.forEach(function (child) {
        if (!(child in names)) throw new Error('Not a vertex name:', child)
      })
      Array.prototype.push.apply(adj[names[v]], w.map(function (vName) {
        return names[vName]
      }))
    } else {
      if (!(w in names)) throw new Error('Not a vertex name:', w)
      adj[names[v]].push(names[w])
    }
  }

  /**
   * get an array of all the vertices this vertex points to
   * @param {string} v - the name of a vertex
   * @returns {string[]} an ordered list of all the vertices that v points to
   */
  this.adj = function (v) {
    return adj[names[v]].map(function (vIndex) {
      return keys[vIndex]
    })
  }

  /**
   * get the number of vertices in this graph
   * @returns {number} the number of vertices in this graph
   */
  this.V = function () {
    return V
  }

  /**
   * is this a termianl vertex (does it have no outgoing edges?)
   * Epsilon returns true to indicate the end of a construction.
   * @param {string} v - the name of a vertex
   * @returns {boolean} is this a terminal vertex
   */
  this.isTerminal = function (v) {
    return v === epsilon || adj[names[v]].length === 0
  }

  /**
   * is this a type AND vertex (and not a type OR)?
   * @param {string} v - the name of a vertex
   * @returns {boolean} is this a type AND vertex (and not a type OR)?
   */
  this.isTypeAND = function (v) {
    return isAND[names[v]]
  }
}

module.exports = DecisionGraph
