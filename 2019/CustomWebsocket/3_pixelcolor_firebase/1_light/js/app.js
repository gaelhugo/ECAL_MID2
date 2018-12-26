'use strict';

let scene, renderer, cnv;

//getAverageColor
let color;
const fac = new FastAverageColor();
let divDetected;
let precision = 1; //0 is the most precise. Can to infinite

//VALUES
let mouseX = 0;
let mouseY = 0;

//LIGHTS
let mainLight;
let secondLight;

//SHAPES
let player1;

let rect1;
let rect2;

//OBSTACLE MOVING & MORE
let vRect1 = -1;
let vRect2 = 1;

//FIREBASE
let database = firebase.database();
let player;

//DATAS GOT FROM PLAYER
let playerPosX = 0;
let playerPosY = 0;

function init() {
    divDetected = document.getElementById("detected");

    // Get html canvas element
    cnv = document.getElementById("canvas"); //context is "experimental-webgl"
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;

    // Initialise the scene
    scene = new LE.Scene();

    // Create lights and polygons
    mainLight = new LE.DirectionalLight({
        x: 0,
        y: 0,
        rotation: 0,
        range: 20,
        intensity: 1,
        colour: new LE.Colour(55, 35, 13, 255),
        shader: LE.LightShaders.POINT_LIGHT
    });
    secondLight = new LE.DirectionalLight({
        x: 0,
        y: 0,
        rotation: 2,
        range: 20,
        intensity: 1,
        colour: new LE.Colour(50, 50, 50, 255),
        shader: LE.LightShaders.POINT_LIGHT
    });
    player1 = new LE.Polygon({
        x: cnv.width / 1.1,
        y: cnv.height / 3,
        vertices: LE.Vertices.rectangle(40, 40),
        colour: new LE.Colour(50, 0, 80, 255)
    });
    rect1 = new LE.Polygon({
        x: cnv.width / 2.5,
        y: cnv.height / 1.2,
        vertices: LE.Vertices.rectangle(20, 150),
        colour: new LE.Colour(0, 0, 0, 255)
    });
    rect2 = new LE.Polygon({
        x: cnv.width / 1.5,
        y: cnv.height / 3,
        vertices: LE.Vertices.rectangle(20, 150),
        colour: new LE.Colour(0, 0, 0, 255)
    });

    // Add lights and polygon to the scene
    scene.addLight(mainLight);
    scene.addLight(secondLight);
    scene.addShadowObject(player1);
    scene.addShadowObject(rect1);
    scene.addShadowObject(rect2);

    // Finally initialise the renderer with the canvas and scene
    renderer = new LE.WebGLRenderer({
        canvas: cnv,
        scene: scene
    });
    
    // Start the loop
    update();

    //FIREBASE
    user();
    listen();
}

function update() {
    render();
    requestAnimationFrame(update);

    mainLight.x = mouseX;
    mainLight.y = mouseY;
    secondLight.x = mouseX;
    secondLight.y = mouseY;


    //DETECT IF THE PLAYER IS LIT OR NOT
    color = fac.getColor(cnv, {
        mode: "precision",
        left: player1.x - 1,
        top: (window.innerHeight - player1.y - player1.centerPoint.y * 2) - 1,
        width: player1.centerPoint.x * 2 + 2,
        height: player1.centerPoint.y * 2 + 2
    });
    //console.log(color);
    if (color.hex != "#30004b" && color.hex != "#30004c" && color.hex != "#31004c") {
        divDetected.style.display = "block";
    } else {
        divDetected.style.display = "none";
    }

    player1.y = playerPosY;
    player1.x = playerPosX;
    //console.log(paddleY);

    //MOVING RECT1
    if (rect1.y > window.innerHeight - rect1.centerPoint.y * 2) { //Top limit
        vRect1 = -1;
    }
    if (rect1.y < window.innerHeight / 2) { //bottom limit
        vRect1 = 1;
    }
    rect1.y = rect1.y + vRect1;

    //MOVING RECT2
    if (rect2.y > window.innerHeight / 1.5 - rect2.centerPoint.y * 2) { //Top limit
        vRect2 = -1;
    }
    if (rect2.y < window.innerHeight / 3) { //bottom limit
        vRect2 = 1;
    }
    rect2.y = rect2.y + vRect2;

}

function render() {
    renderer.clear();
    renderer.render();
}

function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = map(event.clientY, cnv.height, 0, 0, cnv.height);
    
    //FIREBASE SENDING DATAS TO PLAYER
    send('LIGHT', {
        'x': mouseX,
        'y': mouseY
    });
}

function map(v, a, b, x, y) {
    return (v == a) ? x : (v - a) * (y - x) / (b - a) + x;
}
//FIREBASE
function user() {
    database.ref('USER').on(
        'value', (function (snapshot) {
            if ((snapshot.val() == null || snapshot.val().data == 2 || snapshot.val().data == 3) && player == null) {
                // initialise le joueur 1
                console.log('YOU ARE PLAYER 1');
                player = 1;
                send('USER', 1);
            } else if (snapshot.val().data == 1 && player == null) {
                //initialise le joueur 2
                console.log('YOU ARE PLAYER 2');
                player = 2;
                send('USER', 2);
            }
        }));
}

function listen() {
    //changement dans l’entrée POS de la db
    database.ref("PLAYER").on('value', function (snapshot) {
        if (snapshot.val()) {
            let playerDatas = snapshot.val().data;

            if (player != playerDatas.player) {
                playerPosX = playerDatas.x;
                playerPosY = playerDatas.y;
            }
        }
    });
}

function send(path, _data) {
    var json = {
        'data': _data
    };
    database.ref(path).set(json);
}

document.addEventListener('mousemove', onMouseMove);
