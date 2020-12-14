'use strict';

class Transaction {
    constructor(txNr, Amount, Fee, From, To, Signature) {
        this.txNr = txNr;
        this.Amount = Amount;
        this.Fee = Fee;
        this.From = From;
        this.To = To;
        this.Signature = Signature;
    }
}

module.exports = class Mempool {
    constructor(txNr, Amount, Fee, From, To, Signature) {
        this.list = [new Transaction(txNr, Amount, Fee, From, To, Signature)];
    }

    obtainLatestBlock() {
        return this.list[this.list.length - 1];
    }

    addNewNode(txNr, Amount, Fee, From, To, Signature) {
        newNode = this.obtainLatestBlock();
        this.list.push(new Transaction(txNr, Amount, Fee, From, To, Signature));
    }

    getAllList() {
        return this.list;
    }
}