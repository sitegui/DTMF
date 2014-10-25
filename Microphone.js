/*globals AudioContext*/
'use strict'

/**
 * @class
 */
function Microphone() {
	var that = this

	/** @member {LocalMediaStream} */
	this.stream = null

	/** @member {AudioContext} */
	this.context = new AudioContext

	/** @member {MediaStreamAudioSourceNode} */
	this.source = null

	/** @member {AnalyserNode} */
	this.analyser = this.context.createAnalyser()
	this.analyser.fftSize = 1024
	this.analyser.minDecibels = -90
	this.analyser.maxDecibels = -10
	this.analyser.smoothingTimeConstant = 0.85

	/** @member {Uint8Array} */
	this._data = new Uint8Array(this.analyser.frequencyBinCount)

	navigator.mozGetUserMedia({
		audio: true
	}, function (stream) {
		that.stream = stream
		that.source = that.context.createMediaStreamSource(stream)
		that.source.connect(that.analyser)
	}, function () {
		throw new Error('Failed to get microfone')
	})
}

/**
 * Return the current frequency data
 * If no microphone is attach, all values will be zero
 * The returned array is a pointer to a internal buffer, so multiple calls to this
 * will overwrite previous pointers. Copy the array if you want to keep your copy
 * @returns {Uint8Array}
 */
Microphone.prototype.getFrequencyData = function () {
	this.analyser.getByteFrequencyData(this._data)
	return this._data
}