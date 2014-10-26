/*globals CellPhone, Generator, Microphone, Visualizer, AudioContext*/
'use strict'

var phone = new CellPhone(document.getElementById('canvas')),
	lowF = [697, 770, 852, 941],
	highF = [1209, 1336, 1477],
	keys = ['123', '456', '789', '*0#'],
	gen = new Generator(lowF.concat(highF)),
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



var fileInput = document.getElementById('file'),
	audioCtx = new AudioContext(),
	analyser = audioCtx.createAnalyser()

analyser.connect(audioCtx.destination)
analyser.smoothingTimeConstant = 0

fileInput.onchange = function () {
	var file = fileInput.files[0],
		fileReader = new FileReader()
	fileReader.readAsArrayBuffer(file)
	fileReader.onload = function () {


		audioCtx.decodeAudioData(fileReader.result, function (buffer) {
			var source = audioCtx.createBufferSource()
			source.buffer = buffer
			source.connect(analyser)
			source.start()
		})
	}
	fileReader.onerror = function () {
		alert('Can\'t read file')
	}
}

var data = new Uint8Array(analyser.frequencyBinCount),
	lastNumber = ''

visualizer = new Visualizer(document.getElementById('canvas2'), function () {
	analyser.getByteFrequencyData(data)
	var lowMax = findMaxInRange(data, freqToDisc(lowF[0]) - 2, freqToDisc(lowF[3]) + 2),
		highMax = findMaxInRange(data, freqToDisc(highF[0]) - 2, freqToDisc(highF[2]) + 2),
		number = keyFromMaxs(lowMax, highMax)
	if (number !== lastNumber) {
		console.log(number)
		lastNumber = number
	}

	return data
})

/**
 * @param {number} lowMax
 * @param {number} highMax
 * @returns {string} - the pressed key, empty if none
 */
function keyFromMaxs(lowMax, highMax) {
	if (lowMax === -1 || highMax === -1) {
		return ''
	}
	var lowIndex = freqIndexFromMax(discToFreq(lowMax), lowF),
		highIndex = freqIndexFromMax(discToFreq(highMax), highF)

	return keys[lowIndex][highIndex]
}

/**
 * @param {number} max - in Hz
 * @param {Array<number>} array
 * @returns {number} - index in the given array
 */
function freqIndexFromMax(max, array) {
	var i
	if (max <= array[0]) {
		return 0
	}
	if (max > array[array.length - 1]) {
		return array.length - 1
	}
	for (i = 0; i < array.length - 1; i++) {
		if (array[i] < max && max <= array[i + 1]) {
			if (max - array[i] > array[i + 1] - max) {
				return i + 1
			}
			return i
		}
	}
}

/**
 * @param {number} freq - frequency in Hz
 * @returns {number} - fft index
 */
function freqToDisc(freq) {
	return Math.round(freq * analyser.frequencyBinCount / audioCtx.sampleRate)
}

/**
 * @param {number} k
 * @returns {number} - frequency in Hz
 */
function discToFreq(k) {
	return Math.round(k * audioCtx.sampleRate / analyser.frequencyBinCount)
}

/**
 * Search for the max value's index. Only if its value is cleary a peak.
 * @param {ArrayBuffer} data
 * @param {number} from
 * @param {number} to
 * @returns {number} - found index or -1 if fails
 */
function findMaxInRange(data, from, to) {
	var i, sum = 0,
		max = 0,
		maxValue = 0
	for (i = from; i < to; i++) {
		sum += data[i]
		if (maxValue < data[i]) {
			max = i
			maxValue = data[max]
		}
	}
	if (maxValue > 1.1 * sum / (to - from)) {
		return max
	}
	return -1
}