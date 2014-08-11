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

exports.showall = function(req, res){
  Account.all(function(accounts){
    console.log(accounts);
    res.render('accounts/showall', {accounts:accounts, Moment:Moment});
  });
};
