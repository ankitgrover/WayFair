"use strict";
/*
We are working on a security system for a badged-access room in our company's building.

We want to find employees who badged into our secured room unusually often. We have an unordered list of names and entry times over a single day. Access times are given as numbers up to four digits in length using 24-hour time, such as "800" or "2250".

Write a function that finds anyone who badged into the room three or more times in a one-hour period. Your function should return each of the employees who fit that criteria, plus the times that they badged in during the one-hour period. If there are multiple one-hour periods where this was true for an employee, just return the earliest one for that employee.

badge_times = [
  ["Paul",     "1355"],
  ["Jennifer", "1910"],
  ["John",      "835"],
  ["John",      "830"],
  ["Paul",     "1315"],
  ["John",     "1615"],
  ["John",     "1640"],
  ["Paul",     "1405"],
  ["John",      "855"],
  ["John",      "930"],
  ["John",      "915"],
  ["John",      "730"],
  ["John",      "940"],
  ["Jennifer", "1335"],
  ["Jennifer",  "730"],
  ["John",     "1630"],
  ["Jennifer",    "5"]
]

Expected output (in any order)
  John:  830  835  855  915  930
  Paul: 1315 1355 1405

n: length of the badge records array

*/
const HOUR_LENGTH_IN_MINUTES = 60;
const badgeTimes = [
  ["Paul",     "1355"],
  ["John",      "835"],
  ["John",      "830"],
  ["Paul",     "1315"],
  ["John",     "1615"],
  ["John",     "1640"],
  ["Paul",     "1405"],
  ["John",      "855"],
  ["John",      "930"],
  ["John",      "915"],
  ["John",      "730"],
  ["John",      "940"],
  ["Jennifer", "1335"],
  ["Jennifer",  "730"],
  ["John",     "1630"],
  ["Jennifer",    "5"]
];

console.log(solution(badgeTimes));

function solution(badgeTimes) {
  let employeeTimesMap = getEmployeeBasedKeyMapWithTimes(badgeTimes);
  for(const [key, value] of employeeTimesMap) {
    employeeTimesMap.set(key, getSortedArrayInMinutes(value));
  }
  return getViolators(employeeTimesMap);
}

/*
*  use map to create unique buckets of each employee with array of all entering times, key being unique employee name
*/
function getEmployeeBasedKeyMapWithTimes(badgeTimes){
  let employeeMap = new Map();
  for(let i = 0; i<badgeTimes.length; i++) {
    const empName = badgeTimes[i][0];
    const time = badgeTimes[i][1];
    if(employeeMap.has(empName)) {
      let existingArrInMap =  employeeMap.get(empName);
      employeeMap.set(empName, existingArrInMap.concat(time));
    } else {
      employeeMap.set(empName, [time]);
    }
  }
  return employeeMap;
}

/*
* Logic to check continuous entries within 1 hour window
* */
function getViolators(baseMap) {
  let violatorsWithTimes = [];
  for(const [key, value] of baseMap) {
    // if violator...add to new violatorsWithTimes else clear array
    for(let i=0; i<value.length-1; i++){
      let ithOnwardArray = [];
      ithOnwardArray.push(value[i]);
      for(let j=i+1; j<value.length ;j++){
        if(value[j]-value[i] <= HOUR_LENGTH_IN_MINUTES){
          ithOnwardArray.push(value[j]);
        }
      }
      if(ithOnwardArray.length >= 3) {
        const militaryTimes = ithOnwardArray.map(totalMinutes => convertMinutesToMilitaryTime(totalMinutes));
        violatorsWithTimes.push(generateRequiredFormat(key, militaryTimes));
        break;
      } else {
        ithOnwardArray.length = 0;
      }
    }
  }
  return violatorsWithTimes;
}

// Utility methods
function getSortedArrayInMinutes(valueArr) {
  return (valueArr.map((i) => convertMilitaryTimeToMinutes(i))).sort();
}

function convertMilitaryTimeToMinutes(militaryTime) {
  let result = 0;
  const militaryTimeStringLength = militaryTime.length;
  result = militaryTimeStringLength <= 2 ? Number(militaryTime) :
    Number(militaryTime.substring(militaryTimeStringLength-2, militaryTimeStringLength)) +
    HOUR_LENGTH_IN_MINUTES * Number(militaryTime.substring(0,militaryTimeStringLength-2))
  return result;
}

function convertMinutesToMilitaryTime(totalMinutes) {
  let hours = Math.round((totalMinutes / HOUR_LENGTH_IN_MINUTES), 0);
  let minutes = totalMinutes % HOUR_LENGTH_IN_MINUTES;
  return hours.toString() + minutes.toString();
}

function generateRequiredFormat(key, militaryTimes){
  return key + ": " + militaryTimes.join(" ")
}
