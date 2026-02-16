/**
 * @description this file contain create scenario common utils
 */
const { MONTHS } = require("constants/customConstants");

/**
 * @description Function to get scenario cycle
 * @param {*} scenarioStartMonth: Input startMonth
 * @param {*} scenarioStartYear: Input startYear
 * @returns {*} cycle - Format MMMYY
 */
function getScenarioCycle(scenarioStartMonth, scenarioStartYear) {
  const startMonthIndex = MONTHS.indexOf(scenarioStartMonth); // 1
  const startYear = Number(scenarioStartYear); // 2026

  /* Date at first day of given month/year in UTC */
  const date = new Date(Date.UTC(startYear, startMonthIndex, 1));
  date.setUTCMonth(date.getUTCMonth() - 1); // 0

  const mm = MONTHS[date.getUTCMonth()]; // Jan
  const yy = String(date.getUTCFullYear()).slice(-2); // 26
  return `${mm}${yy}`; // Jan26
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
function buildScenarioName(type, namc, line, cycle, scenarioVersion) {
  return `${type}/${namc.toUpperCase()}/${line}_${cycle}_V${scenarioVersion}`;
}

/**
 * @description Function to format month and year - YYYYMM
 * @returns {*} formattedMonthYear - Formatted month & year YYYYMM
 */
function formatMonthYear(month, year) {
  const monthIndex = MONTHS.indexOf(month);
  return `${year}${String(monthIndex + 1).padStart(2, "0")}`;
}

/**
 * @description Function to prepare response
 * @returns {Object} Success message
 */
function prepareResponse() {
  return {
    message: "Successfully created a scenario.",
  };
}

module.exports = {
  getScenarioCycle,
  buildScenarioName,
  formatMonthYear,
  prepareResponse,
};
