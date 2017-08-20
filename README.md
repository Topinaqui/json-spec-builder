JSON Spec Builder
=========

Creates a specification file based on a JSON file

## Installation

  `npm install -g json-spec-builder`

## Usage

    json-spec-builder -json /path/to/jsonFile.json -dest /path/to/destinyDir -name theSpecName.json
    
## Description    
    
The jsonFile.json is the file used to create the spec, the spec will be build based on this file, use -dest option to inform where to place the new created spec and -name option to specify the name of the spec to be created, if the -name is not informed the spec will be created as spec.json.
