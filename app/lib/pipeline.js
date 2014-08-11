'use strict';

var morgan = require('morgan');
var bodyParser = require('body-parser');
var accounts = require('../controllers/accounts');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));

  app.get('/accounts/new', accounts.init);
  app.post('/accounts/new', accounts.create);
  app.get('/accounts', accounts.showAll);

  app.get('/accounts/:id', accounts.showOne);
  app.get('/accounts/:id/transaction', accounts.transaction);

  app.post('/accounts/:id/transaction', accounts.newtransaction);

  console.log('Pipeline Configured');
};
