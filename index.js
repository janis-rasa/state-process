const resultsBlockSelector = document.querySelector('#results')
const formSubmitId = 'submitData'
const inputData = 'inputData'

const stateCodes = {
	processing: "processing",
	error: "error",
	success: "success"
}

const errorResponse = {
	"NO_STOCK": { title: 'Error page', message: 'No stock has been found' },
	"INCORRECT_DETAILS": { title: 'Error page', message: 'Incorrect details have been entered' },
	"null": { title: 'Error page', message: null },
	"undefined": { title: 'Error page', message: null }
}

const successResponse = {
	"undefined": { title: "Order complete", message: null }
}

// Delay of processing state in ms
const msDelay = 2000

const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// process error state
const processError = (errorCode) => errorResponse[errorCode]

// process success state
const processSuccess = (successCode) => successResponse[successCode]

// print output JSON
const appendJSON = (output) => {
	resultsBlockSelector.append(JSON.stringify(output) + "\n")
}

// Process array of state objects
const processData = async (data) => {
	for (const item of data) {
		switch (item.state) {
			case stateCodes.processing:
				await waitFor(msDelay)
				break
			case stateCodes.error:
				appendJSON(processError(item['errorCode']))
				break
			case stateCodes.success:
				appendJSON(processSuccess(item['successCode']))
				break
			default:
				throw 'The data entered does not correspond to the documentation!'
		}
	}
	return 'Data processing completed'
}


const getProcessingPage = async (data) => {

	if (Array.isArray(data)) {
		try {
			return await processData(data).then(response => response)
		} catch (error) {
			alert(error)
		}
	}

}

const processForm = () => {
	// Resetting output from earlier messages
	resultsBlockSelector.innerHTML = ''
	// Define replace for converting input
	const searchRegExp = /'/g;
	const replaceWith = '"';

	let value = document.getElementById(inputData).value.trim()

	if (value) {
		// Converting input
		value = value.replace(searchRegExp, replaceWith)

		try {
			let inputData = (JSON.parse(value))
			getProcessingPage(inputData).then(response => console.log(response))
		} catch (error) {
			alert("Please, check your syntax. \n" + error)
		}
	} else {
		alert('Sorry, I can\'t process input!' )
	}
}

window.addEventListener("load", function () {

	document.getElementById(formSubmitId).addEventListener("click", processForm);

})