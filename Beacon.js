var _ = require('lodash');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
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
    })
    .catch(function (err) {
      res.status(500).json({error: true, data: {message: err.message}});
    });
  })

app.use('/superStore/api', router);
app.listen(3000, function() {
  console.log("✔ Express server listening on port %d in %s mode", 3000, app.get('env'));
});

