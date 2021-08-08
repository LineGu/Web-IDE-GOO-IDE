const ExtendableError = require('./ExtendableError');

class IncorrectAccount extends ExtendableError {
	constructor(message) {
		super(message);
		this.code = 420;
	}
}

module.exports = IncorrectAccount;