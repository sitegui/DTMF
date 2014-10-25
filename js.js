/*globals CellPhone, Generator*/
'use strict'

var phone = new CellPhone(document.getElementById('canvas')),
	lowF = [697, 770, 852, 941],
	highF = [1209, 1336, 1477],
	keys = ['123', '456', '789', '*0#'],
	gen = new Generator(lowF.concat(highF)),
	fMap

fMap = (function () {
	var map = Object.create(null),
		y, x
	for (x = 0; x < 3; x++) {
		for (y = 0; y < 4; y++) {
			map[keys[y][x]] = [lowF[y], highF[x]]
		}
	}
	return map
})()

phone.onkeydown = function (key) {
	gen.start(fMap[key][0])
	gen.start(fMap[key][1])
}
phone.onkeyup = function (key) {
	gen.stop()
}