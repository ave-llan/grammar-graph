/**
 * creates a new DecisionGraph
 * @constructor
 */
var DecisionGraph = function () {
  var V = 0          // the number of vertices
  var names = {}     // vertex string -> index number
  var keys = []      // vertex index number -> string
  var isAND = []     // boolean array: true = AND; false = OR
  var adj = []       // edge arrays

  /**
   * add vertex to the graph. When moving through the decision graph, an AND vertex
   * will require a visit down each of its outgoing edges, in order. An OR vertex
   * will pick just one of its outgoing vertices, so order does not matter.
   * @param {string} name - the name of this vertex
   * @param {string} [typeAND=true] - the type of this vertex: true=AND, false=OR.
   */
  this.addVertex = function (name, typeAND) {
    names[name] = V
    keys[V] = name
    isAND[V] = (typeAND === undefined) ? true         // default to true
                                       : typeAND
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
      Array.prototype.push.apply(adj[names[v]])
    }
    else adj[names[v]].push(w)
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
   * @param {string} v - the name of a vertex
   * @returns {boolean} is this a terminal vertex
   */
  this.isTerminal = function (v) {
    return adj[names[v]].length === 0
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

/**
 * get an object with properties describing the vertex
 * @param {string} v - the name of a vertex
 * @returns {Object} an object with properties [isTerminal]{@link DecisionGraph#isTerminal},
 * [isTypeAND]{@link DecisionGraph#isTypeAND}, and [adj]{@link DecisionGraph#adj}
 */
DecisionGraph.prototype.getVertex = function (v) {
  return {
    isTerminal: this.isTerminal(v),
    isTypeAND: this.isTypeAND(v),
    adj: this.adj(v)
  }
}

module.exports = DecisionGraph
