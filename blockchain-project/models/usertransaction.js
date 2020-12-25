'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usertransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Usertransaction.init({
    user_id: DataTypes.INTEGER,
    TrNr: DataTypes.INTEGER,
    Amount: DataTypes.STRING,
    Fee: DataTypes.STRING,
    From: DataTypes.STRING,
    To: DataTypes.STRING,
    Signature: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usertransaction',
  });
  return Usertransaction;
};