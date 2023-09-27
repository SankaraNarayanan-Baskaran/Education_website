'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course_Section extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Course_Section.init({
    section_name: DataTypes.STRING,
    section_description: DataTypes.TEXT,
    img_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course_Section',
  });
  return Course_Section;
};