const http2 = require('node:http2');

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;
const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;
const ITERNAL_SERVER_ERRROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
const UNAUTHORIZED = http2.constants.HTTP_STATUS_UNAUTHORIZED;
const CONFLICT = http2.constants.HTTP_STATUS_CONFLICT;
const FORBIDDEN = http2.constants.HTTP_STATUS_FORBIDDEN;

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  ITERNAL_SERVER_ERRROR,
  UNAUTHORIZED,
  CONFLICT,
  FORBIDDEN
};
