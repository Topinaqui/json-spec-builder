const fs = require('fs');

class SPECBuilder {

  constructor() {

  }

  buildSpecFrom(jsonFile, resultFolder, fileName = "") {

    console.log("Build from: ", jsonFile, "At: ", resultFolder);

    fs.readFile(jsonFile, "utf8", (error, data) => {
      let message = {};
      if (!error) {

        let object = JSON.parse(data);

        let spec = this.transformObject(object);

        let specFileContent = JSON.stringify(spec);

        let destFilePath = this.createDestFilePath(resultFolder, fileName);

        fs.writeFile(destFilePath, specFileContent, (err) => {

          if (err) throw err;

          console.log(`The Spec was saved! At ${resultFolder}`);
        });

      } else {

        console.log("Was not possible to build a spec.");
      }

    });
  }

  createDestFilePath(resultFolder, fileName) {

    if (fileName.length === 0) {

      fileName = "spec.json";
    }

    let resultFolderLength = resultFolder.length;

    if (resultFolder[(resultFolderLength - 1)] != '/') {

      resultFolder += '/';
    }

    return resultFolder + fileName;
  }

  transformObject(object) {

    let spec = {};

    for (var key in object) {
      if (object.hasOwnProperty(key)) {

        spec[key] = this.makeSpecFor(object[key]);

      }
    }

    return spec;
  }

  makeSpecFor(property) {

    let type = this.checkType(property);
    let specForProperty = {};

    switch (type) {
      case "object": {

        specForProperty = this.processObject(property);
      }
      break;
      case "number": {

        specForProperty = this.processNumber(property);
      }
      break;
      case "string": {

        specForProperty = this.processString(property);
      }
      break;
      case "array": {

        specForProperty = this.processArray(property);
      }
      break;
      case "boolean": {

        specForProperty = this.processBoolean(property);
      }
      break;
      default: {

      }
    }

    return specForProperty;

  }

  processNumber(number) {

    let specForNumber = {};
    let specAttributes = {};

    specAttributes = this.checkNumberAttributes(number);
    specForNumber = this.getNumberSpec(specAttributes);

    return specForNumber;

  }

  processString(string) {

    let specForString = {};
    let specAttributes = {};

    specAttributes = this.checkStringAttributes(string);
    specForString = this.getStringSpec(specAttributes);

    return specForString;
  }

  processObject(object) {

    let specForObject;
    let keys = [];

    specForObject = this.getObjectSpec();

    keys = this.getKeys(object);

    for (let key  in keys) {

      specForObject.keys[keys[key]] = this.makeSpecFor(object[keys[key]]);
    }

    return specForObject;
  }


  processArray(array) {

    let specForArray = {};
    let specAttributes = {};

    specAttributes = this.checkArrayAttributes(array);
    specForArray = this.getArraySpec(specAttributes);

    for (let item in array) {
      if (array.hasOwnProperty(item)) {

        specForArray.items[item] = this.makeSpecFor(array[item]);
      }
    }

    return specForArray;
  }

  processBoolean(boolean) {

    let specForBoolean = {};
    let specAttributes = {};

    specAttributes = this.checkBooleanAttributes(boolean);
    specForBoolean = this.getBooleanSpec(specAttributes);

    return specForBoolean;
  }

  checkNumberAttributes(number) {

    let attributes = {};
    attributes.notNegative = true;
    attributes.required = true;

    if (number < 0) {

      attributes.notNegative = false;
    }

    if (number === 0) {

      attributes.required = false;
    }

    return attributes;
  }

  checkStringAttributes(string) {

    let attributes = {};
    attributes.notEmpty = true;
    attributes.required = true;

    if (string.length === 0) {

      attributes.notEmpty = false;
      attributes.required = false;
    }

    return attributes;
  }

  checkArrayAttributes(array) {

    let attributes = {};
    attributes.notEmpty = false;
    attributes.required = true;

    if (array.length === 0) {

      attributes.notEmpty = false;
      attributes.required = false;
    }

    return attributes;
  }

  checkBooleanAttributes(boolean) {

    let attributes = {};
    attributes.required = true;

    if (boolean === false) {

      attributes.required = false;
    }

    return attributes;
  }

  getKeys(object) {
    return Object.keys(object);
  }

  checkType(target) {

    let suposedType = typeof(target);
    let isBooleanObj = (target instanceof Boolean);
    let type = "";

    if (suposedType === "object" && (!isBooleanObj)) {

      if (typeof(target.length) === "number") {

        type = "array";
      } else {

        type = "object";
      }
    } else if (suposedType === "boolean" || isBooleanObj) {

      type = "boolean";
    } else {

      type = suposedType;
    }

    return type;
  }

  insertStateProperty(obj, name, value) {

    var levels = name.split('.');
    var length = levels.length;

    var nivelAtual;
    var nivelAnterior;

    nivelAtual = obj[levels[0]];

    for (var i = 1; i < length; i++) {

      if (i == (length - 1)) {

        nivelAnterior = nivelAtual;
        nivelAtual = nivelAtual[levels[i]];

        if (typeof(nivelAtual) == "array" || typeof(nivelAtual) == "object") {

          nivelAtual.push(value);

        } else if (typeof(nivelAtual) == "undefined") {

          nivelAnterior[levels[i]] = [];
          nivelAnterior[levels[i]].push(value);

        }
      } else {

        nivelAnterior = nivelAtual;
        nivelAtual = nivelAtual[levels[i]];
      }
    }

    return obj;
  }

  getObjectSpec() {

    let objectSpec = {};
    objectSpec.type = "object";
    objectSpec.required = true;
    objectSpec.keys = {};

    return objectSpec;
  }

  getNumberSpec(attrs = {}) {

    let numberSpec = {};
    numberSpec.type = "number";
    numberSpec.notNegative = true;
    numberSpec.required = true;

    if (attrs.hasOwnProperty("notNegative")) {

      numberSpec.notNegative = attrs.notNegative;
    }

    if (attrs.hasOwnProperty("required")) {

      numberSpec.required = attrs.required;
    }

    return numberSpec;
  }

  getStringSpec(attrs = {}) {

    let stringSpec = {};
    stringSpec.type = "string";
    stringSpec.notEmpty = true;
    stringSpec.required = true;

    if (attrs.hasOwnProperty("notEmpty")) {

      stringSpec.notEmpty = attrs.notEmpty;
    }

    if (attrs.hasOwnProperty("required")) {

      stringSpec.required = attrs.required;
    }

    return stringSpec;
  }

  getArraySpec(attrs = {}) {

    let arraySpec = {};
    arraySpec.type = "array";
    arraySpec.notEmpty = false;
    arraySpec.required = true;
    arraySpec.items = [];

    if (attrs.hasOwnProperty("notEmpty")) {

      arraySpec.notEmpty = attrs.notEmpty;
    }

    if (attrs.hasOwnProperty("required")) {

      arraySpec.required = attrs.required;
    }

    return arraySpec;
  }

  getBooleanSpec(attrs = {}) {

    let booleanSpec = {};
    booleanSpec.type = "boolean";
    booleanSpec.required = true;

    if (attrs.hasOwnProperty("required")) {

      booleanSpec.required = attrs.required;
    }

    return booleanSpec;
  }

}


module.exports = SPECBuilder;
