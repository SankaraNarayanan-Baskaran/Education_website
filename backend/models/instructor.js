'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Instructor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Instructor.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    mail: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Instructor',
  });
  return Instructor;
};