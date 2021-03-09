'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.User, {
        as : "users"
      });
      Transaction.hasMany(models.ListBook, {
        as : "listBooks"
      });
    }
  };
  Transaction.init({
    usersId: DataTypes.INTEGER,
    transferProof: DataTypes.STRING,
    paymentTotal: DataTypes.INTEGER,
    paymentStatus: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};