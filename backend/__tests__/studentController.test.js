const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../server'); // Adjust the path accordingly
const {
  adduser,
  loginuser,
  google,
  studentview,
  learners,
  isStudent,
  convertToStudent,
  updatePassword,
  forgotPassword,
} = require('../controllers/studentController');

chai.use(chaiHttp);
const { expect } = chai;

describe('User Controller Tests', () => {
  // Assuming you have a running instance of your Express app

  // Test for the adduser function
  it('should add a new user', async () => {
    const res = await chai
      .request(app)
      .post('/student/addstudent')
      .send({
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
        address: 'Test Address',
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('success').to.equal('true');
  });

  // Add similar tests for other functions

  // Test for the loginuser function
  it('should log in a user', async () => {
    const res = await chai
      .request(app)
      .post('/student/loginstudent')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('success').to.equal('true');
  });

  // Add similar tests for other functions

  // Cleanup after tests if needed
  after(async () => {
    // Add cleanup code here
  });
});
