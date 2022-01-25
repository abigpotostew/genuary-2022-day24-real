import p5 from 'p5';
import {PRNGRand} from "./random";
import {seaGen} from "./sea";


let chunks = []
var recorder;
const pixelDens = 1;
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


        shapes = seaGen(p5, 1000)
    }

    p5.mouseReleased = () => {
        shapes = seaGen(p5, 500)
        p5.loop()
    }

    p5.keyPressed = () => {
        if (p5.key === 'r') {
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


        p5.push()
        p5.background(10, 15, 39)

        const N = 1000;
        p5.noStroke();
        p5.fill(123,15,109);
        const h2 = p5.height/2
        for (let i = 0; i <N; i++) {
            p5.ellipse(p5.sb.random(0,p5.width),p5.sb.random( 0,h2),2,2)
        }
        p5.fill(201,190,10);
        for (let i = 0; i <N; i++) {
            p5.ellipse(p5.random(0,p5.width),p5.sb.random( 0,h2)+h2,2,2)
        }

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
