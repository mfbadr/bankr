'use strict';

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

Account.prototype.transaction = function(type, amount){
  amount = amount * 1;

  var newTrans = {};
  newTrans.type = type;
  newTrans.amount = amount;
  newTrans.date = new Date();
  newTrans.id = this.transactions.length + 1;
  newTrans.fee = 0;

  this.balance += (type === 'deposit') ? amount : -amount;

  if(this.balance <= 0){
    newTrans.fee = 50;
  }

  this.balance -= newTrans.fee;
  
  this.transactions.push(newTrans);
};

module.exports = Account;
