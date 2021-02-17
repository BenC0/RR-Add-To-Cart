import testConfig from "../testConfig/testConfig.js"
import pollFunction from "./pollFunction.js"
import beethoven from "./beethoven.js"

/* Function to send events to GA. Accepts eventAction and eventLabel as strings and impressionEvent as a boolean (true/false) */
export default function gaSendEvent(variant = "", eventAction = "", impressionEvent = false) {
	if (variant !== "" && eventAction !== "") {
		pollFunction(_ => {
			return typeof ga.getByName === "function"
		}, _ => {
			let trackerName = `${testConfig.id}_cro_tracker`
			let trackerExists = !!ga.getByName(trackerName) || false

			if (!trackerExists) {
				ga("create", "UA-6022948-2", "auto", {
					name: trackerName
				})
			}

			let eventObject = {
				'hitType': "event",
				'eventCategory': "CRO Test Data",
				'eventAction': `${eventAction}`,
				'eventLabel': `${testConfig.id}-${variant}`,
				'eventValue': '1',
				'nonInteraction': 1
			}

			if (impressionEvent !== false) {
				eventObject[`dimension${testConfig.customDimension}`] = `${testConfig.id}: ${variant.replace(/ /g, '-').toLowerCase()}: Loaded`
			}
			
			let beethovenImportance = !testConfig.qa_mode ? "low": "high"
			beethoven(eventObject, beethovenImportance);

			ga(`${trackerName}.send`, eventObject)
		})
	}
}