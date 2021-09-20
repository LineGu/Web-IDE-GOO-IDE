const ExtendableError = require('./ExtendableError');

class AlreadyExistsNickName extends ExtendableError {
	constructor(message) {
		super(message || 'AlreadyExists');
		this.code = 420;
	}
}

module.exports = AlreadyExistsNickName;