module.exports = function(str, regex) {
	let m;
	var ret = {};
	while ((m = regex.exec(str)) !== null) {
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}
		m.forEach((match, groupIndex) => {
			ret[groupIndex] = match;
		});
	}
	return ret;
}
