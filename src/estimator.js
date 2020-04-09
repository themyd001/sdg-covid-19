function getIBRTS(x, y) {
  let remainder = 0;
  let quotient = 0;
  let out = y;
  if (x === 'weeks') {
    out = y * 7; }
  else if (x === 'months') {
    out = y * 30; }
  remainder = out % 3;
  let mout = out - remainder;
  quotient = mout / 3;
  return quotient;
}

const covid19ImpactEstimator = (data) => {
  const allData = data;
  const getIBRT = getIBRTS(allData.periodType, allData.timeToElapse);
  const getIBR = 2 ** getIBRT;
  let impact, severeImpact = {};
  //Challenge 1
  //a
  impact.currentlyInfected = allData.reportedCases * 10;
  severeImpact.currentlyInfected = allData.reportedCases * 50;
  //b
  impact.infectionsByRequestedTime = impact.currentlyInfected * getIBR;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * getIBR;
  //Challenge 2
  //a
  impact.severeCasesByRequestedTime = impact.infectionsByRequestedTime * 0.15;
  severeImpact.severeCasesByRequestedTime = severeImpact.infectionsByRequestedTime * 0.15;
  //b
  impact.hospitalBedsByRequestedTime = (allData.totalHospitalBeds * 0.35) - impact.severeCasesByRequestedTime;
  severeImpact.hospitalBedsByRequestedTime = (allData.totalHospitalBeds * 0.35) - severeImpact.severeCasesByRequestedTime;
  //Challenge 3
  //a
  impact.casesForICUByRequestedTime = impact.infectionsByRequestedTime * 0.05;
  severeImpact.casesForICUByRequestedTime = severeImpact.infectionsByRequestedTime * 0.05;
  //b
  impact.casesForVentilatorsByRequestedTime = impact.infectionsByRequestedTime * 0.02;
  severeImpact.casesForVentilatorsByRequestedTime = severeImpact.infectionsByRequestedTime * 0.02;
  //c
  impact.dollarsInFlight = impact.infectionsByRequestedTime * allData.region.avgDailyIncomePopulation * allData.region.avgDailyIncomeInUSD * getIBRT;
  severeImpact.dollarsInFlight = severeImpact.infectionsByRequestedTime * allData.region.avgDailyIncomePopulation * allData.region.avgDailyIncomeInUSD * getIBRT;
  return {
    data, 
    impact, 
    severeImpact
    };

};
 
export default covid19ImpactEstimator;
