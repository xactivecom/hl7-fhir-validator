'use strict'

const express = require('express'),
  app = express()
const path = require('path')

// Set the directory base to the project directory path
global.__base = path.resolve(__dirname, './')

// Define service port
const servicePort = process.env.PORT || 8080

// FHIR validator
const validator = require(__base + '/server/fhir/fhir-validator')
const converter = require(__base + '/server/fhir/outcome-converter')
const logger = require(__base + '/server/logger')

// Provide information page as default
app.use(express.static(__dirname + '/public'))

// Handle FHIR validation
app.post('/api/validate', function (req, res) {
  try {

    // Validate request body
    //let testSubmissionId = 'YAHTZEE001';
    //let result = validator.validate(req.body, testSubmissionId);
    let result = validator.validate(req.body);
    if (!result.isValid) {
      result.errors.forEach(error => {
        let errmsg = error.keyword;
        if (error.message)
          errmsg += ' - ' + error.message
        console.log(`invalid: ${error.path} - ${errmsg}`)
      })
      logger.log('warn', Object.assign({
        processType: 'app;validate',
        message: 'Invalid FHIR request'
      }))

      // Prepare OperationOutcome response
      const outcome = converter.convertErrorsToOutcome('AAAAA001', result.errors)
      res.status(422).json(outcome)
    } else {
      // TODO: continue downstream processing
      logger.log('info', Object.assign({
        processType: 'app;validate',
        message: 'Valid FHIR request'
      }))
      res.status(201).end()
    }
  } catch (e) {
    logger.log('error', Object.assign({
      processType: 'app;validate',
      message: 'Invalid FHIR request - ' + e.message
    }))
    res.status(422).send(e.message)
  }
})

// Light up
app.listen(servicePort);
console.log(`fhir-validator started on port ${servicePort}`)