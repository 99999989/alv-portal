const minimist = require('minimist');
const fs = require('fs');
const _ = require('lodash');


let compare = function (leftObject, rightObject) {

  let result = {
    missingFromFirst: [],
    missingFromSecond: []
  };

  _.reduce(leftObject, function (result, value, key) {
    if (rightObject.hasOwnProperty(key)) {
      if (_.isEqual(value, rightObject[key])) {
        return result;
      } else {
        if (typeof (leftObject[key]) != typeof ({}) || typeof (rightObject[key]) != typeof ({})) {
          return result;
        } else {
          let deeper = compare(leftObject[key], rightObject[key]);
          result.missingFromSecond = result.missingFromSecond.concat(_.map(deeper.missingFromSecond, (sub_path) => {
            return key + "." + sub_path;
          }));

          result.missingFromFirst = result.missingFromFirst.concat(_.map(deeper.missingFromFirst, (sub_path) => {
            return key + "." + sub_path;
          }));
          return result;
        }
      }
    } else {
      result.missingFromSecond.push(key);
      return result;
    }
  }, result);

  _.reduce(rightObject, function (result, value, key) {
    if (leftObject.hasOwnProperty(key)) {
      return result;
    } else {
      result.missingFromFirst.push(key);
      return result;
    }
  }, result);

  return result;
};

const argv = minimist(process.argv.slice(2));
let firstFileName = argv._[0];
let secondFileName = argv._[1];

if (!firstFileName || !secondFileName) {
  console.error("You need to provide two files for comparing?");
  process.exit(-1);
}

if (argv.help) {
  console.info(`
    Shows deep the difference between the two objects in json files 
    Usage: node compareObjects.js FILE1.json FILE2.json
    
    FILE1.json is the json file generated by the ngx-translate-extract tool 
    from the source code 
    FILE2.json is the json file generated from the csv file by csv2json-i18n tool 
    
    `);
  process.exit(-1);
}

var obj1 = JSON.parse(fs.readFileSync(firstFileName, 'utf8'));
var obj2 = JSON.parse(fs.readFileSync(secondFileName, 'utf8'));

console.log(JSON.stringify(compare(obj1, obj2), null, 2));



