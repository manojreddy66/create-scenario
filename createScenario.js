/**
 * @description this file contain lambda invocation call to create new scenario and upsert user config
 */
const { dbConnect, dbDisconnect } = require("prismaORM/index");
const { scenariosData } = require("prismaORM/services/scenariosService");
const { userDetailsData } = require("prismaORM/services/userDetailsService");
const { formatMonthYear } = require("./utils");
const { DB_CLOSE_CONNECTION_STMT } = require("constants/customConstants");

/**
 * @description Function to insert new scenario details
 * @param {Array} body: input request
 * @param {*} scenarioDetails: scenarioName - {PlanType}/{PLANT}/{Line}_{Cycle}_V{version} & cycle
 */
async function postScenarioData(body, scenarioDetails) {
  /* Connecting to DB instance */
  const rdb = await dbConnect();
  const scenariosDataService = new scenariosData(rdb);
  const userDetailsDataService = new userDetailsData(rdb);

  try {
    const { scenarioName, cycle } = scenarioDetails;
    /**
     * @description Function to format month and year - YYYYMM
     * @returns {*} formattedStartMonthYear - Formatted startMonth & startYear YYYYMM
     */
    const formattedStartMonthYear = formatMonthYear(
      body.startMonth,
      body.startYear
    );
    /**
     * @description Function to format month and year - YYYYMM
     * @returns {*} formattedEndtMonthYear - Formatted endMonth & endYear YYYYMM
     */
    const formattedEndMonthYear = formatMonthYear(body.endMonth, body.endYear);
    /**
     * @description Insert new scenario details into scenarios table
     * and upsert user config details
     */
    await rdb.prisma.$transaction(async (tx) => {
      await Promise.all([
        scenariosDataService.createScenario(
          body,
          scenarioName,
          cycle,
          formattedStartMonthYear,
          formattedEndMonthYear,
          tx
        ),
        userDetailsDataService.upsertUserConfig(body, tx),
      ]);
    });
  } catch (err) {
    console.log("Error in postScenarioData:", err);
    throw err;
  } finally {
    /* Closing the connections */
    dbDisconnect();
    console.log(DB_CLOSE_CONNECTION_STMT);
  }
}

module.exports = { postScenarioData };
