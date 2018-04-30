'use strict'

/***** Private functions *****/

/**
 * OperationalOutcome model object.
 *
 * An OperationOutcome is a set of errors, warnings and information messages that provide
 * detail about the outcome of an system operation in the event of a failure condition.
 *
 * At least one Issue must be added to be a valid operation outcome.
 * status: generated | extensions | additional | empty
 */
function OperationOutcome(id,
                          status,
                          content,
                          issues) {
  this.id = id || ''
  this.status = status || ''
  this.content = content || ''
  this.issues = issues || []
}

/**
 * An OperationOutcome Issue is a single error, warning or information message that provides
 * detail about the outcome of an system operation in the event of a failure condition.
 *
 * severity: fatal | error | warning | information (see https://www.hl7.org/fhir/valueset-issue-severity.html)
 * code: structure | required |...| (see https://www.hl7.org/fhir/valueset-issue-type.html)
 */
function Issue(severity,
               code,
               detailId,
               detailText,
               location,
               diagnostics) {
  this.severity = severity || '' // required
  this.code = code || '' // required
  this.detailId = detailId || '' // required
  this.detailText = detailText || '' // required
  this.location = location || ''
  this.diagnostics = diagnostics || ''
}

/**
 * Convert an array of errors to FHIR Operation Outcome JSON string.
 *
 * @param {String} errors array of error objects
 * @return {String} FHIR Operation Outcome string
 */
function convertErrorsToOutcome(id, errors) {
  // Integrity check
  if (!errors)
    return null

  let htmlContent = ''
  let issues = []

  // Convert errors to Operation Outcome format
  errors.forEach(error => {

    let code = error.keyword || ''
    let location = error.path || ''
    let detail = error.message || ''

    let issue = new Issue('error', code, '', detail, location, '')
    issues.push(issue)
    htmlContent += `<p>${location} ${code} ${detail}</p>`
  })

  // Encapsulate errors in an Operation Outcome object
  htmlContent = `<div>${htmlContent}</div>`
  let outcome = new OperationOutcome(id, 'generated', htmlContent, issues)

  return JSON.stringify(outcome)
}


/***** Public functions *****/

/**
 * Public function: Convert an array of errors to FHIR Operation Outcome JSON string.
 *
 * @param {String} errors array of error objects
 * @return {String} FHIR Operation Outcome string
 */
exports.convertErrorsToOutcome = function(id, errors) {
  return convertErrorsToOutcome(id, errors)
}
