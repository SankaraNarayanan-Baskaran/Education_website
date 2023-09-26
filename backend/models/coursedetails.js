'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CourseDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CourseDetails.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    video_url: DataTypes.STRING,
    user_id:DataTypes.INTEGER,
    course_id:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CourseDetails',
  });
  CourseDetails.belongsTo(sequelize.models.Accounts, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
  });
  return CourseDetails;
};