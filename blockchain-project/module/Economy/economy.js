'use strict';

class Node {
    constructor(publicKey, GoodService, Price) {
        this.publicKey = publicKey;
        this.GoodService = GoodService;
        this.Price = Price;
    }
}

module.exports = class Economy {
    constructor(publicKey, GoodService, Price) {
        this.list = [new Node(publicKey, GoodService, Price)];
    }

    obtainLatestBlock() {
        return this.list[this.list.length - 1];
    }

    addNewNode(publicKey, GoodService, Price) {
        newNode = this.obtainLatestBlock();
        this.list.push(new Node(publicKey, GoodService, Price));
    }

    getAllList() {
        return this.list;
    }


}