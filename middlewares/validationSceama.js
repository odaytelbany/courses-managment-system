const { body } = require("express-validator");

const validationSceama = () => {
    return [
        body("title")
          .notEmpty()
          .withMessage("Title is required!")
          .isLength({ min: 2 })
          .withMessage("Length shouldnt be less than 2 char!"),
        body("price").notEmpty().withMessage("Price is required!"),
      ];
}

module.exports = validationSceama;