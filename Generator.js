/*globals AudioContext*/
'use strict'

/**
 * @class
 * @param {Array<number>} frequencies
 */
function Generator(frequencies) {
	/** @member {AudioContext} */
	this.context = new AudioContext

	/**
	 * A map from frequency to oscillator
	 */
	this.oscillators = Object.create(null)

	frequencies.forEach(function (f) {
		var oscillator = this.context.createOscillator()
		oscillator.frequency.value = f
		//oscillator.connect(this.context.destination)
		oscillator.start()
		this.oscillators[f] = oscillator
	}, this)
}

/**
 * @param {number} freq
 */
Generator.prototype.start = function (freq) {
	this.oscillators[freq].connect(this.context.destination)
}

/**
 * @param {number} [freq] - if not present, stop all oscillators
 */
Generator.prototype.stop = function (freq) {
	if (freq) {
		this.oscillators[freq].disconnect(this.context.destination)
	} else {
		Object.keys(this.oscillators).forEach(function (freq) {
			this.oscillators[freq].disconnect(this.context.destination)
		}, this)
	}
}