function getIBRTS(x, y) {
  let remainder = 0;
  let quotient = 0;
  let out = y;
  if (x === 'weeks') { out = y * 7; } else if (x === 'months') { out = y * 30; }
  remainder = out % 3;
  const mout = out - remainder;
  quotient = mout / 3;
  return quotient;
}

const covid19ImpactEstimator = (data) => {
  const allData = data;
  const getIBRT = getIBRTS(allData.periodType, allData.timeToElapse);
  const getIBR = 2 ** getIBRT;
  const impact = {};
  const severeImpact = {};
  let imp;
  let smp;
  //    Challenge 1
  //    a
  impact.currentlyInfected = Math.floor(allData.reportedCases) * 10;
  severeImpact.currentlyInfected = Math.floor(allData.reportedCases) * 50;
  //    b
  impact.infectionsByRequestedTime = impact.currentlyInfected * getIBR;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * getIBR;
  //    Challenge 2
  //    a
  imp = impact.infectionsByRequestedTime * 0.15;
  impact.severeCasesByRequestedTime = Math.floor(imp);
  smp = severeImpact.infectionsByRequestedTime * 0.15;
  severeImpact.severeCasesByRequestedTime = Math.floor(smp);
  //    b
  imp = Math.floor(allData.totalHospitalBeds * 0.35) - impact.severeCasesByRequestedTime;
  impact.hospitalBedsByRequestedTime = imp;
  smp = Math.floor(allData.totalHospitalBeds * 0.35) - severeImpact.severeCasesByRequestedTime;
  severeImpact.hospitalBedsByRequestedTime = smp;
  //    Challenge 3
  //    a
  impact.casesForICUByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.05);
  smp = Math.floor(severeImpact.infectionsByRequestedTime * 0.05);
  severeImpact.casesForICUByRequestedTime = smp;
  //    b
  impact.casesForVentilatorsByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.02);
  smp = Math.floor(severeImpact.infectionsByRequestedTime * 0.02);
  severeImpact.casesForVentilatorsByRequestedTime = smp;
  //    c
  imp = impact.infectionsByRequestedTime * allData.region.avgDailyIncomePopulation;
  impact.dollarsInFlight = Math.floor(imp * allData.region.avgDailyIncomeInUSD * getIBRT);
  smp = severeImpact.infectionsByRequestedTime * allData.region.avgDailyIncomePopulation;
  severeImpact.dollarsInFlight = Math.floor(smp * allData.region.avgDailyIncomeInUSD * getIBRT);
  return { data, impact, severeImpact };
};
export default covid19ImpactEstimator;
