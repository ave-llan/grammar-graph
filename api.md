<a name="DecisionGraph"></a>
## DecisionGraph
**Kind**: global class  

* [DecisionGraph](#DecisionGraph)
  * [new DecisionGraph()](#new_DecisionGraph_new)
  * [.addVertex(name, [typeAND])](#DecisionGraph+addVertex)
  * [.addEdge(v, w)](#DecisionGraph+addEdge)

<a name="new_DecisionGraph_new"></a>
### new DecisionGraph()
creates a new DecisionGraph

<a name="DecisionGraph+addVertex"></a>
### decisionGraph.addVertex(name, [typeAND])
add vertex to the graph

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | the name of this vertex |
| [typeAND] | <code>string</code> | <code>true</code> | the type of this vertex: true=AND, false=OR. Defaults to true. |

<a name="DecisionGraph+addEdge"></a>
### decisionGraph.addEdge(v, w)
add edge v->w to the graph

**Kind**: instance method of <code>[DecisionGraph](#DecisionGraph)</code>  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>string</code> | the name of a vertex this edge points from |
| w | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | the name of a vertex this edge points to or an array of vertex names. If vertex v is type AND, the order of w will be the exact order required. |

