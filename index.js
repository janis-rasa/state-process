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
const processError = (errorCode) => {
	appendJSON(errorResponse[errorCode])
}

// process success state
const processSuccess = (successCode) => {
	appendJSON(successResponse[successCode])
}

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
				processError(item['errorCode'])
				break
			case stateCodes.success:
				processSuccess(item['successCode'])
				break
			default:
				throw 'The data entered does not correspond to the documentation!'
		}
	}
}


const getProcessingPage = async (data) => {

	resultsBlockSelector.innerHTML = ''

	if (Array.isArray(data)) {
		try {
			await processData(data).then(r => console.log('all done'))
		} catch (error) {
			alert(error)
		}

	}

}

const processForm = () => {
	const searchRegExp = /'/g;
	const replaceWith = '"';

	let value = document.getElementById(inputData).value.trim()
	if (value) {
		value = value.replace(searchRegExp, replaceWith)
		try {
			let inputData = (JSON.parse(value))
			getProcessingPage(inputData)
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