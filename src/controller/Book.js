const { Book, ListBook } = require("../../models");
const Joi = require("joi");

// Get All Book
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "Success",
      data: {
        books,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Get All Book Promo
exports.getBooksPromo = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: {
        promo : "Yes"
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      // limit: 3
    });
    res.send({
      status: "Success",
      data: {
        books,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Get Book Detail
exports.getBooksDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!book) {
      return res.send({
        status: "Unsuccess",
        message: `Book with id ${id} Not Existed`,
      });
    }
    res.send({
      status: "Success",
      data: {
        book,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Add Book
exports.addBooks = async (req, res) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      publicationDate: Joi.string().required(),
      pages: Joi.string().required(),
      publicationDate: Joi.string().required(),
      author: Joi.string().required(),
      isbn: Joi.string().required(),
      price: Joi.number().required(),
      about: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "Unsuccess",
        message: error.details[0].message,
      });

      const book = await Book.create({
        ...req.body,
        promo: "No",
        coverFile: req.files.coverFile[0].filename,
        bookFile: req.files.bookFile[0].filename,
      });

      if (!book)
        return res.status(400).send({
          status: "Unsuccess",
          message: "Upload Book Unsuccess",
        });

    res.send({
      status: "Success",
      data: {
        book,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Edit Book
exports.editBooks = async (req, res) => {
  try {
    const { id } = req.params;

    const books = await Book.findOne({
      where: {
        id,
      },
    });

    if (!books) {
      return res.send({
        status: "Unsuccess",
        message: `Book with id ${id} Not Existed`,
      });
    }

    const schema = Joi.object({
      title: Joi.string().required(),
      publicationDate: Joi.string().required(),
      pages: Joi.number().required(),
      publicationDate: Joi.string().required(),
      author: Joi.string().required(),
      isbn: Joi.number().required(),
      about: Joi.string().required(),
      bookFile: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "Unsuccess",
        message: error.details[0].message,
      });

    const book = await Book.update(req.body, {
      where: {
        id,
      },
    });

    const booksUpdated = await Book.findOne({
      where: {
        id,
      },
    });

    res.send({
      status: "Success",
      data: {
        booksUpdated,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Delete Book By ID
exports.deleteBooks = async (req, res) => {
  try {
    const { id } = req.params;

    const books = await Book.findOne({
      where: {
        id,
      },
    });

    if (!books) {
      return res.send({
        status: "Unsuccess",
        message: `Book with id ${id} Not Existed`,
      });
    }

    await Book.destroy({
      where: {
        id,
      },
    });
    res.send({
      status: "Success",
      data: {
        id: id,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Get List Books
exports.getListBooks = async (req, res) => {
  try {
    const { id } = req.params;

    const listBooks = await ListBook.findAll({
      where: {
        transactionId: id,
      },
      include: {
        model: Book,
        as: "books",
        attributes: {
          exclude: ["publicationDate", "pages", "isbn", "about", "createdAt", "updatedAt"],
        },
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      attributes: {
        exclude: ["id", "usersId", "BookId", "UserId", "transactionsId", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "Success",
      data: {
        listBooks
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Server Error",
    });
  }
}

// Add List Book
exports.addListBooks = async (req, res) => {
  try {
    const schema = Joi.object({
      usersId: Joi.number().required(),
      booksId: Joi.number().required(),
      transactionId: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "Unsuccess",
        message: error.details[0].message,
      });

    const { usersId, booksId, transactionId } = req.body;
    const book = await ListBook.findOne({
      where: {
        usersId,
        booksId,
        transactionId
      },
      attributes: {
        exclude: ["BookId", "UserId", "transactionsId"],
      },
    });

    if (book)
      return res.send({
        status: "Unsuccess",
        message: "The book is already on the list",
      });

      const addList = await ListBook.create({
        ...req.body,
        usersId,
        booksId,
        transactionId
      });

      if (!addList)
        return res.send({
          status: "Unsuccess",
          message: "Add List Book Unsuccess",
        });

    res.send({
      status: "Success",
      data: {
        addList,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Server Error",
    });
  }
};
// Get User Book
exports.getOwnBook = async (req, res) => {
  try {
    const { bookId, userId } = req.params;

    const book = await ListBook.findOne({
      where: {
        booksId: bookId,
        usersId: userId
      },
      attributes: {
        exclude: ["BookId", "transactionsId", "UserId", "createdAt", "updatedAt"],
      },
    });
    if (!book) {
      return res.send({
        status: "Unsuccess",
        message: `Book with id ${bookId} Not Existed`,
      });
    }
    res.send({
      status: "Success",
      data: {
        book,
      },
    });
  } catch (error) {
    console.log(error);
    // res.status(500).send({
    //   status: "Server Error",
    // });
  }
};