var _ = require('lodash');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apn = require('apn');
var push = require('./modelObject');
var options = {
        cert: 'keys/cert.pem',
        key: 'keys/key.pem',
        passphrase: 'bazzinga',
        production: false,
        connectionTimeout: 10000
};
var apnConnection = new apn.Connection(options);

// application routing
var router = express.Router();
// body-parser middleware for handling request variables
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : '127.0.0.1',
        user     : 'root',
        password : 'bazzinga',
        database : 'superStore',
        charset  : 'utf8'
  }
});
var Bookshelf = require('bookshelf')(knex);

var Discount = Bookshelf.Model.extend({
  tableName: 'discounts'
});

var Discounts = Bookshelf.Collection.extend({
  model: Discount
});

//List of beacons
var placesByBeacons = {'15212:31506': 'grocery', '48071:25324': 'lifestyle', '45153:9209':'produce'};

function sendPushForDevice(withToken, pushMessage, callback){
  //Sending push...
  // var myDevice = new apn.Device('3206c774828e82267184ae63fdbf5784c2e042b8fac64756c79c4d3d73305deb');
  var myDevice = new apn.Device(withToken);
  var note = new apn.Notification();

  // note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  // note.badge = 3;
  // note.sound = "ping.aiff";
  // note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
  // note.payload = {'messageFrom': 'Caroline'};
  note.expiry = pushMessage.expiry;
  note.badge = pushMessage.badge;
  note.sound = pushMessage.sound;
  note.alert = pushMessage.alert;
  note.payload = pushMessage.payload;

  apnConnection.pushNotification(note, myDevice);
  callback();
  //Push ends here ...
}

router.route('/pushTest')
  .post(function(req, res){
    var token = req.body.dToken;
    var beaconID = req.body.beaconID;
    if(!token){
      res.json({error: true, data: {message: 'Push failed!'}});
    }else {
      console.log(placesByBeacons[beaconID]);
      Discount.forge({region: placesByBeacons[beaconID]})
      .fetch()
      .then(function (discount) {
        var pushMessage = new push.PushMessage('New message from beacon', {'messageFrom': 'Falcon2'});
        sendPushForDevice(token, pushMessage, function() {
          res.json({error: false, data: {message: 'Push sent!'}});
        });
      })
      .catch(function (err){
        res.status(500).json({error: true, data: {message: err.message}});
      })
    }
  });

router.route('/discounts')
  .get(function(req, res){
    Discounts.forge()
    .fetch()
    .then(function(collection){
      res.json({error: false, data: collection.toJSON()});

    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

app.use('/superStore/api', router);
app.listen(3000, function() {
  console.log("✔ Express server listening on port %d in %s mode", 3000, app.get('env'));
});
