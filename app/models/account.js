'use strict';

var _ = require('lodash');
var Mongo = require('mongodb');
var Transfer = require('./transfer');
//var async = require('async');

function Account(o){
  this.name = o.name;
  this.date = new Date();
  this.photo = o.photo;
  this.type = o.type;
  this.color = o.color;
  this.pin = o.pin;
  this.balance = o.deposit * 1;
  this.transfers = [];
  this.transactions = [];
}

Object.defineProperty(Account, 'collection', {
  get: function(){return global.mongodb.collection('accounts');}
});

Account.prototype.transaction = function(o){
  if( o.pin !== this.pin){
    return 'Incorrect PIN';
  }

  o.amount = o.amount * 1;

  var newTrans = {};
  newTrans.type = o.type;
  newTrans.amount = o.amount;
  newTrans.date = new Date();
  newTrans.id = this.transactions.length + 1;
  newTrans.fee = 0;

  this.balance += (o.type === 'Deposit') ? newTrans.amount : -newTrans.amount;

  if(this.balance <= 0){
    newTrans.fee = 50;
  }

  this.balance -= newTrans.fee;
  
  this.transactions.push(newTrans);
};

Account.create = function(o, cb){
  var a = new Account(o);
  Account.collection.save(a, cb);
};

Account.all = function(cb){
  Account.collection.find().toArray( function( err, accounts){
    var accts = accounts.map(function(account){
      return reProto(account);
    });
    cb(accts);
  });
};

Account.findById = function(id, cb){
  id = Mongo.ObjectID(id);
  //console.log(id);
  Account.collection.findOne({_id:id}, function( err, obj){
    //console.log(obj);
    Transfer.collection.find( {$or: [{to:obj._id},{from:obj._id}]}).toArray( function(err, transfers){
      
      obj.transfers = (transfers);
      obj = reProto(obj);
      cb(obj);
    });
  });
};

Account.transfer = function(o, cb){
  o.amount *= 1;
  Account.findById(o.from, function(sender){
    //console.log(o.pin, sender.pin, o.amount + 25, sender.balance)
    if( o.pin === sender.pin && o.amount + 25 <= sender.balance){
      sender.balance -= (o.amount + 25);
      Account.collection.save(sender, function(){
        Account.findById(o.to, function(receiver){
          o.amount = o.amount * 1;
          receiver.balance = receiver.balance * 1;
          receiver.balance += o.amount;
          Account.collection.save(receiver, function(){
            Transfer.create({from:sender._id, to:receiver._id, amount:o.amount}, function(){
              cb();
            });
          });
        });
      });
    }else{if(cb){cb();}
    }
  });
};

module.exports = Account;

//HELPER
//
function reProto(account){
  return _.create(Account.prototype, account);
}

