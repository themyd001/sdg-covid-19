function getIBRTS(x, y) {
  let remainder = 0;
  let quotient = 0;
  let out = Math.trunc(y);
  if (x === 'weeks') { out *= 7; } else if (x === 'months') { out *= 30; }
  remainder = Math.trunc(out) % 3;
  const mout = out - remainder;
  quotient = Math.trunc(mout / 3);
  return quotient;
}
function getIBRTSS(x, y) {
  let remainder = 0;
  let out = Math.trunc(y);
  if (x === 'weeks') { out *= 7; } else if (x === 'months') { out *= 30; }
  remainder = Math.trunc(out);
  return remainder;
}
const covid19ImpactEstimator = (data) => {
  const allData = data;
  const getIBRT = getIBRTS(allData.periodType, allData.timeToElapse);
  const days = getIBRTSS(allData.periodType, allData.timeToElapse);
  const getIBR = 2 ** getIBRT;
  const impact = {};
  const severeImpact = {};
  let imp;
  let smp;
  //    Challenge 1
  //    a
  impact.currentlyInfected = Math.trunc(allData.reportedCases) * 10;
  severeImpact.currentlyInfected = Math.trunc(allData.reportedCases) * 50;
  //    b
  impact.infectionsByRequestedTime = impact.currentlyInfected * getIBR;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * getIBR;
  //    Challenge 2
  //    a
  imp = impact.infectionsByRequestedTime * 0.15;
  impact.severeCasesByRequestedTime = Math.trunc(imp);
  smp = severeImpact.infectionsByRequestedTime * 0.15;
  severeImpact.severeCasesByRequestedTime = Math.trunc(smp);
  //    b
  imp = Math.trunc(allData.totalHospitalBeds * 0.35) - impact.severeCasesByRequestedTime;
  if (imp < 0) { imp += 1; }
  impact.hospitalBedsByRequestedTime = imp;
  smp = Math.trunc(allData.totalHospitalBeds * 0.35) - severeImpact.severeCasesByRequestedTime;
  if (smp < 0) { smp += 1; }
  impact.hospitalBedsByRequestedTime = imp;
  severeImpact.hospitalBedsByRequestedTime = smp;
  //    Challenge 3
  //    a
  impact.casesForICUByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.05);
  smp = Math.trunc(severeImpact.infectionsByRequestedTime * 0.05);
  severeImpact.casesForICUByRequestedTime = smp;
  //    b
  impact.casesForVentilatorsByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.02);
  smp = Math.trunc(severeImpact.infectionsByRequestedTime * 0.02);
  severeImpact.casesForVentilatorsByRequestedTime = smp;
  //    c
  imp = impact.infectionsByRequestedTime * allData.region.avgDailyIncomePopulation;
  impact.dollarsInFlight = Math.trunc((imp * allData.region.avgDailyIncomeInUSD) / days);
  smp = severeImpact.infectionsByRequestedTime * allData.region.avgDailyIncomePopulation;
  severeImpact.dollarsInFlight = Math.trunc((smp * allData.region.avgDailyIncomeInUSD) / days);
  return { data, impact, severeImpact };
};
export default covid19ImpactEstimator;
