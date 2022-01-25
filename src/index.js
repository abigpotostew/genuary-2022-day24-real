import p5 from 'p5';
import {PRNGRand} from "./random";


let chunks = []
var recorder;
const pixelDens = 1;
const border = 35;
const sketch = p5 => {

    let colorScheme;
    let colorsArrayMap = new Map()
    let acceleration = 0;
    let velocity = 0
    let globalLineWidth = 30;

    let radius = 0.5;
    let colorFlipAllowed = false;

    const frate = 30 // frame rate
    const numFrames = 100 // num of frames to record
    let recording = false


    let keysDown = {}

    let castlesXML;

    let animateTime = 0; //0..1

    let shapes = [];

    p5.preload = () => {
        // castlesXML = p5.loadXML('./castles.svg');
    }
    p5.setup = () => {
        const canv = p5.createCanvas(800, 800);
        canv.parent('sketch')
        p5.pixelDensity(pixelDens)
        // p5.colorMode(p5.HSB)
        p5.sb = new PRNGRand(new Date().getMilliseconds())
        // colorScheme = new ColorScheme(p5)
        p5.noSmooth();
        p5.frameRate(24)
        p5.debugEnabled = false


    }

    p5.mouseReleased = () => {
        p5.loop()
    }

    p5.keyPressed = () => {
        if (p5.key === 'r') {
            return;//disable recording
            recording = !recording
            if (recording) {
                record()
            } else {
                exportVideo()
            }
        }

        if (p5.key === 's') {
            p5.saveCanvas('sketch-d6', 'png')
        }

        keysDown[p5.keyCode] = true
    }

    p5.keyReleased = () => {

        keysDown[p5.keyCode] = false

        if (p5.key === 'd') {
            p5.debugEnabled = !p5.debugEnabled
        }
    }

    p5.draw = () => {

        const pallettes = [
            ['#7D7C84', "#DBD56E", '#88AB75', "#2D93AD", '#DE8F6E'],
            ['#2D93AD', "#D9DBF1", '#DE8F6E', "#DDC67B", '#DE8F6E', '#1c5a6b']
        ]
        const p = pallettes[1]

        p5.push()
        p5.background(p[0])

        const N = 200;
        p5.noStroke();
        p5.stroke(p[1]);
        p5.fill(p[2]);
        p5.strokeWeight(8);

        function colorAlpha(aColor, alpha) {
            var c = p5.color(aColor);
            return p5.color('rgba(' + [p5.red(c), p5.green(c), p5.blue(c), alpha].join(',') + ')');
        }

        const shadowColor = colorAlpha(p[5], .65)

        const boundsW = p5.width - border * 2
        const boundsH = p5.height - border * 2
        const h2 = boundsH / 2
        const shapeSizeMin = p5.width * 0.0175
        const shapeSizeMax = shapeSizeMin * 3
        for (let i = 0; i < N; i++) {
            const x = p5.sb.random(0, boundsW) + border
            const y = p5.sb.random(h2) + border
            const rs = p5.sb.random()
            const r = rs * (shapeSizeMax - shapeSizeMin) + shapeSizeMin
            const arc = p5.sb.random((p5.PI + p5.QUARTER_PI) * .8, (p5.PI + p5.QUARTER_PI) * 1.2)
            // p5.curveVertex(x,y)
            // p5.ellipse(x,y,2,2)
            // p5.beginShape()
            const rot = p5.PI * .6 + (p5.sb.random() - p5.sb.random()) + p5.QUARTER_PI * .6
            p5.push()
            p5.translate(x + 4 * rs + 1, y + 4 * rs + 1)
            p5.rotate(rot)
            p5.fill(shadowColor)
            p5.stroke(shadowColor)
            p5.arc(0, 0, r, r, 0, arc, p5.OPEN);
            p5.pop()

            p5.push()
            p5.translate(x, y)
            p5.rotate(rot)
            p5.arc(0, 0, r, r, 0, arc, p5.OPEN);
            p5.pop()

        }
        // p5.endShape(p5.CLOSE)
        p5.curveTightness(0);

        p5.stroke(p[3]);
        p5.fill(p[4]);
        // p5.beginShape()

        for (let i = 0; i < N; i++) {
            const x = p5.random() * boundsW + border
            const y = p5.random() * h2 + h2 + border
            const rs = p5.random()
            const r = rs * (shapeSizeMax - shapeSizeMin) + shapeSizeMin
            const arc = p5.sb.random((p5.PI + p5.QUARTER_PI) * .8, (p5.PI + p5.QUARTER_PI) * 1.2)
            const rot = p5.PI * .6 + (p5.sb.random() - p5.sb.random()) + p5.QUARTER_PI * .6
            p5.push()
            p5.translate(x + 4 * rs + 1, y + 4 * rs + 1)
            p5.rotate(rot)
            p5.fill(shadowColor)
            p5.stroke(shadowColor)
            p5.arc(0, 0, r, r, 0, arc, p5.OPEN);
            p5.pop()

            p5.push()
            p5.translate(x, y)
            p5.rotate(rot)
            p5.arc(0, 0, r, r, 0, arc, p5.OPEN);
            p5.pop()
        }
        // p5.endShape()

        p5.noFill()
        p5.stroke(0)
        p5.strokeWeight(border)
        p5.rect(0, 0, p5.width, p5.height)

        p5.noLoop();

    }
    // var recorder=null;
    const record = () => {
        chunks.length = 0;
        let stream = document.querySelector('canvas').captureStream(30)
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            if (e.data.size) {
                chunks.push(e.data);
            }
        };
        recorder.start();

    }

    const exportVideo = (e) => {
        recorder.stop();

        setTimeout(() => {
            var blob = new Blob(chunks);
            var vid = document.createElement('video');
            vid.id = 'recorded'
            vid.controls = true;
            vid.src = URL.createObjectURL(blob);
            document.body.appendChild(vid);
            vid.play();
        }, 1000)
    }
}


new p5(sketch);
