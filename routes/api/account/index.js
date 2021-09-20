const router = require('express').Router();
const DB = require('../../../DBModels')
const util = require('./util');
const Error = require('../util/error');

const findById = async id => {
	const accountInfo = await DB.Account.findOne({ id });
	return accountInfo;
};

const isExistsById = async id => {
	const accountInfo = await findById(id);
	return !!accountInfo;
};

const isExistsAccountInfo = async (id, pw) => {
	if (!id || !pw) {
		throw new Error.InvalidRequest();
	}

	const accountInfo = await findById(id);
	if (!accountInfo) {
		throw new Error.IncorrectAccount();
	}

	const isEqualPw = await util.isEqualPw(pw, accountInfo.pw);
	if (!isEqualPw) {
		throw new Error.IncorrectAccount();
	}

	return true;
};

const add = async (id, pw, name, nickname) => {
	if (!id || !pw) {
		throw new Error.InvalidRequest();
	}

	const isExistsId = await isExistsById(id);

	if (isExistsId) {
		throw new Error.AlreadyExistsId();
	}
	
	const isExistsNickName = await isExistsById(nickname);
	
	if (isExistsNickName) {
		throw new Error.AlreadyExistsNickName();
	}

	const hashedPw = await util.genHashedPw(pw);
	const newAccountInfo = new DB.Account({ id, pw: hashedPw, name, nickname, projects:[] });

	await newAccountInfo.save()
	return true;
};

const getUserInfo = async (id) => {
	try{
		const { nickname } = await DB.Account.findOne({ id }).lean();
		return { id, nickname }
	} catch (err) {
		next(err);
	}
}

const findUserByWord = async (word) => {
	const accountInfo = await DB.Account.find({id : {$regex : word}});
	return accountInfo;
}

router.post('/signup', async (req, res, next) => {
	try {
		const { id, pw, name, nickname } = req.body;
		const ret = await add(id, pw, name, nickname);
		res.send(ret);
	} catch (err) {
		next(err);
	}
});

router.post('/signin', async (req, res, next) => {
	try {
		const { id, pw } = req.body;
		const ret = await isExistsAccountInfo(id, pw);
		req.session.user = { id };
		res.send(ret);
	} catch (err) {
		next(err);
	}
});

router.get('/signout', (req, res) => {
	req.session.destroy(function(err) {
		if (err) {
			console.log(err);
		} else {
			res.clearCookie('app.sid', { path: '/' });
		}
		res.redirect('/');
	});
});

router.get('/user', async (req,res,next) => {
	try{
		const { id } = req.session.user
		const userInfo = await getUserInfo(id)
		res.json(userInfo)
	} catch(err){
		next(err)
	}
})

router.get('/id', (req, res) => {
	res.send(req.session && req.session.user && req.session.user.id);
});

router.get('/members/:word', async (req, res, next) => {
	try {
		const { id } = req.session.user
		const { word } = req.params;
		const members = await findUserByWord(word);
		const membersExceptUser = members.filter((member) => member.id !== id)
		res.json(membersExceptUser)
	} catch(err) {
		next(err)
	}
})

module.exports = router;