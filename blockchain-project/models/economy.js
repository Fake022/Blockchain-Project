'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Economy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Economy.init({
    PublicKey: DataTypes.INTEGER,
    Product: DataTypes.INTEGER,
    Price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Economy',
  });
  return Economy;
};