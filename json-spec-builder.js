#!/usr/bin/env node

const ArgumentHandler = require("./lib/ArgumentHandler");
const SPECBuilder = require('./lib/SPECBuilder');

module.exports = function() {

  let oArgumentHandler = new ArgumentHandler(process.argv);
  let jsonFile = "";
  let resultFolder = "";

  if (jsonFile = oArgumentHandler.getLineParam("-json"))
    if(resultFolder = oArgumentHandler.getLineParam("-dest")){

    //Verificar os parâmetros
    let Builder = new SPECBuilder();

    let fileName = oArgumentHandler.getLineParam("-name");

    Builder.buildSpecFrom(jsonFile, resultFolder, (fileName || ""));
  } else {

    console.log("Verifique se forneceu os parâmetros -json e -dest.");
  }

}
