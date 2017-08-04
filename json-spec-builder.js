#!/usr/bin/env node

const ArgumentHandler = require("./lib/ArgumentHandler");
const SPECBuilder = require("./lib/SPECBuilder");

  let oArgumentHandler = new ArgumentHandler(process.argv);
  let jsonFile = "";
  let resultFolder = "";

  jsonFile = oArgumentHandler.getLineParam("-json");
  resultFolder = oArgumentHandler.getLineParam("-dest")

    if(jsonFile && resultFolder) {

    let Builder = new SPECBuilder();

    let fileName = oArgumentHandler.getLineParam("-name");

    Builder.buildSpecFrom(jsonFile, resultFolder, (fileName || ""));
  } else {

    console.log("Verify if you supplied -json and -dest parameters.");
  }
