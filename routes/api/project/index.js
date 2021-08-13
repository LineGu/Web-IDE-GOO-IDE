const router = require('express').Router();
const DB = require('../../../models/DB')
const Error = require('../util/error');

const findByIdAndTitle = async (id,title) => {
	const projectInfo = await DB.Project.findOne({ _creator:id, title });
	return projectInfo;
};

const isExistsByIdAndTitle = async (id,title) => {
	const projectInfo = await findByIdAndTitle(id,title);
	return !!projectInfo;
};

const getProjectsSummary = async id => {
	const data = await DB.Project.find({ _creator:id }).lean()
	return data
}

const addProject = async (id,title,body) => {
	if (!title) {
		throw new Error.InvalidRequest()
	}
	
	const isExists = await isExistsByIdAndTitle(id,title);
	
	if (isExists) {
		throw new Error.AlreadyExists();
	}
	
	const newProject = new DB.Project({ _creator:id, title, body, files:'' })
	await newProject.save()
	return true
}

const setFiles = async (id,title,files) => {
	if (!title) {
		throw new Error.InvalidRequest()
	}
	
	const project = await findByIdAndTitle(id, title)
	project.files = JSON.stringify(files)
	await project.save()
	return true
}



router.get('/', async (req, res, next) => {
	try {
		const { id } = req.session.user
		const data = await getProjectsSummary(id);
		res.json(data);
	} catch (err) {
		next(err);
	}
});

router.get('/info/:title', async (req, res, next) => {
	try {
		const { id } = req.session.user
		const { title } = req.params;
		const data = await findByIdAndTitle(id,title);
		res.json(data);
	} catch (err) {
		next(err);
	}
});

router.post('/new', async (req, res, next) => {
	try {
		const { id } = req.session.user
		const { title, body } = req.body;
		const ret = await addProject(id, title, body);
		res.send(ret);
	} catch (err) {
		next(err);
	}
});

router.post('/info/:title', async (req, res, next) => {
	try {
		const { id } = req.session.user
		const { title } = req.params;
		const { files } = req.body;
		const ret = await setFiles(id, title, files);
		res.send(ret);
	} catch (err) {
		next(err);
	}
});

module.exports = router;