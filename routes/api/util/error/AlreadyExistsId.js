const ExtendableError = require('./ExtendableError');

class AlreadyExistsId extends ExtendableError {
	constructor(message) {
		super(message || 'AlreadyExists');
		this.code = 419;
	}
}

module.exports = AlreadyExistsId;