var SERVER_NAME = 'healthcare-api'
var PORT = 3234;
var HOST = '127.0.0.1';


var restify = require('restify')

  // Get a persistence engine for the patients
  , patientsSave = require('save')('patients')
  , recordsSave = require('save')('records')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})
 
server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

  .use(restify.plugins.queryParser());

  server.listen(PORT, HOST, function () {
    console.log('Server %s listening at %s', server.name, server.url)
    console.log('Endpoints:')
    console.log('%s/patients method: GET, POST', server.url)
    console.log('Resources:')
    console.log(' /patients\n/patients/:id')
  })


// All resourse request defined
server.get('/patients', getAllPatients)
server.get('/patients/:id/records', getRecordById)
server.get('/patients/:id', getPatientById)
server.post('patients', addPatient)
server.post('/patients/:id/records', addRecordById)
server.put('/patients/:id', updatePatientById)
server.put('/patients/:id/records', updateRecordById)
server.del('/patients/:id',deletePatientById)
server.del('/patients',deleteAllPatients)


//get all the Patients
function getAllPatients(req, res, next) {

  console.log("Patients GET: received request")
  // Find every entity within the given collection
  patientsSave.find({}, function (error, patients) {

    // Return all of the patients in the system
    console.log("patients GET: sending response")
    res.send(patients)
    next()

  })
}
// Get a single patients by their patient id
function getPatientById(req, res, next) {

  // Find a single patient by their id within save
  patientsSave.findOne({ _id: req.params.id }, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (patient) {
      // Send the patient  if no issues
      res.send(patient)
    } else {
      // Send 404 header if the patient doesn't exist
      res.send(404)
    }
  })
}

// Get a single patients by their patient id
function getRecordById(req, res, next) {

  // Find a single patient by their id within save
  recordsSave.find({ patient_id: req.params.id }, function (error, record) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (record) {
      // Send the patient  if no issues
      res.send(record)
    } else {
      // Send 404 header if the patient doesn't exist
      res.send(404)
    }
  })
}

// Create a new patient
function addPatient(req, res, next) {

  console.log("patient POST: received request")

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.gender === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('gender must be supplied'))
  }
  if (req.params.date_of_birth === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Date of birth must be supplied'))
  }
  if (req.params.address === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('address must be supplied'))
  }
  if (req.params.doctor === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('doctor must be supplied'))
  }
  if (req.params.department === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('department must be supplied'))
  }

  var newPatient = {
		    patient: req.params.name, 
        gender: req.params.gender,
        date_of_birth: req.params.date_of_birth,
        address: req.params.address,
        doctor: req.params.doctor,
        department: req.params.department
	}

  // Create the patient using the persistence engine
  patientsSave.create( newPatient, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the patient if no issues
    console.log("patient POST: sending response")
    res.send(201, patient)
    next()
  })
}

// Create a new patient
function addRecordById(req, res, next) {
  var patientId
  console.log("patient POST: received request")

  // Make sure name is defined
  if (req.params.date === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Date must be supplied'))
  }
  if (req.params.nurse === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Nurse must be supplied'))
  }
  if (req.params.category === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Category must be supplied'))
  }
  if (req.params.readings === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Readings must be supplied'))
  }
  // Find a single patient by their id
  patientsSave.findOne({ _id: req.params.id }, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (patient) {
      // Send the patient  if no issues
      patientId = patient._id
        } else {
      // Send 404 header if the patient doesn't exist
      res.send(404)
    }
  })
 
  var newRecord = {
    patient_id: patientId,
    date: req.params.date,
    nurse: req.params.nurse,
    category: req.params.category,
    readings :{
      diastolic: req.params.readings.diastolic,
      systolic: req.params.readings.systolic 
    }
  }
  
  // Create the patient using the persistence engine
  recordsSave.create( newRecord, function (error, record) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the patient if no issues
    console.log("patient POST: sending response")
    res.send(201, record)
    next()
  })
}


// Update a user by their id
function updatePatientById(req, res, next) {

  console.log("patient PUT: received request")

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.gender === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('gender must be supplied'))
  }
  if (req.params.date_of_birth === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Date of birth must be supplied'))
  }
  if (req.params.address === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('address must be supplied'))
  }
  if (req.params.doctor === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('doctor must be supplied'))
  }
  if (req.params.department === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('department must be supplied'))
  }

  var newPatient = {
        _id: req.params.id,
		    patient: req.params.name, 
        gender: req.params.gender,
        date_of_birth: req.params.date_of_birth,
        address: req.params.address,
        doctor: req.params.doctor,
        department: req.params.department
	}
  
  // Update the user with the persistence engine
  patientsSave.update(newPatient, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
}


// Update a user by their id
function updateRecordById(req, res, next) {

  var patientId
  console.log("patient PUT: received request"+req.query.RID)

  // Make sure name is defined
  if (req.params.date === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Date must be supplied'))
  }
  if (req.params.nurse === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Nurse must be supplied'))
  }
  if (req.params.category === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Category must be supplied'))
  }
  if (req.params.readings === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('Readings must be supplied'))
  }
  // Find a single patient by their id
  patientsSave.findOne({ _id: req.params.id }, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError("Dipal"+JSON.stringify(error.errors)))

    if (patient) {
      // Send the patient  if no issues
      patientId = patient._id
        } else {
      // Send 404 header if the patient doesn't exist
      res.send(404)
    }
  })
 
  var newRecord = {
    _id: req.query.RID,
    patient_id: patientId,
    date: req.params.date,
    nurse: req.params.nurse,
    category: req.params.category,
    readings :{
      diastolic: req.params.readings.diastolic,
      systolic: req.params.readings.systolic 
    }
    
  }
  
  // Update the user with the persistence engine
  recordsSave.update(newRecord, function (error, record) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError("Dipal1"+JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
}

// Delete user with the given id
function deletePatientById(req, res, next) {

  // Delete the user with the persistence engine
  patientsSave.delete(req.params.id, function (error, patient) {
    
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError("Dipal2"+JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
  
  /*recordsSave.delete(patient_id, function (error, record) {
    

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError("Dipal2"+JSON.stringify(error.errors)))

    // Send a 200 OK response
    //res.send()
  })*/
}

// Delete user with the given id
function deleteAllPatients(req, res, next) {

  // Delete the user with the persistence engine
  patientsSave.delete({}, function (error, patients) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
}
  


