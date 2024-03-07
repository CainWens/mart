import { MathUtils, Vector2, Vector3, CatmullRomCurve3 } from "https://esm.sh/three";
import * as TWEEN from "https://esm.sh/three/addons/libs/tween.module.js";

let uY = (val) => cnv.height * 0.01 * val;
let uX = (val) => cnv.width * 0.01 * val;

function resize() {
    cnv.width = innerWidth;
    cnv.height = innerHeight;
}
resize();
window.addEventListener("resize", (event) => {
    resize();
});

let ctx = cnv.getContext("2d");

class Tulip {
    constructor() {
        this.rotation = 0;
        this.lengthScale = 1;
        this.position = new Vector2();
        this.flowerParams = {
            width: 20,
            height: 20,
            curve: {
                start: { x: 5, y: 10 },
                end: { x: 5, y: 2 }
            },
            tip: {
                width: 5,
                height: 5
            }
        };

        this.borderData = [
            {
                color: "#f8f",
                thickness: 2
            },
            {
                color: "#fe8",
                thickness: 1
            }
        ];
        this.color = "#d04";

        this.growth = 0;
        this.canDraw = false;

        this.mediators = {
            c: new Vector2(),
            v: new Vector2(),
            contourPoints: Array.from(
                {
                    length: 10
                },
                () => {
                    return new Vector2();
                }
            )
        };
    }

    draw() {
        if (!this.canDraw) return;

        let m = this.mediators;
        let c = m.c;
        let cp = m.contourPoints;

        ctx.fillStyle = this.color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        let fp = this.flowerParams;
        cp[0].set(fp.tip.width, fp.height);
        cp[1].set(fp.curve.start.x, fp.height - fp.curve.start.y);
        cp[2].set(fp.width - fp.curve.end.x, fp.curve.end.y);
        cp[3].set(0, 0);
        cp[4].set(-(fp.width - fp.curve.end.x), fp.curve.end.y);
        cp[5].set(-fp.curve.start.x, fp.height - fp.curve.start.y);
        cp[6].set(-fp.tip.width, fp.height);
        cp[7].set(-fp.tip.width * 0.3, fp.height - fp.tip.height);
        cp[8].set(0, fp.height);
        cp[9].set(fp.tip.width * 0.3, fp.height - fp.tip.height);
        //console.log(cp);
        cp.forEach((cpv) => {
            cpv.y *= -1 * this.lengthScale;
            cpv
                .multiplyScalar(uY(1) * 0.75 * this.growth)
                .addScaledVector(this.position, uY(1))
                .rotateAround(c, this.rotation);
        });

        ctx.beginPath();
        ctx.moveTo(cp[0].x, cp[0].y);
        ctx.bezierCurveTo(cp[1].x, cp[1].y, cp[2].x, cp[2].y, cp[3].x, cp[3].y);
        ctx.bezierCurveTo(cp[4].x, cp[4].y, cp[5].x, cp[5].y, cp[6].x, cp[6].y);
        ctx.lineTo(cp[7].x, cp[7].y);
        ctx.lineTo(cp[8].x, cp[8].y);
        ctx.lineTo(cp[9].x, cp[9].y);
        ctx.closePath();

        this.borderData.forEach((bd) => {
            ctx.strokeStyle = bd.color;
            ctx.lineWidth = uY(bd.thickness);
            ctx.stroke();
        });
        ctx.fill();
    }
}

class Tulips {
    constructor() {
        this.position = new Vector2().set(30, 30); //relative to center
        this.rotation = -Math.PI * 0.15;
        this.tulipsData = [
            {
                rotation: 0,
                rotationTween: 0.05 * Math.PI,
                lengthScale: 1.25,
                heightShift: -1.5
            },
            {
                rotation: Math.PI * 0.125,
                rotationTween: 0,
                lengthScale: 1.1,
                heightShift: 0
            },
            {
                rotation: Math.PI * -0.125,
                rotationTween: 0,
                lengthScale: 1,
                heightShift: 0
            }
        ];
        this.tulips = Array.from({ length: this.tulipsData.length }, () => {
            return new Tulip();
        });

        this.sequence();
    }

    sequence() {
        let duration = 1000;
        let delay = 11000;

        new TWEEN.Tween({ val: 0 })
            .to({ val: 1 }, duration * 0.5)
            .delay(delay)
            .easing(TWEEN.Easing.Exponential.Out)
            .onStart(() => {
                this.tulips.forEach((tulip) => {
                    tulip.canDraw = true;
                });
            })
            .onUpdate((val) => {
                this.tulips.forEach((tulip) => {
                    tulip.growth = val.val;
                });
            })
            .start();

        new TWEEN.Tween({ val: 0 })
            .to({ val: 1 }, duration)
            .delay(delay + 500)
            .easing(TWEEN.Easing.Bounce.Out)
            .onUpdate((val) => {
                this.rotation = -Math.PI * 0.15 - val.val * Math.PI * 0.1;
                this.tulipsData[0].rotationTween = (1 - val.val) * 0.05 * Math.PI;
            })
            .start();
    }

    draw() {
        ctx.save();
        ctx.translate(uX(50) - uY(this.position.x), uY(50) - uY(this.position.y));
        this.tulips.forEach((tulip, idx) => {
            let td = this.tulipsData[idx];
            tulip.position.y = td.heightShift;
            tulip.rotation = this.rotation + td.rotation + td.rotationTween;
            tulip.lengthScale = this.tulipsData[idx].lengthScale;
            tulip.draw();
        });
        ctx.restore();
    }
}

class Background {
    constructor() {
        this.stripes = ["#f44", "#f66", "#f88"];
        this.stripeWidth = 15;
        this.shear = 5;
    }

    draw() {
        let hX = uX(50);
        let hY = uY(50);
        ctx.save();
        ctx.fillStyle = "#d88";
        ctx.fillRect(0, 0, cnv.width, cnv.height);

        ctx.save();
        ctx.translate(hX, hY);
        let valBack = 43;
        ctx.fillStyle = "#eaa";
        ctx.beginPath();
        ctx.roundRect(
            -uY(valBack),
            -uY(valBack),
            uY(valBack * 2),
            uY(valBack * 2),
            uY(13)
        );
        ctx.fill();
        ctx.restore();

        this.stripes.forEach((stripe, stripeIdx, arr) => {
            ctx.lineWidth = uY(this.stripeWidth);
            ctx.strokeStyle = stripe;
            ctx.beginPath();
            let xPos = uY((-(arr.length - 1) * 0.5 + stripeIdx) * this.stripeWidth);
            ctx.moveTo(hX - xPos + uY(this.shear), -uY(this.shear));
            ctx.lineTo(hX - xPos - uY(this.shear), uY(100 + this.shear));
            ctx.stroke();
        });

        ctx.translate(hX, hY);
        ctx.lineWidth = uY(1);
        ctx.beginPath();
        let val = 40;
        ctx.roundRect(-uY(val), -uY(val), uY(val * 2), uY(val * 2), uY(10));
        ctx.strokeStyle = "#848";
        ctx.fillStyle = "hsla(270, 100%, 25%, 0.75)";
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}

class Flower {
    constructor(flowers, sampleRatio) {
        this.flowers = flowers;
        this.sampleRatio = sampleRatio;
        this.position = new Vector2();
        this.rotation = Math.random() * Math.PI * 2;
        this.size = 5;
        this.hasOutline = true;

        this.apexSize = 1;

        this.color = 0;
        this.l = 0;
        this.a = 1;

        let maxPetals = 9;
        this.petals = MathUtils.randInt(5, maxPetals);
        this.petalsVariations = new Array(maxPetals).fill(0);
        this.petalAngle = (Math.PI * 2) / this.petals;
        this.petalContour = [
            new Vector2(),
            new Vector2(),
            new Vector2(),
            new Vector2(0, 1)
        ];
        this.petalContoirFlip = [1, 2];
        this.setPetalContour();

        this.growth = 1;

        this.mediators = {
            center: new Vector2(),
            petalContour: Array.from(
                {
                    length: 6
                },
                () => {
                    return new Vector2();
                }
            )
        };

        this.setInitVals();
        this.animation = (delay) => {
            new TWEEN.Tween({
                val: 0
            })
                .to(
                    {
                        val: 1
                    },
                    Math.random() * 2000 + 2000
                )
                .delay(delay)
                .onUpdate((val) => {
                    //console.log(val)
                    let aVal =
                        MathUtils.smoothstep(val.val, 0, 0.25) -
                        MathUtils.smoothstep(val.val, 0.875, 1);
                    let gVal = MathUtils.smoothstep(val.val, 0, 0.25);
                    this.a = aVal;
                    this.growth = gVal;
                })
                .onComplete(() => {
                    this.setInitVals();
                    this.setPetalContour();
                    this.flowers.renderList = this.flowers.renderList.filter(
                        (item) => item != this.id
                    );
                    this.flowers.renderList.push(this.id);
                    this.flowers.sample(Math.random(), this.position);
                    this.animation(Math.random() * 500);
                })
                .start();
        };
    }

    setPetalContour() {
        this.petalContour[1].random();
        this.petalContour[1].x *= 0.5;
        this.petalContour[2].random();
        this.petalContour[2].x *= 0.5;
        this.petalContour[2].y = 1 + (Math.random() - 0.5);
    }

    setInitVals() {
        this.size = MathUtils.randInt(2, 4);
        this.petals = MathUtils.randInt(5, 9);
        this.petalsVariations.forEach((_, idx) => {
            this.petalsVariations[idx] = 1 - Math.random() * 0.15;
        });
        this.petalAngle = (Math.PI * 2) / this.petals;
        this.color =
            this.flowers.palette[
                MathUtils.randInt(0, this.flowers.palette.length - 1)
                ] +
            (Math.random() - 0.5) * 10;
        this.hasOutline = Math.random() < 0.5;
        this.growth = 0;
        this.a = 0;
        this.l = Math.random() < 0.5 ? -25 : 25;
    }

    draw() {
        let m = this.mediators;
        ctx.fillStyle = `hsla(${this.color}, 100%, 50%, ${this.a})`;
        ctx.strokeStyle = `hsla(${this.color}, 75%, ${67.25 + this.l}%, ${this.a})`;
        ctx.lineWidth = uY(0.5);
        ctx.lineJoin = "round";
        ctx.beginPath();
        for (let i = 0; i < this.petals; i++) {
            let angle = this.petalAngle * i;
            let mpc = m.petalContour;

            mpc[0].copy(this.petalContour[0]);
            mpc[1].copy(this.petalContour[1]);
            mpc[2].copy(this.petalContour[2]);
            mpc[3].copy(this.petalContour[3]);
            mpc[4].copy(this.petalContour[2]);
            mpc[4].x *= -1;
            mpc[5].copy(this.petalContour[1]);
            mpc[5].x *= -1;

            mpc.forEach((v) => {
                v.y *= this.petalsVariations[i];
                v.rotateAround(m.center, angle + this.rotation)
                    .multiplyScalar(this.size * this.growth)
                    .add(this.position)
                    .multiplyScalar(uY(1));
            });
            //console.log(mpc);

            ctx.moveTo(mpc[0].x, mpc[0].y);
            ctx.bezierCurveTo(
                mpc[1].x,
                mpc[1].y,
                mpc[2].x,
                mpc[2].y,
                mpc[3].x,
                mpc[3].y
            );
            ctx.bezierCurveTo(
                mpc[4].x,
                mpc[4].y,
                mpc[5].x,
                mpc[5].y,
                mpc[0].x,
                mpc[0].y
            );
        }
        ctx.fill();
        if (this.hasOutline) {
            ctx.stroke();
        }

        // apex
        ctx.fillStyle = `hsla(60, 100%, 50%, ${this.a})`;
        ctx.strokeStyle = `hsla(39, 100%, 50%, ${this.a})`;
        ctx.beginPath();
        ctx.arc(
            uY(this.position.x),
            uY(this.position.y),
            uY(this.apexSize * this.growth),
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();
    }
}

class Flowers {
    constructor(amount) {
        this.amount = amount;
        this.flowers = [];
        this.renderList = [];

        this.palette = [0, 60, 300];

        this.curve = new CatmullRomCurve3(
            [
                [-0.05, 0.1],
                [-0.2, 0.33],
                [0, 0.5],
                [0.2, 0.33],
                [0, 0.06],
                [-0.25, -0.25],
                [0, -0.5],
                [0.25, -0.25],
                [0.05, -0]
            ].map((p) => {
                return new Vector3(p[0], -p[1], 0).multiplyScalar(75);
            }),
            false,
            "catmullrom",
            1
        );

        this.mediators = {
            pos: new Vector3(),
            tan: new Vector3(),
            nor: new Vector3()
        };

        this.init();
        this.startAnimation();
    }

    startAnimation() {
        this.flowers.forEach((f) => {
            //console.log(f.sampleRatio);
            f.animation(f.sampleRatio * 2000);
        });
    }

    init() {
        this.flowers = [];
        for (let i = 0; i < this.amount; i++) {
            let sampleRatio = (i + 1) / this.amount;
            let flower = new Flower(this, sampleRatio);
            flower.id = i;
            this.sample(sampleRatio, flower.position);
            this.flowers.push(flower);
            this.renderList.push(i);
        }
    }

    sample(val, pos) {
        let m = this.mediators;
        this.curve.getPointAt(val, m.pos);
        this.curve.getTangentAt(val, m.tan);
        m.nor.set(-m.tan.y, m.tan.x, 0).multiplyScalar((Math.random() - 0.5) * 10);
        //console.log(m.tan);
        m.pos.add(m.nor);
        pos.set(m.pos.x, m.pos.y);
    }

    draw() {
        this.renderList.forEach((f) => {
            this.flowers[f].draw();
        });
    }
}

class Writing {
    constructor() {
        this.strokes = [
            {
                color: "#f8f",
                thickness: 5
            },
            {
                color: "#fe8",
                thickness: 3
            },
            {
                color: "#d04",
                thickness: 1.25
            }
        ];

        this.points = [];

        this.canDraw = false;
        this.action = { val: 0 };

        this.init();
        this.sequence();
    }

    init() {
        let shiftA = 55;
        let shiftR = 95;
        let shiftT = 130;
        let shiftA2 = 170;
        let c = new Vector2();
        this.points = [
            //М
            [-5, 10],
            [0, 0],
            [10, 10],
            [15, 100],
            [20, 90],
            [20, 0],
            [25, 0],
            [40, 90],
            [40, 80],
            [40, 0],
            [51, 0],
            //а
            [shiftA + 30, 35],
            [shiftA + 15, 45],
            [shiftA + 5, 35], //
            [shiftA + 5, 0],
            [shiftA + 16, 0],
            [shiftA + 25, 30],
            [shiftA + 25, 29],
            [shiftA + 25, 0],
            [shiftA + 30, 0],
            //р
            [shiftR + 0, 40],
            [shiftR + 1, 40],
            [shiftR + 0, -50],
            [shiftR + 0, -51],
            [shiftR - 5, 0],
            [shiftR + 17, 40],
            [shiftR + 20, 40],
            [shiftR + 20, 0],
            [shiftR + 25, 0],
            //т
            [shiftT + 0, 40],
            [shiftT + 0, 41],
            [shiftT + 0, 0],
            [shiftT + 0, -1],
            [shiftT - 5, 15],

            [shiftT + 15, 40],
            [shiftT + 16, 40],
            [shiftT + 16, 0],
            [shiftT + 15, 0],
            [shiftT + 10, 15],

            [shiftT + 30, 40],
            [shiftT + 31, 40],
            [shiftT + 31, 0],
            [shiftT + 32, 0],
            //a2
            [shiftA2 + 30, 35],
            [shiftA2 + 15, 45],
            [shiftA2 + 5, 35],
            [shiftA2 + 5, 0],
            [shiftA2 + 16, 0],
            [shiftA2 + 25, 30],
            [shiftA2 + 25, 29],
            [shiftA2 + 25, 0],
            [shiftA2 + 30, 0],

            [shiftA2 + 35, 15]
        ].map((p) => {
            return new Vector2(p[0] + p[1] * 0.4, -p[1] * 0.9)
                .multiplyScalar(0.3)
                .rotateAround(c, MathUtils.degToRad(-15));
        });
        //console.log("control points " + this.points.length);
    }

    sequence() {
        new TWEEN.Tween(this.action)
            .to({ val: 396 }, 6000)
            .delay(4000)
            .onStart(() => {
                this.canDraw = true;
            })
            .start();
    }

    draw() {
        if (!this.canDraw) return;

        ctx.lineCap = "round";

        let points = this.points;

        ctx.setLineDash([uY(this.action.val), uY(500)]);

        ctx.beginPath();
        ctx.moveTo(uY(points[0].x), uY(points[0].y));

        for (let i = 1; i < points.length - 1; i++) {
            const xc = (uY(points[i].x) + uY(points[i + 1].x)) / 2;
            const yc = (uY(points[i].y) + uY(points[i + 1].y)) / 2;
            ctx.quadraticCurveTo(uY(points[i].x), uY(points[i].y), xc, yc);
        }

        // Connect the last two points with a straight line
        ctx.lineTo(
            uY(points[points.length - 1].x),
            uY(points[points.length - 1].y)
        );

        // stroke
        this.strokes.forEach((s) => {
            ctx.strokeStyle = s.color;
            ctx.lineWidth = uY(s.thickness);
            ctx.stroke();
        });

        // points
        if (!!0) {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            let pr = 1;
            ctx.lineWidth = uY(0.5);
            ctx.beginPath();
            this.points.forEach((p) => {
                ctx.moveTo(uY(p.x + pr), uY(p.y));
                ctx.arc(uY(p.x), uY(p.y), uY(pr), 0, Math.PI * 2);
            });
            ctx.fill();
            ctx.stroke();
        }
    }
}

let background = new Background();
let tulips = new Tulips();
let flowers = new Flowers(369);
let writing = new Writing();

draw();

function draw() {
    requestAnimationFrame(draw);

    TWEEN.update();

    background.draw();

    tulips.draw();

    ctx.save();
    ctx.translate(uX(50), uY(50));
    flowers.draw();
    ctx.restore();

    ctx.save();
    ctx.translate(uX(50) - uY(20), uY(90));
    writing.draw();
    ctx.restore();
}
