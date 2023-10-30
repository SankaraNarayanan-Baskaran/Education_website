'use strict';
import { Model, Sequelize } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Quiz.init({
    question: Sequelize.ARRAY(Sequelize.TEXT),
    options: Sequelize.ARRAY(Sequelize.STRING),
    correct_answer: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Quiz',
  });
  return Quiz;
};