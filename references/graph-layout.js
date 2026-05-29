// =============================================================================
// Acme Graph Layout — Self-contained graph layout & rendering library
// Zero dependencies. Copy the functions you need into any <script> block.
// =============================================================================

// ---- Data Structures --------------------------------------------------------
// Graph  = { nodes: [{ id, label, w?, h? }], edges: [{ source, target }] }
// Layout = { nodes: [{ ...node, x, y }], edges: [{ ...edge, points: [{x,y}] }] }
// Default node size: w=100, h=48

var DEFAULT_NODE_W = 100;
var DEFAULT_NODE_H = 48;

/** Deep-clone a Graph, normalizing missing widths/heights to defaults. */
function cloneGraph(graph) {
  return {
    nodes: graph.nodes.map(function(n) { return { id: n.id, label: n.label, w: n.w || DEFAULT_NODE_W, h: n.h || DEFAULT_NODE_H }; }),
    edges: graph.edges.map(function(e) { return { source: e.source, target: e.target, label: e.label || '' }; })
  };
}

// ---- Boundary Intersection (shared by all routers) --------------------------

/**
 * intersectRect — Ray from (x1,y1) toward (x2,y2) against rectangle (rx,ry,rw,rh).
 * Returns the nearest intersection point on the rectangle boundary, or null.
 * Algorithm: parameterize as p(t) = start + t*direction. Test all 4 edges.
 * Keep t>0 where intersection falls within edge range. Return min-t point.
 */
function intersectRect(x1, y1, x2, y2, rx, ry, rw, rh) {
  var dx = x2 - x1, dy = y2 - y1;
  if (dx === 0 && dy === 0) return { x: x1, y: y1 };
  var tMin = Infinity;
  var ix, iy;

  // Left edge (x = rx)
  if (dx !== 0) {
    var t = (rx - x1) / dx;
    if (t > 0 && t < tMin) {
      var y = y1 + t * dy;
      if (y >= ry && y <= ry + rh) { tMin = t; ix = rx; iy = y; }
    }
  }
  // Right edge (x = rx + rw)
  if (dx !== 0) {
    var t = (rx + rw - x1) / dx;
    if (t > 0 && t < tMin) {
      var y = y1 + t * dy;
      if (y >= ry && y <= ry + rh) { tMin = t; ix = rx + rw; iy = y; }
    }
  }
  // Top edge (y = ry)
  if (dy !== 0) {
    var t = (ry - y1) / dy;
    if (t > 0 && t < tMin) {
      var x = x1 + t * dx;
      if (x >= rx && x <= rx + rw) { tMin = t; ix = x; iy = ry; }
    }
  }
  // Bottom edge (y = ry + rh)
  if (dy !== 0) {
    var t = (ry + rh - y1) / dy;
    if (t > 0 && t < tMin) {
      var x = x1 + t * dx;
      if (x >= rx && x <= rx + rw) { tMin = t; ix = x; iy = ry + rh; }
    }
  }
  if (tMin === Infinity) return null;
  return { x: ix, y: iy };
}

/**
 * intersectCircle — Ray from (x1,y1) toward (x2,y2) against circle (cx,cy,r).
 * Returns the nearest intersection point on the circle, or the start point.
 */
function intersectCircle(x1, y1, x2, y2, cx, cy, r) {
  var dx = x2 - x1, dy = y2 - y1;
  var fx = x1 - cx, fy = y1 - cy;
  var a = dx * dx + dy * dy;
  if (a === 0) return { x: x1, y: y1 };
  var b = 2 * (fx * dx + fy * dy);
  var c = fx * fx + fy * fy - r * r;
  var disc = b * b - 4 * a * c;
  if (disc < 0) return { x: x1, y: y1 };
  var sqrtD = Math.sqrt(disc);
  var t1 = (-b - sqrtD) / (2 * a);
  var t2 = (-b + sqrtD) / (2 * a);
  var t = t1 > 0 ? t1 : (t2 > 0 ? t2 : -1);
  if (t < 0) return { x: x1, y: y1 };
  return { x: x1 + t * dx, y: y1 + t * dy };
}

/**
 * clipEdge — Given two nodes and their center points, return the line segment
 * from the boundary of srcNode to the boundary of dstNode.
 * Nodes must have {x, y, w, h} properties.
 */
function clipEdge(srcNode, dstNode, srcCx, srcCy, dstCx, dstCy) {
  var start = intersectRect(srcCx, srcCy, dstCx, dstCy,
    srcNode.x - srcNode.w/2, srcNode.y - srcNode.h/2, srcNode.w, srcNode.h);
  var end   = intersectRect(dstCx, dstCy, srcCx, srcCy,
    dstNode.x - dstNode.w/2, dstNode.y - dstNode.h/2, dstNode.w, dstNode.h);
  if (!start || !end) return { x1: srcCx, y1: srcCy, x2: dstCx, y2: dstCy };
  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
}

// ---- Force-Directed Layout (Fruchterman-Reingold) --------------------------

/**
 * layoutForce(graph, opts) — Compute node positions using Fruchterman-Reingold.
 * Nodes repel each other (1/d²), edges act as springs (attraction ∝ d²/k).
 * Cooling schedule: temperature starts high and decays each iteration.
 *
 * Options (all optional):
 *   iterations: 100     — max iterations
 *   repulsion: 5000     — repulsion constant (higher = more spread)
 *   attraction: 0.01    — spring constant
 *   idealLength: 100    — natural spring length
 *   damping: 0.9        — velocity damping per iteration
 *   cooling: 0.95       — temperature cooling factor
 *   width: 800, height: 600 — bounding area
 *   seed: 42            — RNG seed for deterministic output
 * Returns a Layout with node positions (x, y center coords) and empty edge points.
 */
function layoutForce(graph, opts) {
  opts = opts || {};
  var iterations  = opts.iterations  || 100;
  var repulsion   = opts.repulsion   || 5000;
  var attraction  = opts.attraction  || 0.01;
  var idealLen    = opts.idealLength || 100;
  var damping     = opts.damping     || 0.9;
  var cooling     = opts.cooling     || 0.95;
  var width       = opts.width       || 800;
  var height      = opts.height      || 600;
  var seed        = opts.seed        || 42;

  // Simple LCG for deterministic jitter
  var rng = lcg(seed);

  var g = cloneGraph(graph);
  var n = g.nodes.length;
  if (n === 0) return g;
  var cx = width / 2, cy = height / 2;

  // Initialize positions randomly (seeded) around center
  var vel = [];
  for (var i = 0; i < n; i++) {
    g.nodes[i].x = cx + (rng() - 0.5) * 200;
    g.nodes[i].y = cy + (rng() - 0.5) * 200;
    vel[i] = { x: 0, y: 0 };
  }

  // Precomputed id-to-index map for O(1) lookup
  var idxMap = {};
  for (var i = 0; i < n; i++) idxMap[g.nodes[i].id] = i;

  var temp = 1.0;
  for (var iter = 0; iter < iterations; iter++) {
    // Repulsion: every node pair
    for (var i = 0; i < n; i++) {
      var disp = { x: 0, y: 0 };
      var ni = g.nodes[i];
      for (var j = 0; j < n; j++) {
        if (i === j) continue;
        var nj = g.nodes[j];
        var dx = ni.x - nj.x;
        var dy = ni.y - nj.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var force = repulsion / (dist * dist);
        disp.x += (dx / dist) * force;
        disp.y += (dy / dist) * force;
      }
      vel[i].x = (vel[i].x + disp.x) * damping;
      vel[i].y = (vel[i].y + disp.y) * damping;
    }

    // Attraction: edges as springs
    for (var e = 0; e < g.edges.length; e++) {
      var edge = g.edges[e];
      var si = idxMap[edge.source];
      var ti = idxMap[edge.target];
      if (si < 0 || ti < 0) continue;
      var ns = g.nodes[si], nt = g.nodes[ti];
      var dx = nt.x - ns.x;
      var dy = nt.y - ns.y;
      var dist = Math.sqrt(dx * dx + dy * dy) || 1;
      var force = attraction * (dist - idealLen);
      var fx = (dx / dist) * force;
      var fy = (dy / dist) * force;
      vel[si].x += fx;
      vel[si].y += fy;
      vel[ti].x -= fx;
      vel[ti].y -= fy;
    }

    // Apply velocities
    for (var i = 0; i < n; i++) {
      g.nodes[i].x += vel[i].x * temp;
      g.nodes[i].y += vel[i].y * temp;
      // Clamp to bounds
      g.nodes[i].x = Math.max(20, Math.min(width - 20, g.nodes[i].x));
      g.nodes[i].y = Math.max(20, Math.min(height - 20, g.nodes[i].y));
    }

    temp *= cooling;
  }

  // Initialize empty edge points (routing fills these later)
  for (var e = 0; e < g.edges.length; e++) {
    g.edges[e].points = [];
  }

  return g;
}

/** Simple LCG for deterministic seeded random number generation */
function lcg(seed) {
  var s = seed || 42;
  return function() {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

/** Build adjacency map: nodeId → set of connected node ids */
function buildEdgeMap(layout) {
  var map = {};
  for (var i = 0; i < layout.nodes.length; i++) {
    map[layout.nodes[i].id] = {};
  }
  for (var e = 0; e < layout.edges.length; e++) {
    var edge = layout.edges[e];
    if (map[edge.source] !== undefined) map[edge.source][edge.target] = true;
    if (map[edge.target] !== undefined) map[edge.target][edge.source] = true;
  }
  return map;
}

/** Find node index by id. Returns -1 if not found. */
function nodeIndex(layout, id) {
  for (var i = 0; i < layout.nodes.length; i++) {
    if (layout.nodes[i].id === id) return i;
  }
  return -1;
}

// ---- Sugiyama (Hierarchical Layer-based) Layout ----------------------------

/**
 * layoutSugiyama(graph, opts) — Place DAG nodes in horizontal layers.
 * 1. Assign layers via longest-path algorithm from sources
 * 2. Barycenter heuristic to reduce crossings between adjacent layers
 * 3. Assign x coordinates with even spacing
 *
 * Options: orientation ("TB"=top-bottom), layerSpacing (80), nodeSpacing (60)
 */
function layoutSugiyama(graph, opts) {
  opts = opts || {};
  var orientation  = opts.orientation  || 'TB';
  var layerSpacing = opts.layerSpacing || 80;
  var nodeSpacing  = opts.nodeSpacing  || 60;

  var g = cloneGraph(graph);
  var n = g.nodes.length;
  if (n === 0) return g;

  // Build adjacency and in-degree
  var adj = {}, indeg = {};
  for (var i = 0; i < n; i++) { adj[g.nodes[i].id] = []; indeg[g.nodes[i].id] = 0; }
  for (var e = 0; e < g.edges.length; e++) {
    var src = g.edges[e].source, tgt = g.edges[e].target;
    if (adj[src]) adj[src].push(tgt);
    indeg[tgt] = (indeg[tgt] || 0) + 1;
  }

  // Step 1: Layer assignment (longest-path from sources)
  var layer = {};
  var queue = [];
  for (var id in indeg) {
    if (indeg[id] === 0) { layer[id] = 0; queue.push(id); }
  }
  // If no sources (all cyclic), assign all to layer 0
  if (queue.length === 0) {
    for (var id in indeg) { layer[id] = 0; queue.push(id); }
  }
  while (queue.length > 0) {
    var u = queue.shift();
    var neighbors = adj[u] || [];
    for (var j = 0; j < neighbors.length; j++) {
      var v = neighbors[j];
      var newLayer = layer[u] + 1;
      if (layer[v] === undefined || newLayer > layer[v]) {
        layer[v] = newLayer;
      }
      indeg[v]--;
      if (indeg[v] === 0) queue.push(v);
    }
  }
  // Handle unreachable nodes
  for (var id in indeg) {
    if (layer[id] === undefined) layer[id] = 0;
  }

  // Step 2: Group nodes by layer
  var layers = [];
  for (var i = 0; i < n; i++) {
    var l = layer[g.nodes[i].id];
    if (!layers[l]) layers[l] = [];
    layers[l].push(i);
  }

  // Step 3: Barycenter heuristic — sweep left-to-right and right-to-left
  var positions = {};
  for (var l = 0; l < layers.length; l++) {
    for (var k = 0; k < layers[l].length; k++) {
      positions[layers[l][k]] = k;
    }
  }
  for (var sweep = 0; sweep < 3; sweep++) {
    for (var l = 1; l < layers.length; l++) {
      for (var k = 0; k < layers[l].length; k++) {
        var ni = layers[l][k];
        var nd = g.nodes[ni];
        var sumAbove = 0, count = 0;
        for (var e = 0; e < g.edges.length; e++) {
          if (g.edges[e].target === nd.id) {
            var si = nodeIndex(g, g.edges[e].source);
            if (si >= 0 && positions[si] !== undefined) { sumAbove += positions[si]; count++; }
          }
        }
        if (count > 0) positions[ni] = sumAbove / count;
      }
      layers[l].sort(function(a, b) { return (positions[a] || 0) - (positions[b] || 0); });
      for (var k = 0; k < layers[l].length; k++) positions[layers[l][k]] = k;
    }
  }

  // Step 4: Assign coordinates
  var maxLayerLen = 0;
  for (var l = 0; l < layers.length; l++) maxLayerLen = Math.max(maxLayerLen, layers[l].length);

  for (var l = 0; l < layers.length; l++) {
    var rowLen = layers[l].length;
    var startX = (maxLayerLen - rowLen) * nodeSpacing / 2;
    for (var k = 0; k < rowLen; k++) {
      var ni = layers[l][k];
      g.nodes[ni].x = startX + k * nodeSpacing + nodeSpacing / 2;
      g.nodes[ni].y = l * layerSpacing + DEFAULT_NODE_H / 2 + 20;
    }
  }

  for (var e = 0; e < g.edges.length; e++) g.edges[e].points = [];
  return g;
}

// ---- Circular Layout --------------------------------------------------------

/**
 * layoutCircular(graph, opts) — Place nodes evenly on a circle.
 * Uses greedy edge-crossing minimization to order nodes around the circle.
 *
 * Options: width (600), height (600), radius (auto), cx (auto), cy (auto)
 */
function layoutCircular(graph, opts) {
  opts = opts || {};
  var cw     = opts.width  || 600;
  var ch     = opts.height || 600;
  var radius = opts.radius || Math.min(cw, ch) * 0.4;
  var cx     = opts.cx || cw / 2;
  var cy     = opts.cy || ch / 2;

  var g = cloneGraph(graph);
  var n = g.nodes.length;
  if (n === 0) return g;

  // Greedy crossing minimization: insert nodes one at a time at best position
  var order = [0];
  for (var i = 1; i < n; i++) {
    var bestPos = 0, bestCross = Infinity;
    for (var pos = 0; pos <= order.length; pos++) {
      var test = order.slice(0, pos).concat([i]).concat(order.slice(pos));
      var cross = countCrossingsCircular(g, test);
      if (cross < bestCross) { bestCross = cross; bestPos = pos; }
    }
    order = order.slice(0, bestPos).concat([i]).concat(order.slice(bestPos));
  }

  // Place on circle, starting from top (-PI/2)
  for (var k = 0; k < n; k++) {
    var angle = (2 * Math.PI * k / n) - Math.PI / 2;
    g.nodes[order[k]].x = cx + Math.cos(angle) * radius;
    g.nodes[order[k]].y = cy + Math.sin(angle) * radius;
  }

  for (var e = 0; e < g.edges.length; e++) g.edges[e].points = [];
  return g;
}

/** Count edge crossings for a given circular node ordering */
function countCrossingsCircular(graph, order) {
  var n = order.length;
  var pos = {};
  for (var i = 0; i < n; i++) pos[graph.nodes[order[i]].id] = i;
  var cross = 0;
  for (var a = 0; a < graph.edges.length; a++) {
    for (var b = a + 1; b < graph.edges.length; b++) {
      var e1 = graph.edges[a], e2 = graph.edges[b];
      var s1 = pos[e1.source], t1 = pos[e1.target];
      var s2 = pos[e2.source], t2 = pos[e2.target];
      if (s1 === undefined || t1 === undefined || s2 === undefined || t2 === undefined) continue;
      if (s1 > t1) { var tmp = s1; s1 = t1; t1 = tmp; }
      if (s2 > t2) { var tmp = s2; s2 = t2; t2 = tmp; }
      if ((s1 < s2 && s2 < t1 && t1 < t2) || (s2 < s1 && s1 < t2 && t2 < t1)) cross++;
    }
  }
  return cross;
}

// ---- Tree Layout ------------------------------------------------------------

/**
 * layoutTree(graph, opts) — BFS-expand tree from root. Children centered under parent.
 * First node without incoming edges is root. If cycles, uses first node.
 *
 * Options: hSpacing (80), vSpacing (80), orientation ("TB")
 */
function layoutTree(graph, opts) {
  opts = opts || {};
  var hSpacing = opts.hSpacing || 80;
  var vSpacing = opts.vSpacing || 80;
  var orientation = opts.orientation || 'TB';

  var g = cloneGraph(graph);
  var n = g.nodes.length;
  if (n === 0) return g;

  // Find root: node with no incoming edges
  var hasParent = {};
  for (var i = 0; i < n; i++) hasParent[g.nodes[i].id] = false;
  for (var e = 0; e < g.edges.length; e++) hasParent[g.edges[e].target] = true;
  var rootId = g.nodes[0].id;
  for (var id in hasParent) { if (!hasParent[id]) { rootId = id; break; } }

  // Build children map
  var children = {};
  for (var i = 0; i < n; i++) children[g.nodes[i].id] = [];
  for (var e = 0; e < g.edges.length; e++) {
    if (children[g.edges[e].source]) children[g.edges[e].source].push(g.edges[e].target);
  }

  // BFS to get depth and parent info
  var depth = {};
  var parent = {};
  var order = [];  // nodes in BFS order
  var queue = [rootId];
  depth[rootId] = 0;
  parent[rootId] = null;
  var visited = {};
  visited[rootId] = true;
  while (queue.length > 0) {
    var u = queue.shift();
    order.push(u);
    var kids = children[u] || [];
    for (var j = 0; j < kids.length; j++) {
      var v = kids[j];
      if (!visited[v]) { visited[v] = true; depth[v] = depth[u] + 1; parent[v] = u; queue.push(v); }
    }
  }

  // Compute subtree leaf count for each node (bottom-up, reversed BFS order)
  var subtreeLeaves = {};
  for (var i = order.length - 1; i >= 0; i--) {
    var id = order[i];
    var kids = children[id] || [];
    if (kids.length === 0) {
      subtreeLeaves[id] = 1;  // leaf
    } else {
      var sum = 0;
      for (var j = 0; j < kids.length; j++) sum += (subtreeLeaves[kids[j]] || 1);
      subtreeLeaves[id] = sum;
    }
  }

  // Position nodes top-down: each parent centered over its children
  var xPos = {};
  // Calculate total width for root's subtree to initialize root at center
  var rootLeaves = subtreeLeaves[rootId] || 1;
  var totalWidth = rootLeaves * hSpacing;
  function assignPositions(nodeId, left, right) {
    xPos[nodeId] = (left + right) / 2;
    var kids = children[nodeId] || [];
    if (kids.length === 0) return;
    var totalLeaves = subtreeLeaves[nodeId];
    var width = right - left;
    var cursor = left;
    for (var j = 0; j < kids.length; j++) {
      var childLeaves = subtreeLeaves[kids[j]] || 1;
      var childWidth = width * childLeaves / totalLeaves;
      assignPositions(kids[j], cursor, cursor + childWidth);
      cursor += childWidth;
    }
  }
  assignPositions(rootId, -totalWidth / 2, totalWidth / 2);

  // Apply positions relative to root center
  for (var i = 0; i < n; i++) {
    var ni = nodeIndex(g, order[i]);
    if (ni >= 0) {
      g.nodes[ni].x = (xPos[order[i]] || 0);
      g.nodes[ni].y = (depth[order[i]] || 0) * vSpacing + DEFAULT_NODE_H / 2 + 20;
    }
  }

  // Find the min x to shift everything positive
  var minX = Infinity;
  for (var i = 0; i < n; i++) minX = Math.min(minX, g.nodes[i].x);
  if (minX < 0) {
    var offset = -minX + 40;
    for (var i = 0; i < n; i++) g.nodes[i].x += offset;
  }

  for (var e = 0; e < g.edges.length; e++) g.edges[e].points = [];
  return g;
}

// ---- Grid Layout ------------------------------------------------------------

/**
 * layoutGrid(graph, opts) — Arrange nodes in a row-column grid.
 *
 * Options: columns (4), cellW (150), cellH (100), startX (20), startY (20)
 */
function layoutGrid(graph, opts) {
  opts = opts || {};
  var cols   = opts.columns || 4;
  var cellW  = opts.cellW || 150;
  var cellH  = opts.cellH || 100;
  var startX = opts.startX || 20;
  var startY = opts.startY || 20;

  var g = cloneGraph(graph);
  for (var i = 0; i < g.nodes.length; i++) {
    var col = i % cols;
    var row = Math.floor(i / cols);
    g.nodes[i].x = startX + col * cellW + cellW / 2;
    g.nodes[i].y = startY + row * cellH + DEFAULT_NODE_H / 2;
  }

  for (var e = 0; e < g.edges.length; e++) g.edges[e].points = [];
  return g;
}

// ---- Edge Routing -----------------------------------------------------------

/**
 * routeStraight(layout) — Straight line segments, clipped to node boundaries.
 * Simplest routing. Sets each edge's points to [start, end] on boundaries.
 */
function routeStraight(layout) {
  for (var e = 0; e < layout.edges.length; e++) {
    var edge = layout.edges[e];
    var si = nodeIndex(layout, edge.source);
    var ti = nodeIndex(layout, edge.target);
    if (si < 0 || ti < 0) continue;
    var src = layout.nodes[si], dst = layout.nodes[ti];
    var clip = clipEdge(src, dst, src.x, src.y, dst.x, dst.y);
    edge.points = [{ x: clip.x1, y: clip.y1 }, { x: clip.x2, y: clip.y2 }];
  }
  return layout;
}

/**
 * routeOrthogonal(layout, opts) — L-shaped (orthogonal) edge routing.
 * Edges go: source → corner → target. Corner direction chosen by aspect ratio.
 * Clips endpoints to node boundaries.
 * Options: cornerOffset (20) — extra padding at corner
 */
function routeOrthogonal(layout, opts) {
  opts = opts || {};
  var cornerOffset = opts.cornerOffset || 20;

  for (var e = 0; e < layout.edges.length; e++) {
    var edge = layout.edges[e];
    var si = nodeIndex(layout, edge.source);
    var ti = nodeIndex(layout, edge.target);
    if (si < 0 || ti < 0) continue;
    var src = layout.nodes[si], dst = layout.nodes[ti];

    // Compute entry/exit boundary points using clipEdge
    var clip = clipEdge(src, dst, src.x, src.y, dst.x, dst.y);

    var dx = Math.abs(clip.x2 - clip.x1), dy = Math.abs(clip.y2 - clip.y1);
    var corner;
    if (dx > dy) {
      // More horizontal: go horizontal then vertical
      corner = { x: (clip.x1 + clip.x2) / 2, y: clip.y1 };
    } else {
      // More vertical: go vertical then horizontal
      corner = { x: clip.x1, y: (clip.y1 + clip.y2) / 2 };
    }

    edge.points = [
      { x: clip.x1, y: clip.y1 },
      { x: corner.x, y: corner.y },
      { x: clip.x2, y: clip.y2 }
    ];
  }
  return layout;
}

/**
 * routeBezier(layout, opts) — Cubic bezier curves, clipped to boundaries.
 * Generates smooth curves by placing control points offset from straight line.
 * Options: tension (0.3) — control point distance relative to edge length
 */
function routeBezier(layout, opts) {
  opts = opts || {};
  var tension = opts.tension || 0.3;

  for (var e = 0; e < layout.edges.length; e++) {
    var edge = layout.edges[e];
    var si = nodeIndex(layout, edge.source);
    var ti = nodeIndex(layout, edge.target);
    if (si < 0 || ti < 0) continue;
    var src = layout.nodes[si], dst = layout.nodes[ti];

    var clip = clipEdge(src, dst, src.x, src.y, dst.x, dst.y);
    var dx = clip.x2 - clip.x1, dy = clip.y2 - clip.y1;
    var dist = Math.sqrt(dx * dx + dy * dy) || 1;

    // Perpendicular offset for control points
    var perpX = -dy / dist * dist * tension;
    var perpY =  dx / dist * dist * tension;

    edge.points = [
      { x: clip.x1, y: clip.y1 },
      { x: clip.x1 + dx * 0.25 + perpX, y: clip.y1 + dy * 0.25 + perpY },
      { x: clip.x1 + dx * 0.75 - perpX, y: clip.y1 + dy * 0.75 - perpY },
      { x: clip.x2, y: clip.y2 }
    ];
  }
  return layout;
}

/**
 * routeAvoidNodes(layout, opts) — Reroute edges that pass through non-endpoint nodes.
 * Checks each straight edge against all intermediate nodes. If blocked, inserts detour waypoint.
 * Options: padding (10) — extra clearance around nodes
 */
function routeAvoidNodes(layout, opts) {
  opts = opts || {};
  var padding = opts.padding || 10;

  // First route straight to get initial points
  routeStraight(layout);

  for (var e = 0; e < layout.edges.length; e++) {
    var edge = layout.edges[e];
    var si = nodeIndex(layout, edge.source);
    var ti = nodeIndex(layout, edge.target);
    if (si < 0 || ti < 0) continue;
    if (!edge.points || edge.points.length < 2) continue;

    var p1 = edge.points[0], p2 = edge.points[edge.points.length - 1];

    // Check each intermediate node
    var waypoints = [p1];
    for (var n = 0; n < layout.nodes.length; n++) {
      if (n === si || n === ti) continue;
      var node = layout.nodes[n];
      var blocked = lineIntersectsRect(
        p1.x, p1.y, p2.x, p2.y,
        node.x - node.w/2 - padding, node.y - node.h/2 - padding,
        node.w + 2 * padding, node.h + 2 * padding
      );
      if (blocked) {
        // Detour waypoint: go to the right of the blocking node
        waypoints.push({ x: node.x + node.w/2 + padding + 20, y: node.y });
      }
    }
    waypoints.push(p2);
    edge.points = waypoints;
  }
  return layout;
}

/**
 * lineIntersectsRect — Check if line segment (x1,y1)-(x2,y2) intersects rectangle.
 * Uses Liang-Barsky algorithm. Returns true/false.
 */
function lineIntersectsRect(x1, y1, x2, y2, rx, ry, rw, rh) {
  var dx = x2 - x1, dy = y2 - y1;
  var p = [-dx, dx, -dy, dy];
  var q = [x1 - rx, rx + rw - x1, y1 - ry, ry + rh - y1];
  var u1 = 0, u2 = 1;
  for (var i = 0; i < 4; i++) {
    if (p[i] === 0) {
      if (q[i] < 0) return false;
      continue;
    }
    var t = q[i] / p[i];
    if (p[i] < 0) {
      if (t > u2) return false;
      if (t > u1) u1 = t;
    } else {
      if (t < u1) return false;
      if (t < u2) u2 = t;
    }
  }
  return u1 <= u2;
}

// ---- SVG Rendering ----------------------------------------------------------

/**
 * renderSVG(layout, opts) — Produce an SVG string for the layout.
 * Uses Acme design token CSS variables for colors.
 * Output is an inline <svg> block ready for innerHTML.
 *
 * Options:
 *   width, height        — SVG viewBox dimensions (default: auto-fit content)
 *   nodeFill             — CSS color for node fill (default: "var(--white)")
 *   nodeStroke           — CSS color for node border (default: "var(--gray-700)")
 *   edgeStroke           — CSS color for edge lines (default: "var(--gray-500)")
 *   nodeStrokeWidth      — node border width in px (default: 1.5)
 *   edgeStrokeWidth      — edge line width in px (default: 1.5)
 *   fontSize             — label font size in px (default: 11)
 *   showLabels           — show/hide node labels (default: true)
 *   nodeRadius           — node corner radius in px (default: 6)
 *   activeEdge           — edge index to highlight (default: -1)
 *   activeStroke         — highlight edge color (default: "var(--clay)")
 */
function renderSVG(layout, opts) {
  opts = opts || {};
  var width            = opts.width            || 0;
  var height           = opts.height           || 0;
  var nodeFill         = opts.nodeFill         || 'var(--white)';
  var nodeStroke       = opts.nodeStroke       || 'var(--gray-700)';
  var edgeStroke       = opts.edgeStroke       || 'var(--gray-500)';
  var nodeStrokeWidth  = opts.nodeStrokeWidth  || 1.5;
  var edgeStrokeWidth  = opts.edgeStrokeWidth  || 1.5;
  var fontSize         = opts.fontSize         || 11;
  var showLabels       = opts.showLabels !== false;
  var nodeRadius       = opts.nodeRadius       || 6;
  var activeEdge       = opts.activeEdge       || -1;

  // Acme color palette for node fills (cycling)
  var colors = ['var(--clay)', 'var(--olive)', 'var(--slate)', 'var(--rust)', 'var(--info)'];

  // Auto-size if not specified
  var maxX = 0, maxY = 0;
  for (var i = 0; i < layout.nodes.length; i++) {
    var n = layout.nodes[i];
    maxX = Math.max(maxX, n.x + n.w/2 + 20);
    maxY = Math.max(maxY, n.y + n.h/2 + 20);
  }
  // Also check edge points
  for (var e = 0; e < layout.edges.length; e++) {
    var pts = layout.edges[e].points;
    if (!pts) continue;
    for (var p = 0; p < pts.length; p++) {
      maxX = Math.max(maxX, pts[p].x + 10);
      maxY = Math.max(maxY, pts[p].y + 10);
    }
  }
  if (!width)  width  = Math.max(400, Math.ceil(maxX));
  if (!height) height = Math.max(300, Math.ceil(maxY));

  var parts = [];
  parts.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + width + ' ' + height + '" style="width:100%;height:auto;">');

  // Edges first (behind nodes)
  for (var e = 0; e < layout.edges.length; e++) {
    var edge = layout.edges[e];
    var pts = edge.points;
    if (!pts || pts.length < 2) continue;

    var strokeColor = (e === activeEdge) ? (opts.activeStroke || 'var(--clay)') : edgeStroke;
    var strokeW = (e === activeEdge) ? (edgeStrokeWidth * 1.5) : edgeStrokeWidth;

    if (pts.length === 2) {
      // Straight line
      parts.push('<line x1="' + fmt(pts[0].x) + '" y1="' + fmt(pts[0].y) + '" x2="' + fmt(pts[1].x) + '" y2="' + fmt(pts[1].y) + '" class="ln" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" stroke-linecap="round"/>');
    } else if (pts.length === 3) {
      // Orthogonal polyline (L-shaped)
      parts.push('<polyline points="' + fmt(pts[0].x) + ',' + fmt(pts[0].y) + ' ' + fmt(pts[1].x) + ',' + fmt(pts[1].y) + ' ' + fmt(pts[2].x) + ',' + fmt(pts[2].y) + '" class="ln" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>');
    } else if (pts.length === 4) {
      // Cubic bezier
      parts.push('<path d="M' + fmt(pts[0].x) + ',' + fmt(pts[0].y) + ' C' + fmt(pts[1].x) + ',' + fmt(pts[1].y) + ' ' + fmt(pts[2].x) + ',' + fmt(pts[2].y) + ' ' + fmt(pts[3].x) + ',' + fmt(pts[3].y) + '" class="ln" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" fill="none" stroke-linecap="round"/>');
    } else {
      // Multi-segment polyline
      var ps = [];
      for (var p = 0; p < pts.length; p++) ps.push(fmt(pts[p].x) + ',' + fmt(pts[p].y));
      parts.push('<polyline points="' + ps.join(' ') + '" class="ln" stroke="' + strokeColor + '" stroke-width="' + strokeW + '" fill="none" stroke-linecap="round" stroke-linejoin="round"/>');
    }

    // Edge label if present
    if (edge.label) {
      var midIdx = Math.floor(pts.length / 2);
      var mx = pts[midIdx].x, my = pts[midIdx].y;
      parts.push('<text x="' + fmt(mx) + '" y="' + fmt(my - 6) + '" text-anchor="middle" font-family="var(--mono)" font-size="' + (fontSize - 1) + 'px" fill="var(--gray-500)">' + escapeXml(edge.label) + '</text>');
    }
  }

  // Nodes on top
  for (var i = 0; i < layout.nodes.length; i++) {
    var node = layout.nodes[i];
    var fill = nodeFill;
    if (nodeFill === 'var(--white)') fill = 'var(--white)';
    var rx = node.x - node.w/2;
    var ry = node.y - node.h/2;
    var colorDot = colors[i % colors.length];

    parts.push('<g>');
    // Node rectangle
    parts.push('<rect x="' + fmt(rx) + '" y="' + fmt(ry) + '" width="' + fmt(node.w) + '" height="' + fmt(node.h) + '" rx="' + nodeRadius + '" class="wh" fill="var(--white)" stroke="' + nodeStroke + '" stroke-width="' + nodeStrokeWidth + '"/>');
    // Color indicator dot (left side)
    parts.push('<circle cx="' + fmt(rx + 12) + '" cy="' + fmt(node.y) + '" r="4" fill="' + colorDot + '"/>');

    if (showLabels && node.label) {
      var label = node.label.length > 24 ? node.label.substring(0, 22) + '...' : node.label;
      parts.push('<text x="' + fmt(node.x) + '" y="' + fmt(node.y + 4) + '" text-anchor="middle" font-family="var(--mono)" font-size="' + fontSize + 'px" fill="var(--gray-700)">' + escapeXml(label) + '</text>');
    }
    parts.push('</g>');
  }

  parts.push('</svg>');
  return parts.join('\n');
}

/** Format a number to 1 decimal place for SVG attributes */
function fmt(n) {
  return Math.round(n * 10) / 10;
}

/** Escape XML special characters */
function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
