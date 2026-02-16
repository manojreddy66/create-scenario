/**
 * @description this file contain routing to input validation, DB operations and prepare response
 */
const { BadRequest } = require("utils/api_response_utils");
const { validateInput } = require("./validateRequest");
const { postScenarioData } = require("./createScenario");
const { prepareResponse } = require("./utils");

/**
 * @description Function to validate & create scenario.
 * @param {Object} event: Input parameters
 * @returns {Object} response - Success message
 */
async function createScenario(event) {
  try {
    /* Extract request body from input event */
    const body = event.body ? JSON.parse(event.body) : {};
    /**
     * @description Validate payload for scenario creation.
     * Append error as validation error to errorMessages if key value is invalid in request body.
     * @param {Array} body: input request
     * @return {Object} errorMessages, scenarioDetails
     */
    const { errorMessages, scenarioDetails } = await validateInput(body);
    /* Check for validation errors */
    if (errorMessages.length > 0) {
      throw new BadRequest(errorMessages);
    }
    /**
     * @description Function to insert new scenario details
     * @param {Array} body: input request
     * @param {*} scenarioDetails: scenarioName - {PlanType}/{PLANT}/{Line}_{Cycle}_V{version} & cycle
     */
    await postScenarioData(body, scenarioDetails);
    /**
     * @description: Function to prepare response
     * @returns {Object}: success message
     */
    return prepareResponse(body);
  } catch (err) {
    console.log("Error in createScenario:", err);
    throw err;
  }
}

module.exports = { createScenario };
