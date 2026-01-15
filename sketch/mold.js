class Mold {
  constructor() {
    this.x = RENDER_W / 2;
    this.y = RENDER_H / 2;
    this.r = 0.1;

    this.heading = random(360);
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);
    this.rotAngle = 45;
    this.speedFactor = 0.2;

    this.rSensorPos = createVector(0, 0);
    this.lSensorPos = createVector(0, 0);
    this.fSensorPos = createVector(0, 0);
    this.sensorAngle = 45;
    this.sensorDist = 10;
  }

  update(targetGraphic) {
    this.vx = cos(this.heading) * this.speedFactor;
    this.vy = sin(this.heading) * this.speedFactor;

    this.x = (this.x + this.vx + RENDER_W) % RENDER_W;
    this.y = (this.y + this.vy + RENDER_H) % RENDER_H;

    if (latestValue > threshold) {
      let attractX = RENDER_W / 2 - this.x;
      let attractY = RENDER_H / 2 - this.y;

      let attractAngle = atan2(attractY, attractX);
      this.heading += (degrees(attractAngle) - this.heading) * 0.05;
    }

    this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle);
    this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle);
    this.getSensorPos(this.fSensorPos, this.heading);
    let pixels = targetGraphic.pixels;
    let index, l, r, f;
    index =
      4 * (d * floor(this.rSensorPos.y)) * (d * RENDER_W) +
      4 * (d * floor(this.rSensorPos.x));
    r = pixels[index];

    index =
      4 * (d * floor(this.lSensorPos.y)) * (d * RENDER_W) +
      4 * (d * floor(this.lSensorPos.x));
    l = pixels[index];

    index =
      4 * (d * floor(this.fSensorPos.y)) * (d * RENDER_W) +
      4 * (d * floor(this.fSensorPos.x));
    f = pixels[index];

    if (f > l && f > r) {
      this.heading += 0;
    } else if (f < l && f < r) {
      if (random(1) < 0.5) {
        this.heading += this.rotAngle;
      } else {
        this.heading -= this.rotAngle;
      }
    } else if (l > r) {
      this.heading += -this.rotAngle;
    } else if (r > l) {
      this.heading += this.rotAngle;
    }
  }

  display(targetGraphic) {
    targetGraphic.noStroke();
    targetGraphic.fill(0, 255, 255);
    targetGraphic.ellipse(this.x, this.y, this.r * 2, this.r * 5);
  }

  getSensorPos(sensor, angle) {
    sensor.x = (this.x + this.sensorDist * cos(angle) + RENDER_W) % RENDER_W;
    sensor.y = (this.y + this.sensorDist * sin(angle) + RENDER_H) % RENDER_H;
  }
}
/*
Tutorial by Patt Vira 
(p5.js Coding Tutorial | Slime Molds (Physarum)).
https://youtu.be/VyXxSNcgDtg?si=LSoKrSjQNJos-HrP
*/
