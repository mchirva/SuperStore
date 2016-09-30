var express = require('express');
var bodyParser = require('body-parser');

var app = express();

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

// User model
var Sale = Bookshelf.Model.extend({
    tableName: 'sales'
});

//Users Collection
var Sales = Bookshelf.Collection.extend({
        model: Sale
});

router.route('/getData')
    .get(function(req, res){
        Sales.forge()
            .fetch()
            .then(function(collection){
                res.json({error: false, data: collection.toJSON()});

            })
            .catch(function (err) {
                res.status(500).json({error: true, data: {message: err.message}});
            });
    });

router.route('/updateData')
    .post(function(req, res){
        var newSale = {'id': req.body.id,
                        'cost': req.body.cost,
                        'sales': req.body.sales,
                        'item': 'type 2'};

        new Sale({id: req.body.id})
            .save({cost: req.body.cost, sales: req.body.sales}, {patch: true})
            .then(function(model) {
                res.json({status: "Success"});
            })
            .catch(function (err){
               res.status(500).json({status:"Error", message:"Unable to store new value"});
            });
    });

app.use('/api', router);

app.listen(8080, function() {
    console.log("✔ Express server listening on port %d in %s mode", 8080, app.get('env'));
});