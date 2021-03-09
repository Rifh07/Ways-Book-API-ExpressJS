'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Book.hasMany(models.ListBook, {
        as : "listBooks"
      });
    }
  };
  Book.init({
    title: DataTypes.STRING,
    publicationDate: DataTypes.STRING,
    pages: DataTypes.INTEGER,
    author: DataTypes.STRING,
    isbn: DataTypes.STRING,
    about: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    promo: DataTypes.STRING,
    coverFile: DataTypes.STRING,
    bookFile: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};