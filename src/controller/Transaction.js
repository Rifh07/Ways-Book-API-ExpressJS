const { User, Transaction, ListBook, Book } = require("../../models");
const Joi = require("joi");

// Add Transaction
exports.addTransaction = async (req, res) => {
  try {
    const schema = Joi.object({
      userId: Joi.string().required(),
      paymentTotal: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "unsuccess",
        message: error.details[0].message,
      });


    const user = await User.findOne({
      where: {
        id: req.body.userId,
      },
      attributes: {
        exclude: ["email", "token", "password", "createdAt", "updatedAt"],
      },
    });

    if (!user) {
        return res.send({
          status: "unsuccess",
          message: `User with id ${req.body.userId} Not Existed`,
        });
      }

      const transaction = await Transaction.create({
        usersId: req.body.userId,
        transferProof: req.files.transferProof[0].filename,
        paymentTotal: req.body.paymentTotal,
        paymentStatus: "Pending",
      });

    res.send({
      status: "Success",
      data: {
        user,
        transaction
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Edit Transaction
exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId"],
      },
    });

    if (!transaction) {
      return res.send({
        status: "unsuccess",
        message: `Transaction with id ${id} Not Existed`,
      });
    }

    const schema = Joi.object({
      paymentStatus: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error)
      return res.status(400).send({
        status: "unsuccess",
        message: error.details[0].message,
      });

    const transactionupdate = await Transaction.update(req.body, {
      where: {
        id,
      },
    });

    const transactions = await Transaction.findOne({
      where: {
        id,
      },
      include: {
        model: User,
        as: "users",
        attributes: {
          exclude: ["email", "token", "password", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId"],
      },
    });

    res.send({
      status: "Success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Get Transaction Detail
exports.getTransactionDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      where: {
        id,
      },
      include: {
        model: User,
        as: "users",
        attributes: {
          exclude: ["email", "token", "password", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId"],
      },
    });

    if (!transaction) {
      return res.send({
        status: "unsuccess",
        message: `Transaction with id ${id} Not Existed`,
      });
    }
    res.send({
      status: "Success",
      data: {
        transaction,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Get All Transaction
exports.getTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: {
        model: User,
        as: "users",
        attributes: {
          exclude: ["email", "token", "password", "createdAt", "updatedAt"],
        },
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId"],
      },
    });

    if (!transactions) {
      return res.send({
        status: "unsuccess",
        message: "Transactions Not Existed",
      });
    }

    res.send({
      status: "Success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};

// Get Transaction By Id User Desc
exports.getTransactionByIdUserDesc = async (req, res) => {
  try {
    const { id } = req.params;

    const transactions = await Transaction.findAll({
      where: {
        usersId: id,
        paymentStatus: "Approve",
      },
      include: {
        model: ListBook,
        as: "listBooks",
        attributes: {
          exclude: ["BookId", "transactionsId", "UserId", "createdAt", "updatedAt"],
        },
        include: {
          model: Book,
          as: "books",
          attributes: {
            exclude: ["publicationDate", "pages", "isbn", "about", "createdAt", "updatedAt"],
          },
        },
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId"],
      },
    });

    if (!transactions) {
      return res.send({
        status: "unsuccess",
        message: `User with id ${id} Not Existed`,
      });
    }
    res.send({
      status: "Success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: "Server Error",
    });
  }
};