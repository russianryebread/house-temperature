var utils = {
	fmt: (t) => {
		return `${this.round(t)}°`
	},

	round: (t) => {
		return parseFloat(t).toFixed(1)
	}
}

exports.utils