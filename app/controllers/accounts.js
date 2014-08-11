'use strict';

var Account = require('../models/account');
//var Transfer = require('../models/transfer');
var Moment = require('moment');

exports.init = function(req, res){
  res.render('accounts/init');
};

exports.create = function(req, res){
  Account.create(req.body, function(){
    res.redirect('/accounts');
  });
};

exports.showAll = function(req, res){
  Account.all(function(accounts){
    console.log(accounts);
    res.render('accounts/showall', {accounts:accounts, Moment:Moment});
  });
};

exports.showOne = function(req, res){
  Account.findById(req.params.id, function(account){
    res.render('accounts/showone', {account:account, Moment:Moment});
  });
};


exports.transaction = function(req, res){
  Account.findById(req.params.id, function(account){
    res.render('accounts/transaction', {account:account, Moment:Moment});
  });
};
