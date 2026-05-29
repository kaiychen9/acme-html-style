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
  var t = t1 > 0 ? t1 : t2;
  if (t <= 0) t = t1 > 0 ? t1 : t2;
  return { x: x1 + t * dx, y: y1 + t * dy };
}

/**
 * clipEdge — Given two nodes and their center points, return the line segment
 * from the boundary of srcNode to the boundary of dstNode.
 * Nodes must have {x, y, w, h} properties.
 */
function clipEdge(srcNode, dstNode, srcCx, srcCy, dstCx, dstCy) {
  var start = intersectRect(srcCx, srcCy, dstCx, dstCy, srcNode.x, srcNode.y, srcNode.w, srcNode.h);
  var end   = intersectRect(dstCx, dstCy, srcCx, srcCy, dstNode.x, dstNode.y, dstNode.w, dstNode.h);
  if (!start || !end) return { x1: srcCx, y1: srcCy, x2: dstCx, y2: dstCy };
  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
}
