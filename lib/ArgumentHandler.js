class ArgumentHandler {
  constructor(argv = []) {

    this.args = argv.slice(2);
    this.length = this.args.length;
  }

  hasTheOption(option) {

    let optionType = typeof(option);

    if(optionType != "string") {

      console.log("Invalid option");
      return false;
    }

    option = this.correctLineOption(option);

    let hasOption = this.args.includes(option);

    return hasOption;
  }

  getLineParam(lineParam) {

    if (!this.hasTheOption(lineParam)) {

      return null;
    }

    //Line -

    lineParam = this.correctLineOption(lineParam);

    let index = this.args.indexOf(lineParam);
    console.log(lineParam, index);
    let value = this.args[(index+1)];

    if (value.startsWith('-')) {
      value = "";
    }

    return value;
  }

  correctLineOption(option) {

    if (option[0] != '-') {

      option = '-' + option;
    }

    return option;
  }


}

module.exports = ArgumentHandler;
