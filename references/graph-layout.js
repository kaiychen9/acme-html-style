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
