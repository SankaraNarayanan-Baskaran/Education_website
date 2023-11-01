'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('Quizzes','options',{
      type:Sequelize.STRING,
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    })
    await queryInterface.renameColumn('Quizzes','options','option1');

    await queryInterface.addColumn('Quizzes','option2',{
      type:Sequelize.STRING,
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    })

    await queryInterface.addColumn('Quizzes','option3',{
      type:Sequelize.STRING,
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    })

    await queryInterface.addColumn('Quizzes','option4',{
      type:Sequelize.STRING,
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
