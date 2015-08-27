function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

var sent_msg = project.sendMessage({
	content: contact.name + ": " + message.content, 
    to_number: "+639189362340"
});