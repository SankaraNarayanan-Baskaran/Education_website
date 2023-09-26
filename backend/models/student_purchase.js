'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student_Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Student_Purchase.init({
    course_name: DataTypes.STRING,
    course_description: DataTypes.TEXT,
    video_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Student_Purchase',
  });
  return Student_Purchase;
};