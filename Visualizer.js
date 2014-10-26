'use strict'

/**
 * @class
 * @param {HTMLCanvasElement} canvas
 * @param {function():Uint8Array} sourceFn
 */
function Visualizer(canvas, sourceFn) {
	/** @member {HTMLCanvasElement} */
	this.canvas = canvas

	/** @member {CanvasRenderingContext2D} */
	this.context = canvas.getContext('2d')

	/** @member {function():Uint8Array} */
	this.sourceFn = sourceFn

	this.__draw = this._draw.bind(this)

	window.requestAnimationFrame(this.__draw)
}

/**
 * Draw the data into the canvas
 * @private
 */
Visualizer.prototype._draw = function () {
	var data = this.sourceFn(),
		cntxt = this.context,
		w = this.canvas.width,
		h = this.canvas.height,
		x = 0,
		dx, len, i, bh, r, g, b

	len = Math.floor(data.length / 4)
	cntxt.fillStyle = 'white' //'rgba(255, 255, 255, .1)'
	cntxt.fillRect(0, 0, w, h)
	cntxt.moveTo(0, h / 2)
	dx = w / len
	for (i = 0; i < len; i++) {
		bh = h * data[i] / 255
		r = (data[i] + 256) / 2
		g = 128 - data[i] / 4
		b = 0
		cntxt.fillStyle = 'rgb(' + (r | 0) + ', ' + (g | 0) + ', ' + (b | 0) + ')'
		cntxt.fillRect(x, h - bh, dx, bh)
		x += dx
	}

	window.requestAnimationFrame(this.__draw)
}