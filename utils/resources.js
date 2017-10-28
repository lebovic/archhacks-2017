// @todo: make more efficient
function findResourceType(textMessage) {
	// @todo: add more resources
	const allResources = ["food", "water"];
	const lowerTextMessage = textMessage.toLowerCase();
	const parsedMessage = {
		resources: [],
		text: "",
	};

	// Find, note, and remove all resources from text
	for (var i = 0; i < allResources.length; i++) {
		if (lowerTextMessage.indexOf(allResources[i]) !== -1) {
			parsedMessage.resources.push(allResources[i]);
			if (!parsedMessage.text) {
				parsedMessage.text = lowerTextMessage.replace(allResources[i], "");
			} else {
				parsedMessage.text = parsedMessage.text.replace(allResources[i], "");
			}
		}
	}

	return parsedMessage;
}

module.exports = {
	findResourceType,
}