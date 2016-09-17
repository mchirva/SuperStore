var _ = require('lodash');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apn = require('apn');
var options = {
        cert: 'keys/cert.pem',
        key: 'keys/key.pem',
        passphrase: 'bazzinga',
        production: false,
        connectionTimeout: 10000
};
var apnConnection = new apn.Connection(options);

var myDevice = new apn.Device('3206c774828e82267184ae63fdbf5784c2e042b8fac64756c79c4d3d73305deb');

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


router.route('/discounts')
  .get(function(req, res){
    Discounts.forge()
    .fetch()
    .then(function(collection){
      res.json({error: false, data: collection.toJSON()});
      console.log('Trying push...');
      //Sending push...
      var note = new apn.Notification();

      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      note.badge = 3;
      note.sound = "ping.aiff";
      note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
      note.payload = {'messageFrom': 'Caroline'};

      apnConnection.pushNotification(note, myDevice);
      //Push end here ...

    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

app.use('/superStore/api', router);
app.listen(3000, function() {
  console.log("✔ Express server listening on port %d in %s mode", 3000, app.get('env'));
});
