'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        id: 1,
        fullName: "Admin",
        email: "admin@admin.com",
        password: "$2b$10$GzxSrNBjMpCAchQFRQpJOO5bqWE162f9p1DuM7izHP8BNYWe1wfZ6",
        role: "Admin",
        phone: "082311820900",
        gender: "Male",
        address: "Kembangan",
        profile: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
  }
};
