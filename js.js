/*globals CellPhone, Generator, Microphone, Visualizer*/
'use strict'

var phone = new CellPhone(document.getElementById('canvas')),
	lowF = [697, 770, 852, 941],
	highF = [1209, 1336, 1477],
	keys = ['123', '456', '789', '*0#'],
	gen = new Generator(lowF.concat(highF)),
	microphone = new Microphone(),
	visualizer, fMap

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

phone.onkeypress = function (key) {
	gen.start(fMap[key][0], 200)
	gen.start(fMap[key][1], 200)
}

visualizer = new Visualizer(document.getElementById('canvas2'), function () {
	return microphone.getFrequencyData()
})

var fileInput = document.getElementById('file')
fileInput.onchange = function () {
	var file = fileInput.files[0],
		fileReader = new FileReader()
	fileReader.readAsArrayBuffer(file)
	fileReader.onload = function () {
		var audioEl = document.createElement('audio'),
			blob = new Blob([fileReader.result])
		audioEl.src = URL.createObjectURL(blob)
		document.body.appendChild(audioEl)
		audioEl.play()

	}
	fileReader.onerror = function () {
		alert('Can\'t read file')
	}
}