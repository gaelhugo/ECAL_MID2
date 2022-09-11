const say = require('say')


var username = 'gaelhugo';
var key = '86296bca4c8d469f8650a8605648cf6e';
var feed = 'slider'

// include mqtt with feed we want to use
var mqtt = require('mqtt'), my_topic_name = username + '/f/' + feed;

// connect to adafruit io
var client = mqtt.connect(
    'mqtts://io.adafruit.com', {port: 8883, username: username, password: key});

// create event callback that triggers when receive new data
client.on('connect', () => {client.subscribe(my_topic_name)});

// if an error occurs
client.on('error', (error) => {
  console.log('MQTT Client Errored');
  console.log(error);
});

// when we get a new message / data
client.on('message', (topic, message) => {

  // parse our meassage
  try {
    let json = JSON.parse(message.toString());

    console.log(message.toString());  // for demo purposes.
    console.log(json);
    //
    // let emotion = json.emoji;
    // emotion = emotion.replace('face', '');
    // emotion = emotion.replace('with', '');
    //
    // let prefix = 'Hello Lausanne. I feel like ';
    // if (json.category == 'objects' || json.category == 'nature' ||
    //     json.category == 'food')
    //   prefix += ' a ';
    //
    // let myString = prefix + emotion;
    // say.speak(myString, 'Samantha');
  } catch (error) {
    console.log(error);
  }

});
