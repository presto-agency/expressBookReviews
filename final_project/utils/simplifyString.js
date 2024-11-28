const simplifyString = (str) => {
	if (str) {
		return str.replace(/\s/g,'').toLowerCase()
	} else {
		return ''
	}
}

module.exports = { simplifyString }