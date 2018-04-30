HL7 FHIR Validation API Server
==============================

The `hl7-fhir-validator` provides an API endpoint to validate that the HL7 FHIR resources are valid.

This work was done to formulate a HL7 FHIR validation based on JSON schema specification, as an alternative to hard-coded logic. The complete HL7 FHIR specification was optimized from the original 35,000 lines to just 1000 lines of relevant JSON schema.

The JSEN JSON validator is used. It provides built-in validation directive and custom validation functions.

The following HL7 FHIR resources are specific to the Immunization Connect Ontario (ICON) initiative (Ministry of Health Ontario):
- Communication: the bundle for immunization submission, including Attachment
- Immunization: one of more vaccinations
- Patient: the recipient of the immunization, including Address
- RelatedPerson: the dependent guardian or self
- Organization: the immunization administering organization

NPM commands:
- `> npm start` runs the server in __production__ mode
- `> npm run dev` runs the server in __development__ mode (debug, hot-reload enabled)

The manifest.yml is included which is used for CloudFoundry deployment.
