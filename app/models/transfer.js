'use strict';

var Mongo = require('mongodb');

Object.defineProperty(Transfer, 'collection', {
  get: function(){return global.mongodb.collection('transfers');}
});

function Transfer(o){
  this.date = new Date();
  this.from = Mongo.ObjectID(o.from);
  this.to = Mongo.ObjectID(o.to);
  this.amount = o.amount * 1;
  this.id = o.id;
}

Transfer.count = function(cb){
  Transfer.collection.count(cb);
};

Transfer.create = function( obj, cb){
  Transfer.count( function(err, count){
    obj.id = count + 1;
    var t = new Transfer(obj);
    Transfer.collection.save(t, cb);
  });

};

module.exports = Transfer;
