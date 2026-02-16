/**
 * @name create-scenario
 * @description Returns success message after creating a scenario
 * @createdOn Feb 16th, 2026
 * @author Priyadarshini Gangone
 * @modifiedBy
 * @modifiedOn
 * @modificationSummary
 */

const {
  sendResponse,
  BadRequest,
  HTTP_RESPONSE_CODES,
} = require("utils/api_response_utils");
const { createScenario } = require("./createScenarioService");
const { API_ERROR_MESSAGE } = require("constants/customConstants");

/**
   * @description Lambda handler for create scenario.
   * @param {Object} event: API event with body:
   * {
      "type": "Getsudo/AP",
      "namc":"TMMI",
      "line":"Line1",
      "startMonth": "Feb",
      "startYear":"2025",
      "endMonth":"Mar",
      "endYear":"2026",
      "userName":"Priyadarshini Gangone",
      "userEmail":"useremail@toyota.com",
      }
   * @returns {Object}: response sample is detailed below.
   * Response object sample for success response with status code 200.
      {
        "message":"Successfully created a scenario."
      }
   * Response object sample for any internal server error with status code 500.
      {
        "errorMessage": <"Internal Server Error">
      }
   * In-valid input error with status 400:
      {
        "errorMessage": [<"ValidationError: validation error message”>]
      }
   * HTTP_RESPONSE_CODES info:
      {
        SUCCESS: 200,
        VALIDATION_ERROR: 400,
        INTERNAL_SERVER_ERROR: 500
      }
  */
exports.handler = async (event) => {
  try {
    /**
     * @description Function to validate & create scenario.
     * @param {Object} event: Input parameters
     * @returns {Object} response - Success message
     */
    const response = await createScenario(event);
    console.log("response:", response);
    const codeStatus = HTTP_RESPONSE_CODES.SUCCESS;
    /* Return a successful response */
    return sendResponse(codeStatus, response);
  } catch (err) {
    console.log("Handler Error: ", err);
    let errorMsg = API_ERROR_MESSAGE.INTERNAL_SERVER_ERROR;
    let statusCode = HTTP_RESPONSE_CODES.INTERNAL_SERVER_ERROR;
    if (err instanceof BadRequest) {
      statusCode = HTTP_RESPONSE_CODES.BAD_REQUEST;
      errorMsg = err.message
        .split(/,(?=ValidationError:)/)
        .map((err) => err.trim());
      console.log("Validation error messages: ", errorMsg);
    }
    /* Return an error response for badrequest or internal server error */
    return sendResponse(statusCode, { errorMessage: errorMsg });
  }
};
