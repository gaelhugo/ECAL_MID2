'use strict';

let scene, renderer, cnv;

// getAverageColor
let color;
const fac = new FastAverageColor();
let divDetected;
let precision = 1;  // 0 is the most precise. Can to infinite

let r_source, g_source, b_source;
let firstColorCheck = true;

// LIGHTS
let mainLight;
let secondLight;

// SHAPES
let player1;

let rect1;
let rect2;

// KEYBOARD CONTROLS
let topPressed = false;
let bottomPressed = false;
let leftPressed = false;
let rightPressed = false;
let paddleY = 0;
let paddleX = 0;

// OBSTACLE MOVING & MORE
let vRect1 = -1;
let vRect2 = 1;

// FIREBASE
let database = firebase.database();
let player;

// DATAS GOT FROM LIGHT
let lightPosX = 0;
let lightPosY = window.innerHeight;

let ww_light = 0;
let wh_light = 0;

// Websocket OPTION
let CONNECTION = null;

function init() {
  CONNECTION = new SocketConnection();
  divDetected = document.getElementById('detected');
  // Get html canvas element
  cnv = document.getElementById('canvas');  // context is "experimental-webgl"
  cnv.width = window.innerWidth;
  cnv.height = window.innerHeight;

  // Initialise the scene
  scene = new LE.Scene();

  // Create lights and polygons
  mainLight = new LE.DirectionalLight({
    x: 0,
    y: window.innerHeight,
    rotation: 0,
    range: (180 -
            (2 * (Math.atan(window.innerWidth / window.innerHeight)) * 180 /
             Math.PI)) /
        2,
    intensity: 1,
    // colour: new LE.Colour(55, 35, 13, 255),
    colour: new LE.Colour(255, 255, 255, 255),
    shader: LE.LightShaders.POINT_LIGHT
  });
  secondLight = new LE.DirectionalLight({
    x: 0,
    y: window.innerHeight,
    rotation: 2,
    range:
        (180 -
         (2 * (Math.atan(window.innerWidth * 1.1 / window.innerHeight * 1.1)) *
          180 / Math.PI)) /
        2,
    intensity: 1,
    colour: new LE.Colour(50, 50, 50, 255),
    shader: LE.LightShaders.POINT_LIGHT
  });
  player1 = new LE.Polygon({
    x: cnv.width / 1.1,
    y: cnv.height / 3,
    vertices:
        LE.Vertices.rectangle(window.innerWidth / 40, window.innerHeight / 20),
    colour: new LE.Colour(100, 100, 100, 255)
  });
  rect1 = new LE.Polygon({
    x: cnv.width / 2.5,
    y: cnv.height / 1.2,
    vertices:
        LE.Vertices.rectangle(window.innerWidth / 200, window.innerHeight / 4),
    colour: new LE.Colour(30, 30, 30, 255)
  });
  rect2 = new LE.Polygon({
    x: cnv.width / 1.5,
    y: cnv.height / 3,
    vertices:
        LE.Vertices.rectangle(window.innerWidth / 200, window.innerHeight / 5),
    colour: new LE.Colour(30, 30, 30, 255)
  });

  // Add lights and polygon to the scene
  scene.addLight(mainLight);
  scene.addLight(secondLight);
  scene.addShadowObject(player1);
  scene.addShadowObject(rect1);
  scene.addShadowObject(rect2);

  // Finally initialise the renderer with the canvas and scene
  renderer = new LE.WebGLRenderer({canvas: cnv, scene: scene});

  // Start the loop
  update();

  // FIREBASE
  player = 2;
  // user();
  // listen();

  // send('PLAYER_INFOS', {'ww': window.innerWidth, 'wh': window.innerHeight});

  websocket_send(
      {'ww': window.innerWidth, 'wh': window.innerHeight}, 'PLAYER_INFOS');
}

function update() {
  render();
  requestAnimationFrame(update);

  mainLight.x = window.innerWidth / 16;
  mainLight.y = lightPosY;
  secondLight.x = window.innerWidth / 16;
  secondLight.y = lightPosY;


  // DETECT IF THE PLAYER IS LIT OR NOT
  color = fac.getColor(cnv, {
    mode: 'precision',
    left: player1.x - 3,
    top: (window.innerHeight - player1.y - player1.centerPoint.y * 2) - 3,
    width: player1.centerPoint.x * 2 + 6,
    height: player1.centerPoint.y * 2 + 6
  });
  // console.log(color.value[0] + " " + color.value[1] + " " + color.value[2]);

  if (firstColorCheck) {
    r_source = color.value[0];
    g_source = color.value[1];
    b_source = color.value[2];
    firstColorCheck = false;
  }
  let r = color.value[0];
  let g = color.value[1];
  let b = color.value[2];

  if (Math.abs(r_source - r) > 1 || Math.abs(g_source - g) > 1 ||
      Math.abs(b_source - b) > 1) {
    divDetected.style.display = 'block';
  } else {
    divDetected.style.display = 'none';
  }

  // KEYBOARD CONTROLS
  if (topPressed) {
    paddleY += 0.1;
  } else if (bottomPressed) {
    paddleY -= 0.1;
  } else {
    paddleY = 0;
  }

  if (rightPressed) {
    paddleX += 0.1;
  } else if (leftPressed) {
    paddleX -= 0.1;
  } else {
    paddleX = 0;
  }

  player1.y = player1.y + paddleY;
  player1.x = player1.x + paddleX;
  // console.log(paddleY);

  // MOVING RECT1
  if (rect1.y > window.innerHeight - rect1.centerPoint.y * 2) {  // Top limit
    vRect1 = -1;
  }
  if (rect1.y < window.innerHeight / 2) {  // bottom limit
    vRect1 = 1;
  }
  rect1.y = rect1.y + vRect1;

  // MOVING RECT2
  if (rect2.y >
      window.innerHeight / 1.5 - rect2.centerPoint.y * 2) {  // Top limit
    vRect2 = -1;
  }
  if (rect2.y < window.innerHeight / 3) {  // bottom limit
    vRect2 = 1;
  }
  rect2.y = rect2.y + vRect2;

  // FIREBASE SENDING DATAS TO PLAYER
  // send('PLAYER', {
  //   'x': player1.x / window.innerWidth,
  //   'y': player1.y / window.innerHeight
  // });
  // send('OBSTACLES', {
  //   'rect1Y': map(rect1.y, 0, window.innerHeight, 0, wh_light),
  //   'rect2Y': map(rect2.y, 0, window.innerHeight, 0, wh_light)
  // });

  // websocket option
  websocket_send(
      {'x': player1.x / window.innerWidth, 'y': player1.y / window.innerHeight},
      'PLAYER');

  websocket_send(
      {
        'rect1Y': map(rect1.y, 0, window.innerHeight, 0, wh_light),
        'rect2Y': map(rect2.y, 0, window.innerHeight, 0, wh_light)
      },
      'OBSTACLES');
}

function render() {
  renderer.clear();
  renderer.render();
}

function map(v, a, b, x, y) {
  return (v == a) ? x : (v - a) * (y - x) / (b - a) + x;
}

// KEYBOARD CONTROLS
function keyDownHandler(e) {
  if (e.keyCode == 38) {  // Up Arrow
    topPressed = true;
  } else if (e.keyCode == 40) {  // Down Arrow
    bottomPressed = true;
  }
  if (e.keyCode == 39) {  // Right Arrow
    rightPressed = true;
  } else if (e.keyCode == 37) {  // Left Arrow
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 38) {  // Up Arrow
    topPressed = false;
  } else if (e.keyCode == 40) {  // Down Arrow
    bottomPressed = false;
  }
  if (e.keyCode == 39) {  // Right Arrow
    rightPressed = false;
  } else if (e.keyCode == 37) {  // Left Arrow
    leftPressed = false;
  }
}


// FIREBASE
function user() {
  database.ref('USER').on(
      'value', (function(snapshot) {
        if ((snapshot.val() == null || snapshot.val().data == 2 ||
             snapshot.val().data == 3) &&
            player == null) {
          // initialise le joueur 1
          console.log('YOU ARE PLAYER 1');
          player = 1;
          send('USER', 1);
        } else if (snapshot.val().data == 1 && player == null) {
          // initialise le joueur 2
          console.log('YOU ARE PLAYER 2');
          player = 2;
          send('USER', 2);
        }
      }));
}

function listen() {
  // changement dans l’entrée LIGHT de la db
  database.ref('LIGHT').on('value', function(snapshot) {
    if (snapshot.val()) {
      let lightDatas = snapshot.val().data;

      if (player != lightDatas.player) {
        // lightPosX = lightDatas.x * window.innerWidth;
        lightPosY = lightDatas.y * window.innerHeight;
      }
    }
  });
  database.ref('LIGHT_INFOS').on('value', function(snapshot) {
    if (snapshot.val()) {
      let lightInfosDatas = snapshot.val().data;

      if (player != lightInfosDatas.player) {
        ww_light = lightInfosDatas.ww;
        wh_light = lightInfosDatas.wh;
      }
    }
  });

  // websocket option
  //-> view websocket_update
}

function websocket_update(json) {
  let type = json.message.type;

  switch (type) {
    case 'LIGHT':

      let lightDatas = json.message;
      console.log('player 2 in action ', lightDatas);
      if (player != lightDatas.player) {
        // lightPosX = lightDatas.x * window.innerWidth;
        lightPosY = lightDatas.data.y * window.innerHeight;
      }
      break;
    case 'LIGHT_INFOS':
      let lightInfosDatas = json.message.data;

      if (player != lightInfosDatas.player) {
        ww_light = lightInfosDatas.ww;
        wh_light = lightInfosDatas.wh;
      }
      break;
  }
}

function send(path, _data) {
  var json = {'data': _data};
  database.ref(path).set(json);
}

function websocket_send(data, type) {
  CONNECTION.connection.send(
      JSON.stringify({data: data, type: type, player: player}));
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
window.addEventListener('DOMContentLoaded', init);
