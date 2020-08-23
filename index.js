const resultsBlockSelector = document.querySelector("#results")
const formSubmitId = "submitData"
const inputData = "inputData"

const stateCodes = {
	processing: "processing",
	error: "error",
	success: "success"
}

const errorResponse = {
	"NO_STOCK": {title: "Error page", message: "No stock has been found"},
	"INCORRECT_DETAILS": {title: "Error page", message: "Incorrect details have been entered"},
	null: {title: "Error page", message: null},
	undefined: {title: "Error page", message: null}
}

const responseMessages = {
	noErrorCode: "No such Error code",
	noSuccessCode: "No such Success code",
	noStateCode: "No such State code",
	processingCompleted: "Data processing completed",
	dataFormatError: "The data entered does not correspond to the documentation!: \n",
	syntaxError: "Please, check your syntax. \n",
	inputError: "Sorry, I can't process input!"
}

const successResponse = {
	undefined: {title: "Order complete", message: null}
}

const _throw = (message) => {
	throw message
}

// Delay of processing state in ms
const msDelay = 2000

const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// process error state
const processError = (errorCode) => {
	errorResponse[errorCode] ? appendJSON(errorResponse[errorCode]) : _throw(responseMessages.noErrorCode)
}

// process success state
const processSuccess = (successCode) => {
	successResponse[successCode] ? appendJSON(successResponse[successCode]) : _throw(responseMessages.noSuccessCode)
}

// print output JSON
const appendJSON = (output) => {
	resultsBlockSelector.append(JSON.stringify(output) + "\n")
}

// Process array of state objects
const processData = async (data) => {
	try {
		for (const item of data) {
			switch (item.state) {
				case stateCodes.processing:
					await waitFor(msDelay)
					break
				case stateCodes.error:
					processError(item['errorCode'])
					break
				case stateCodes.success:
					processSuccess(item['successCode'])
					break
				default:
					_throw(responseMessages.noStateCode)
			}
		}
		return responseMessages.processingCompleted
	} catch (error) {
		alert(responseMessages.dataFormatError + error)
		return responseMessages.inputError
	}
}

const getProcessingPage = async (data) => {

	if (Array.isArray(data)) {
		try {
			console.log(await processData(data))
		} catch (error) {
			alert(error)
		}
	}

}

const processForm = async () => {
	// Resetting output from earlier messages
	resultsBlockSelector.innerHTML = ""

	// Define replace for converting input
	const searchRegExp = /'/g;
	const replaceWith = '"';

	let value = document.getElementById(inputData).value.trim()

	if (value) {
		// Converting input
		value = value.replace(searchRegExp, replaceWith)

		try {
			let inputData = (JSON.parse(value))
			await getProcessingPage(inputData)
		} catch (error) {
			alert( responseMessages.syntaxError + error)
		}
	} else {
		alert(responseMessages.inputError)
	}
}

window.addEventListener("load", function () {

	document.getElementById(formSubmitId).addEventListener("click", processForm);

})