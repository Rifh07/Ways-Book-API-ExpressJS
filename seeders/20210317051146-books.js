'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Books', [
      {
        id: 1,
        title: "Tess of the Road",
        publicationDate: "February 2018",
        pages: "520",
        author: "Rachel Hartman",
        isbn: "9781101931288",
        price: "200000",
        about: "Tess of the Road adalah novel fantasi 2018 karya Rachel Hartman. Novel pendamping untuk buku-buku Hartman sebelumnya, Seraphina dan Shadow Scale, novel ini mengikuti kisah Tess Dombegh, seorang adik perempuan dari Seraphina",
        promo: "No",
        coverFile: "1615178403924-Book4.png",
        bookFile: "1615178403964-Tugas4_rekayasaSistem_ulala.pdf",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
