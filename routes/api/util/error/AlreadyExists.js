const ExtendableError = require('./ExtendableError');

class AlreadyExists extends ExtendableError {
	constructor(message) {
		super(message || 'AlreadyExists');
		this.code = 419;
	}
}

module.exports = AlreadyExists;