export default class ConnectingShape {
  constructor(c1, c2) {
    this.c1 = c1;
    this.c2 = c2;
  }

  getShapePoints(lines) {
    const points = [];
    lines.forEach((line) => {
      const points_circle1 = this.IntersectPointsOfLineCircle(
        line.a,
        line.b,
        line.c,
        this.c1.x,
        this.c1.y,
        this.c1.radius
      );
      const points_circle2 = this.IntersectPointsOfLineCircle(
        line.a,
        line.b,
        line.c,
        this.c2.x,
        this.c2.y,
        this.c2.radius
      );
      points.push({ x: points_circle1.x_1, y: points_circle1.y_1 });
      points.push({ x: points_circle2.x_1, y: points_circle2.y_1 });
    });
    return points;
  }

  draw(ctx) {
    const lines = this.common_tangent_line(
      this.c1.x,
      this.c1.y,
      this.c1.radius,
      this.c2.x,
      this.c2.y,
      this.c2.radius
    );

    // 2 lines to define a shape
    const points = this.getShapePoints(lines);
    ctx.strokeStyle = "red";
    ctx.fillStyle = "black";

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[0].x, points[0].y);
    ctx.fill();
    ctx.closePath();
  }

  common_tangent_line(x1, y1, r1, x2, y2, r2) {
    // Compute the common tangent line of two circles: (x1, y1) - r1 and (x2, y2) - r2
    // Return in the form of line equation: ax + by + c == 0
    let delta1 =
      (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) - (r1 + r2) * (r1 + r2);
    let delta2 =
      (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) - (r1 - r2) * (r1 - r2);
    let p1 = r1 * (x1 * x2 + y1 * y2 - x2 * x2 - y2 * y2);
    let p2 = r2 * (x1 * x1 + y1 * y1 - x1 * x2 - y1 * y2);
    let q = x1 * y2 - x2 * y1;
    let results = [];
    let p1C1, p1C2, p2C1, p2C2;

    if (delta2 >= 0) {
      let l21 = {
        a: (x2 - x1) * (r1 - r2) + (y1 - y2) * Math.sqrt(delta2),
        b: (y2 - y1) * (r1 - r2) + (x2 - x1) * Math.sqrt(delta2),
        c: p1 - p2 + q * Math.sqrt(delta2),
      };
      let l22 = {
        a: (x2 - x1) * (r1 - r2) - (y1 - y2) * Math.sqrt(delta2),
        b: (y2 - y1) * (r1 - r2) - (x2 - x1) * Math.sqrt(delta2),
        c: p1 - p2 - q * Math.sqrt(delta2),
      };
      results.push(l21);
      results.push(l22);
    }
    return results;
  }

  IntersectPointsOfLineCircle(a, b, c, xm, ym, r) {
    let x_1 = null; // x coordinate of first intersection point.
    let y_1 = null; // y coordinate of first intersection point.
    let x_2 = null; // x coordinate of second intersection point.
    let y_2 = null; // y coordinate of second intersection point.
    if (b == 0) {
      // The line is a vertical line
      let B = -2 * ym,
        C = xm * xm + ym * ym + (2 * xm * c) / a + (c * c) / (a * a) - r * r;
      let D = B * B - 4 * C;
      if (D < 0) {
        return;
      } // if no intersections, bail out
      x_1 = -c / a;
      y_1 = (-B + Math.sqrt(D)) / 2;
      if (D > 0) {
        // if ( D == 0 ) line is tangent to circle; only one touch point, ie. x2 = x1 and y2 = y1.
        x_2 = x_1;
        y_2 = (-B - Math.sqrt(D)) / 2;
      }
    } else {
      let A = (a * a) / (b * b) + 1,
        B = 2 * ((a * c) / (b * b) - xm + (a * ym) / b),
        C = xm * xm + ym * ym + (2 * ym * c) / b + (c * c) / (b * b) - r * r;
      let D = B * B - 4 * A * C;
      if (D < 0) {
        // return;
        D = 0; //!!!!!!!!!!!!
      } // if no intersections, bail out
      x_1 = (-B + Math.sqrt(D)) / (2 * A);
      y_1 = (-a / b) * x_1 - c / b;
      if (D > 0) {
        // if ( D == 0 ) line is tangent to circle; only one touch point, ie. x2 = x1 and y2 = y1.
        x_2 = (-B - Math.sqrt(D)) / (2 * A);
        y_2 = (-a / b) * x_2 - c / b;
      }
    }
    return { x_1, y_1, x_2, y_2 };
  }
}
