const dayjs = require('dayjs');
const { mongoose } = require('mongoose');

const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const { ApiError } = require('../APIError');

const validateDate = (date) => {
  if (!date) {
    throw ApiError.badRequest('Date field is required', {
      date: 'Date is required',
    });
  }

  const parsedDate = dayjs(date, 'DD-MM-YYYY', true);
  if (!parsedDate.isValid()) {
    throw ApiError.badRequest('Invalid date format. Use DD-MM-YYYY', {
      date: 'Invalid date format. Use DD-MM-YYYY',
    });
  }
  return parsedDate.toDate();
};

const validateId = (id, entity) => {
  if (!id) {
    throw ApiError.badRequest(`${entity} Id Is Required`);
  }

  if (id.trim() === '') {
    throw ApiError.badRequest(`${entity} Id Can Not Be Empty`);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest(`Invalid ${entity} id`);
  }
};

module.exports = {
  validateDate,
  validateId
}