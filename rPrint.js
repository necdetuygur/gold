module.exports = function (msg, ms){
	console.log(msg);
	time = new Date() * 1 + ms;
	while(time > (new Date() * 1))1;
}