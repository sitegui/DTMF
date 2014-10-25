'use strict'

/**
 * @class
 * @param {HTMLCanvasElement} canvas
 */
function CellPhone(canvas) {
	var that = this

	/** @member {HTMLCanvasElement} */
	this.canvas = canvas

	/** @member {Context} */
	this.cntxt = this.canvas.getContext('2d')

	/** @member {Image} */
	this.image = new Image()
	this.image.src = 'img/2280.png'

	/** @member {?function(string)} */
	this.onkeydown = null
	this.onkeyup = null
	this.onkeypress = null

	// Draw background
	this.image.onload = function () {
		that.canvas.width = that.image.width
		that.canvas.height = that.image.height
		that.cntxt.drawImage(that.image, 0, 0)
	}

	// Add mouse listeners
	this.canvas.onmousedown = function (event) {
		processKey('down', event.clientX, event.clientY)
	}
	this.canvas.onmouseup = function (event) {
		processKey('up', event.clientX, event.clientY)
	}
	this.canvas.onclick = function (event) {
		processKey('press', event.clientX, event.clientY)
	}

	function processKey(event, x, y) {
		var rect = that.canvas.getBoundingClientRect(),
			key = that.getKeyAt(x - rect.left, y - rect.top)
		if (key && that['onkey' + event]) {
			that['onkey' + event].call(that, key)
		}
	}
}

/**
 * Return the key name under the given point (like '1', '*', '#', etc)
 * @param {number} x
 * @param {number} y
 * @returns {string} - empty string if no key was found
 */
CellPhone.prototype.getKeyAt = function (x, y) {
	var keys = ['123', '456', '789', '*0#']
	x = Math.floor((x - 33) / 42)
	y = Math.floor((y - 250) / 27)
	return x >= 0 && x < 3 && y >= 0 && y < 4 ? keys[y][x] : ''
}