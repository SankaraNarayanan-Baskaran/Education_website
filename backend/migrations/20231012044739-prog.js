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
    await queryInterface.changeColumn('Progresses','student_id',{
      type:Sequelize.INTEGER,
     
      references:{
        model:'Accounts',
        key:'id',
      },
      onUpdate:'CASCADE',
      onDelete:'CASCADE'
    })

    await queryInterface.changeColumn('Progresses','course_id',{
      type:Sequelize.INTEGER,
     
      references:{
        model:'Student_Purchases',
        key:'id',
      },
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
