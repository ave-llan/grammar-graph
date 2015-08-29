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
    var vIndex = names[v]
    if (adj[vIndex] === undefined) adj[vIndex] = []
    if (Array.isArray(w)) {
      Array.prototype.push.apply(adj[vIndex])
    }
    else adj[vIndex].push(w)
  }

  /**
   * get an array of all the vertices this vertex points to
   * @param {string} v - the name of a vertex
   * @returns {string[]} an ordered list of all the vertices that v points to
   */
  this.adj = function (v) {
    if (adj[names[v]] === undefined) return []
    else {
      return adj[names[v]].map(function (vIndex) {
        return keys[vIndex]
      })
    }
  }

  /**
   * get the number of vertices in this graph
   * @returns {number} the number of vertices in this graph
   */
  this.V = function () {
    return V
  }
}

module.exports = DecisionGraph
