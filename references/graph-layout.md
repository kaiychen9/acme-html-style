# Graph Layout — API Reference

Self-contained graph layout and rendering library. Zero dependencies. Copy the functions you need from `references/graph-layout.js` into any `<script>` block.

---

## Quick Start

Define a graph, compute a layout, route edges, and render to SVG:

```js
// 1. Define the graph
var graph = {
  nodes: [
    { id: 'A', label: 'Alice' },
    { id: 'B', label: 'Bob' },
    { id: 'C', label: 'Carol' },
    { id: 'D', label: 'Dave' }
  ],
  edges: [
    { source: 'A', target: 'B' },
    { source: 'A', target: 'C' },
    { source: 'B', target: 'D' },
    { source: 'C', target: 'D' }
  ]
};

// 2. Compute layout
var layout = layoutForce(graph, { iterations: 80, width: 600, height: 400 });

// 3. Route edges
layout = routeStraight(layout);

// 4. Render SVG
document.getElementById('graph-container').innerHTML = renderSVG(layout);
```

---

## Data Structures

### Graph (input)

```js
{
  nodes: [
    { id: 'A', label: 'Alice', w: 120, h: 56 }  // w/h optional (default: 100, 48)
  ],
  edges: [
    { source: 'A', target: 'B', label: 'knows' }  // label optional
  ]
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `nodes[].id` | string | Yes | — | Unique node identifier |
| `nodes[].label` | string | No | — | Display label (truncated to 24 chars in SVG) |
| `nodes[].w` | number | No | 100 | Node width in pixels |
| `nodes[].h` | number | No | 48 | Node height in pixels |
| `edges[].source` | string | Yes | — | ID of source node |
| `edges[].target` | string | Yes | — | ID of target node |
| `edges[].label` | string | No | — | Edge label rendered at midpoint |

### Layout (output)

```js
{
  nodes: [
    { id: 'A', label: 'Alice', w: 100, h: 48, x: 150, y: 200 }
  ],
  edges: [
    { source: 'A', target: 'B', label: 'knows', points: [{x:100,y:200}, {x:300,y:200}] }
  ]
}
```

All layout functions return a Layout — a deep clone of the input Graph with positions added. Nodes gain `x`/`y` (center coordinates). Edges gain a `points` array filled by a routing function. Layouts are **mutable** — routing functions modify in place and also return the object.

---

## Layout Algorithms

### `layoutForce(graph, opts)`

Fruchterman-Reingold force-directed algorithm. Nodes repel each other (1/d^2 law), edges act as springs (attraction linear in displacement). Uses iterative cooling to converge on stable positions. Deterministic when `seed` is set.

**Best for:** general-purpose graphs, social networks, any connected graph with 5–100 nodes.

**Algorithm:** Repulsion between all node pairs, attraction along edges, velocity damping, temperature cooling.

```js
var layout = layoutForce(graph, {
  iterations: 100,
  repulsion: 5000,
  attraction: 0.01,
  idealLength: 100,
  damping: 0.9,
  cooling: 0.95,
  width: 800,
  height: 600,
  seed: 42
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `iterations` | number | 100 | Maximum simulation steps |
| `repulsion` | number | 5000 | Repulsion constant; higher = more spread between nodes |
| `attraction` | number | 0.01 | Spring constant; higher = tighter edge lengths |
| `idealLength` | number | 100 | Natural resting length of each spring (px) |
| `damping` | number | 0.9 | Velocity decay per iteration (0–1); lower = faster settling |
| `cooling` | number | 0.95 | Temperature decay factor per iteration (0–1) |
| `width` | number | 800 | Bounding box width; nodes clamp to [20, width-20] |
| `height` | number | 600 | Bounding box height; nodes clamp to [20, height-20] |
| `seed` | number | 42 | RNG seed for reproducible layouts |

**Tuning tips:**
- Dense graphs: increase `repulsion` (8000–15000), increase `iterations` (150–200).
- Sparse graphs: reduce `repulsion` (2000–4000), increase `attraction` (0.02–0.05).
- Larger canvas: scale `width`/`height` and `idealLength` together.
- If nodes oscillate: reduce `damping` (0.8) and `cooling` (0.90).

---

### `layoutSugiyama(graph, opts)`

Hierarchical layer-based layout for directed acyclic graphs (DAGs). Uses longest-path layer assignment with barycenter heuristic to minimize edge crossings.

**Best for:** DAGs, dependency graphs, class hierarchies, org charts, flow diagrams.

**Algorithm:**
1. Assign nodes to layers via longest-path from sources
2. Apply barycenter heuristic (3 sweeps) to reduce crossings
3. Center layers horizontally; place nodes with even vertical spacing

```js
var layout = layoutSugiyama(graph, {
  orientation: 'TB',
  layerSpacing: 80,
  nodeSpacing: 60
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `orientation` | string | `'TB'` | Flow direction; currently `'TB'` (top-to-bottom) |
| `layerSpacing` | number | 80 | Vertical spacing between layers (px) |
| `nodeSpacing` | number | 60 | Horizontal spacing between nodes within a layer (px) |

**Notes:**
- Cyclic graphs still produce a layout — cycles are collapsed into the same layer as a fallback.
- Isolated nodes (no edges) are placed in layer 0.
- The layout assumes edges flow top-to-bottom. To reverse, swap source/target in your graph definition.

---

### `layoutCircular(graph, opts)`

Places nodes evenly around a circle, using greedy edge-crossing minimization to determine the ordering.

**Best for:** ring topologies, all-to-all networks, cycle graphs, accentuating symmetry.

**Algorithm:** Insert nodes one at a time at the position minimizing total edge crossings, then place them on a circle starting from the top (12 o'clock position, -PI/2).

```js
var layout = layoutCircular(graph, {
  width: 600,
  height: 600
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | number | 600 | Canvas width; used for auto-centering |
| `height` | number | 600 | Canvas height; used for auto-centering |
| `radius` | number | `min(w,h) * 0.4` | Circle radius (px) |
| `cx` | number | `width / 2` | Circle center X |
| `cy` | number | `height / 2` | Circle center Y |

**Notes:**
- Greedy crossing minimization runs in O(n^2 * e^2) where n is nodes and e is edges. For graphs with >50 nodes, consider reducing nodes or using `layoutForce` instead.
- If `radius` is auto-computed, it scales to 40% of the smaller canvas dimension.

---

### `layoutTree(graph, opts)`

BFS-expand tree from the root node. Children are centered beneath their parent using subtree leaf counts for proportional spacing.

**Best for:** trees, hierarchies, org charts, file system structures, parse trees.

**Algorithm:**
1. Identify root (first node with no incoming edges; defaults to first node)
2. BFS to compute depth and parent relationships
3. Bottom-up leaf counting for subtree sizes
4. Top-down proportional coordinate assignment

```js
var layout = layoutTree(graph, {
  hSpacing: 80,
  vSpacing: 80,
  orientation: 'TB'
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `hSpacing` | number | 80 | Horizontal space per leaf node (px); wider values spread subtrees |
| `vSpacing` | number | 80 | Vertical spacing between depth levels (px) |
| `orientation` | string | `'TB'` | Flow direction; currently `'TB'` (top-to-bottom) |

**Notes:**
- The root is the first node with no incoming edges. If all nodes have incoming edges (cycle), the first node in the list is used.
- Nodes not reachable via BFS from the root are left unpositioned and should be handled separately.
- Coordinates are shifted to ensure all x-coordinates are positive (minimum x offset to +40px).

---

### `layoutGrid(graph, opts)`

Arranges nodes in a row-column grid, filling left-to-right, top-to-bottom.

**Best for:** gallery views, tile displays, non-edge-focused arrangements, thumbnail grids.

```js
var layout = layoutGrid(graph, {
  columns: 4,
  cellW: 150,
  cellH: 100,
  startX: 20,
  startY: 20
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `columns` | number | 4 | Number of columns in the grid |
| `cellW` | number | 150 | Width of each grid cell (px) |
| `cellH` | number | 100 | Height of each grid cell (px) |
| `startX` | number | 20 | Left offset of the first column center (px) |
| `startY` | number | 20 | Top offset of the first row center (px) |

**Notes:**
- Node positions are the center of each cell: `x = startX + col * cellW + cellW/2`, `y = startY + row * cellH + nodeH/2`.
- Edge rendering still works, but grid layouts are typically for edge-light graphs.
- Node order in the array determines grid position (index 0 = row 0, col 0).

---

## Edge Routing

Edge routing functions add `points` arrays to each edge in the Layout. All functions **mutate the layout in place** and return it.

### `routeStraight(layout)`

Straight line from source boundary to target boundary. The simplest and fastest router.

```js
layout = routeStraight(layout);
```

Each edge's `points` is set to `[{x1,y1}, {x2,y2}]` where the coordinates are the clipped intersection points on node boundaries (computed via `clipEdge` → `intersectRect`).

**Best for:** Most layouts. Always a safe default.

---

### `routeOrthogonal(layout, opts)`

L-shaped (Manhattan) routing with a single corner. The corner direction is chosen by aspect ratio: horizontal-first when dx > dy, vertical-first otherwise.

```js
layout = routeOrthogonal(layout, { cornerOffset: 20 });
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cornerOffset` | number | 20 | Extra pixel padding at the corner (reserved for future use) |

Each edge's `points` is set to `[{start}, {corner}, {end}]` (3 points), rendered as an SVG `<polyline>`.

**Best for:** DAGs, org charts, circuit diagrams, any layout where you want L-shaped edges.

**Note on `cornerOffset`:** The parameter is accepted but the current implementation computes the corner as the midpoint between start/end clip points. The offset parameter is reserved for a future version that would push corners away from the straight line.

---

### `routeBezier(layout, opts)`

Cubic Bezier curves with perpendicular offset control points for smooth arc-shaped edges.

```js
layout = routeBezier(layout, { tension: 0.3 });
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `tension` | number | 0.3 | Control point offset distance, relative to edge length |

Each edge's `points` is set to `[{start}, {cp1}, {cp2}, {end}]` (4 points), rendered as an SVG `<path>` with a `C` (cubic Bezier) command. Control points are offset perpendicular to the straight line by `dist * tension`, with cp1 offset in one direction and cp2 in the opposite, creating a gentle arc.

**Best for:** Aesthetic layouts, circular layouts, force-directed layouts where you want softer visual edges.

---

### `routeAvoidNodes(layout, opts)`

Reroutes straight edges that pass through non-endpoint nodes by inserting detour waypoints.

```js
layout = routeAvoidNodes(layout, { padding: 10 });
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `padding` | number | 10 | Extra clearance around each node's bounding box (px) |

**Algorithm:** First calls `routeStraight`, then checks each edge's straight line against every non-endpoint node's bounding box using Liang-Barsky line-rectangle intersection. For each blocking node, a waypoint is inserted to the right of the blocking node.

**Best for:** Dense layouts where straight edges overlap unrelated nodes; any layout where edges must not cross node boundaries.

**Note:** This function internally calls `routeStraight` first to establish initial straight-line points, then modifies them. The resulting `points` array may have more than 2 entries.

---

## SVG Rendering

### `renderSVG(layout, opts)`

Produces a complete SVG string from a routed Layout. Uses Acme design token CSS variables for colors. Output is an inline `<svg>` block ready for `innerHTML`.

```js
var svg = renderSVG(layout, {
  width: 800,
  height: 600,
  nodeFill: 'var(--white)',
  nodeStroke: 'var(--gray-700)',
  edgeStroke: 'var(--gray-500)',
  nodeStrokeWidth: 1.5,
  edgeStrokeWidth: 1.5,
  fontSize: 11,
  showLabels: true,
  nodeRadius: 6,
  activeEdge: -1,
  activeStroke: 'var(--clay)'
});

document.getElementById('graph').innerHTML = svg;
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `width` | number | auto | SVG viewBox width; 0 = auto-fit content (min 400px) |
| `height` | number | auto | SVG viewBox height; 0 = auto-fit content (min 300px) |
| `nodeFill` | string | `'var(--white)'` | CSS color for node fill |
| `nodeStroke` | string | `'var(--gray-700)'` | CSS color for node border |
| `edgeStroke` | string | `'var(--gray-500)'` | CSS color for edge lines |
| `nodeStrokeWidth` | number | 1.5 | Node border width in px |
| `edgeStrokeWidth` | number | 1.5 | Edge line width in px |
| `fontSize` | number | 11 | Label font size in px |
| `showLabels` | boolean | `true` | Whether to render node labels |
| `nodeRadius` | number | 6 | Node corner radius in px |
| `activeEdge` | number | -1 | Index of edge to highlight; -1 = none |
| `activeStroke` | string | `'var(--clay)'` | Stroke color for the highlighted edge |

**Rendering details:**

- **Edges render first** (behind nodes), then nodes render on top.
- Edge rendering mode is determined by the number of points:
  - **2 points** → `<line>` (straight)
  - **3 points** → `<polyline>` (orthogonal L-shape)
  - **4 points** → `<path d="M... C...">` (cubic Bezier)
  - **5+ points** → `<polyline>` (multi-segment, e.g., `routeAvoidNodes`)
- Each node renders as:
  - A `<rect>` with configurable fill, stroke, and corner radius
  - A `<circle>` color indicator dot (4px radius, left side of the node) cycling through Acme palette colors: clay, olive, slate, rust, info
  - A `<text>` label centered in the node, truncated to 24 characters, in `var(--mono)` font
- Edge labels (if present) render at the midpoint of the points array, offset 6px above the line, in gray.
- Node corners (`rx`) apply to all four corners uniformly.
- Coordinates are formatted to 1 decimal place for compact SVG output.
- XML special characters (`&`, `<`, `>`, `"`, `'`) in labels are escaped.

**CSS variables used by default:**
- `--white` — node fill background
- `--gray-700` — node borders
- `--gray-500` — edge lines and edge labels
- `--clay`, `--olive`, `--slate`, `--rust`, `--info` — color indicator dots (cycling)
- `--mono` — font family for labels

These are Acme design tokens defined in `references/design-tokens.md`. The SVG uses `var(...)` references so the output automatically adapts to your document's CSS custom properties.

---

## Utility Functions

These are not typically called directly but are available for advanced use:

### `cloneGraph(graph)`

Deep-clones a Graph, normalizing missing `w`/`h` to defaults (100, 48). Called internally by all layout functions so input graphs are never mutated.

### `clipEdge(srcNode, dstNode, srcCx, srcCy, dstCx, dstCy)`

Computes the line segment from the boundary of `srcNode` to the boundary of `dstNode`, given their center points. Returns `{x1, y1, x2, y2}` or the center-to-center line if no intersection is found.

### `intersectRect(x1, y1, x2, y2, rx, ry, rw, rh)`

Ray-rectangle intersection. Returns the nearest point `{x, y}` where a ray from (x1,y1) toward (x2,y2) hits the rectangle boundary. Returns `null` if no intersection.

### `intersectCircle(x1, y1, x2, y2, cx, cy, r)`

Ray-circle intersection. Returns the nearest point `{x, y}` where a ray from (x1,y1) toward (x2,y2) hits the circle boundary.

### `buildEdgeMap(layout)`

Builds an adjacency map `{nodeId: {connectedId: true, ...}}` from a Layout. Used internally.

### `nodeIndex(layout, id)`

Finds the array index of a node by its `id`. Returns `-1` if not found.

---

## Choosing the Right Algorithm

| Graph Type | Layout | Routing | Notes |
|------------|--------|---------|-------|
| General / social network (5–100 nodes) | `layoutForce` | `routeStraight` or `routeBezier` | Default choice; handles any connected graph |
| DAG / dependency / pipeline | `layoutSugiyama` | `routeOrthogonal` | Layers clarify flow direction; L-shaped edges reinforce hierarchy |
| Cycle / ring / all-to-all | `layoutCircular` | `routeBezier` | Symmetry makes cycles easy to read |
| Tree / org chart / hierarchy | `layoutTree` | `routeOrthogonal` | Proportional spacing prevents overlap in wide subtrees |
| Grid / gallery / tile view | `layoutGrid` | `routeStraight` | Simple rows; edges are secondary to node arrangement |
| Dense graph with overlapping edges | `layoutForce` | `routeAvoidNodes` | Detour waypoints prevent lines crossing unrelated nodes |
| Aesthetic presentation (small graph) | `layoutForce` | `routeBezier` | Curved edges and spread nodes look polished |
| Circuit / architecture diagram | `layoutSugiyama` | `routeOrthogonal` | Clean, structured look with right-angle edges |

### Composition Tips

- Any layout can use any routing function. Mix and match for the desired visual result.
- For large DAGs with many edges crossing layers, combine `layoutSugiyama` with `routeBezier` for smoother visual flow.
- For force-directed layouts on >50 nodes, use `routeAvoidNodes` with a small padding (5–10) to keep lines from cutting through dense clusters.
- The `points` array on edges is just a plain array — you can manually insert, remove, or reposition waypoints after routing for custom edge paths.

### Quick Decision Flow

1. **Is the graph a tree or strict hierarchy?** → `layoutTree`
2. **Is the graph a cycle or ring?** → `layoutCircular`
3. **Is the graph a DAG with clear flow direction?** → `layoutSugiyama`
4. **Is it a simple grid of items?** → `layoutGrid`
5. **Everything else** → `layoutForce`

---

## Complete Example

```js
// Dependency graph: A -> B, A -> C, B -> D, C -> D
var graph = {
  nodes: [
    { id: 'A', label: 'index.js' },
    { id: 'B', label: 'parser.js' },
    { id: 'C', label: 'lexer.js' },
    { id: 'D', label: 'compiler.js' }
  ],
  edges: [
    { source: 'A', target: 'B' },
    { source: 'A', target: 'C' },
    { source: 'B', target: 'D', label: 'AST' },
    { source: 'C', target: 'D', label: 'tokens' }
  ]
};

// Step 1: Layout (Sugiyama for DAG)
var layout = layoutSugiyama(graph, {
  orientation: 'TB',
  layerSpacing: 100,
  nodeSpacing: 80
});

// Step 2: Route (Straight for clean lines)
layout = routeStraight(layout);

// Step 3: Render
var svg = renderSVG(layout, {
  showLabels: true,
  nodeRadius: 8,
  fontSize: 12
});

document.getElementById('graph').innerHTML = svg;
```
