/**
 * This file contains input request validation
 */
const {
  getValidationSchema,
} = require("schemaValidator/supplyPlanning/scenario/createScenarioSchema");
const { emptyInputCheck } = require("utils/common_utils");
const { dbConnect, dbDisconnect } = require("prismaORM/index");
const { scenariosData } = require("prismaORM/services/scenariosService");
const { getScenarioCycle, buildScenarioName } = require("./utils");
const { DB_CLOSE_CONNECTION_STMT } = require("constants/customConstants");

/**
 * @description Function to validate input request
 * @param {Object} body: API input request
 * @returns {Object} errorMessages: List of validation error messages
 * & scenarioDetails: scenarioName & cycle
 */
async function validateInput(body) {
  const errorMessages = [];
  /**
   * @description Validate: request body should not be empty.
   */
  emptyInputCheck(body);
  /**
   * @description Function to validate input request
   */
  await validateParams(body, errorMessages);
  let scenarioDetails = null;
  if (errorMessages.length === 0) {
    /**
     * @description Function to check if a scenario already exists with the input parameters
     * @param {Array} body: Input request payload
     * @param {Array} errorMessages: Validation error messages
     * @return {Object} Scenario name - nullable & cycle
     */
    const { scenarioName, cycle } = await checkIfScenarioAlreadyExists(
      body,
      errorMessages
    );
    scenarioDetails = { scenarioName, cycle };
  }
  return { errorMessages: [...new Set(errorMessages)], scenarioDetails };
}

/**
 * @description Function to validate input request
 * @param {Object} body: API input request
 * @returns {Array} errorMessages: List of validation error messages
 */
async function validateParams(body, errorMessages) {
  // Validation options to collect all error messages
  const options = { abortEarly: false };
  const schema = await getValidationSchema();
  const { error } = await schema.validate(body, options);
  if (error) {
    error.details.forEach((detail) => {
      const errorMessage = detail.message;
      errorMessages.push(errorMessage);
    });
  }
}

/**
 * @description Function to check if a scenario already exists with the input parameters
 * @param {Array} body: Input request payload
 * @param {Array} errorMessages: Validation error messages
 * @return {Object} Scenario name & cycle - nullable
 */
async function checkIfScenarioAlreadyExists(body, errorMessages) {
  /* Connecting to DB instance */
  const rdb = await dbConnect();
  const scenariosDataService = new scenariosData(rdb);
  try {
    const { type, namc, line } = body;
    /**
     * @description Function to get scenario cycle
     * @param {*} scenarioStartMonth: Input startMonth
     * @param {*} scenarioStartYear: Input startYear
     * @returns {*} cycle - Format MMMYY
     */
    const cycle = getScenarioCycle(body.startMonth, body.startYear);
    /**
     * @description Get already scenario data by plan, namc, line & cycle
     */
    const alreadyExistingScenarioData =
      await scenariosDataService.getScenarioData(type, namc, line, cycle);
    /* Filter active scenario data */
    const activeExistingScenarios = alreadyExistingScenarioData.filter(
      (item) => item.is_active === "true"
    );
    let scenarioName = null;
    /* Check if a scenario exists with input config (plan, namc, line & cycle) and is active */
    if (activeExistingScenarios.length > 0) {
      errorMessages.push(
        `ValidationError: Scenario already exists for the given namc, line, plan type & cycle.`
      );
    } else {
      /* Filter inactive scenario data */
      const inactiveExistingScenarios = alreadyExistingScenarioData.filter(
        (item) => item.is_active === "false"
      );
      let scenarioVersion = 1;
      /* If inative scenarios exist with same config, then increment the version */
      if (inactiveExistingScenarios.length > 0) {
        scenarioVersion = scenarioVersion + inactiveExistingScenarios.length;
      }
      /**
       * @description Function to build scenario name
       * @param {*} type: Scenario plan type input value
       * @param {*} namc: Scenario namc input value
       * @param {*} line: Scenario line input value
       * @param {*} cycle: Scenario cycle - extracted from startMonth & startYear input values
       * @param {*} scenarioVersion: Scenario namc version
       * @returns {*} scenario name - {PlanType}/{PLANT}/{Line}_{Cycle}_V{version}
       */
      scenarioName = buildScenarioName(
        type,
        namc,
        line,
        cycle,
        scenarioVersion
      );
    }
    return { scenarioName, cycle };
  } catch (err) {
    console.log("Error in checkIfScenarioAlreadyExists:", err);
    throw err;
  } finally {
    /* Closing the connections */
    dbDisconnect();
    console.log(DB_CLOSE_CONNECTION_STMT);
  }
}

module.exports = { validateInput };
