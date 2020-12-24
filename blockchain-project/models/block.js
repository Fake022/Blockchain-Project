'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Block extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Block.init({
    block: DataTypes.INTEGER,
    transactions: DataTypes.TEXT,
    hash: DataTypes.STRING,
    prev: DataTypes.STRING,
    nonce: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Block',
  });
  return Block;
};
