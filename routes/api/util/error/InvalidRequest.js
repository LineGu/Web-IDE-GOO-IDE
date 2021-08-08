const ExtendableError = require('./ExtendableError');

class InvalidRequest extends ExtendableError {
	constructor(message) {
		super(message);
		this.code = 400;
	}
}

module.exports = InvalidRequest;