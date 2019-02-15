const minimist = require('minimist');
const fs = require('fs');
const _ = require('lodash');

function isPrimitive(test) {
  return (test !== Object(test));
}


function serialize(obj, prefix) {
  const res = [];

  function serializeAllKeys(obj, arrPath) {
    if (!arrPath) {
      arrPath = [];
    }
    if (isPrimitive(obj)) {
      res.push(arrPath.join('.'));
    } else {
      for (let key in obj) {
        const value = obj[key];
        serializeAllKeys(value, arrPath.concat(key));
      }
    }
  }

  serializeAllKeys(obj);
  const res2 = res.map(x => prefix + '.' + x);
  // console.log(res2);
  return res2;
}

function compare(leftObject, rightObject) {

  let result = {
    missingFromSecond: []
  };

  _.reduce(leftObject, function (result, value, key) {
    if (rightObject.hasOwnProperty(key)) {
      if (_.isEqual(value, rightObject[key])) {
        return result;
      } else {
        if (isPrimitive(leftObject[key]) || isPrimitive(rightObject[key])) {
          return result; // primitive type
        } else {
          let deeper = compare(leftObject[key], rightObject[key]);
          result.missingFromSecond = result.missingFromSecond.concat(_.map(deeper.missingFromSecond, (sub_path) => {
            return key + "." + sub_path;
          }));
          return result;
        }
      }
    } else if (!isPrimitive(leftObject[key])) {
      //need to list all its children
      result.missingFromSecond.push(...serialize(leftObject[key], key));
      return result;
    }
    result.missingFromSecond.push(key);
    return result;
  }, result);

  return result;
}

const argv = minimist(process.argv.slice(2));
let firstFileName = argv._[0];
let secondFileName = argv._[1];

if (!firstFileName || !secondFileName) {
  console.error("You need to provide two files for comparison");
  process.exit(-1);
}

if (argv.help) {
  console.info(`
    Shows deep the difference between the two objects in json files 
    Usage: node compare_objects.js FILE1.json FILE2.json
    
    FILE1.json is the json file generated by the ngx-translate-extract tool 
    from the source code 
    FILE2.json is the json file generated from the csv file by csv2json-i18n tool 
    
    `);
  process.exit(-1);
}

const obj1 = JSON.parse(fs.readFileSync(firstFileName, 'utf8'));
const obj2 = JSON.parse(fs.readFileSync(secondFileName, 'utf8'));
console.log(
  compare(obj1, obj2).missingFromSecond.join('\n')
);
