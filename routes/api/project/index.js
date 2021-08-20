const router = require('express').Router();
const DB = require('../../../models/DB')
const Error = require('../util/error');
const multer = require("multer");
const fs = require('fs')

var upload = multer({preservePath:true});

const findByIdAndTitle = async (id,title) => {
	const projectInfo = await DB.Project.findOne({ _creator:id, title });
	return projectInfo;
};

const isExistsByIdAndTitle = async (id,title) => {
	const projectInfo = await findByIdAndTitle(id,title);
	return !!projectInfo;
};

const getProjectsSummary = async id => {
	const data = await DB.Account.findOne({ id }).lean()
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
	
	const user = await DB.Account.findOne({ id })
	user.projects.push({title, body})
	await user.save()
	const newProject = new DB.Project({ _creator:id, title, body, files:[] })
	await newProject.save()
	return true
}

const setFiles = async (id,title,files) => {
	if (!title) {
		throw new Error.InvalidRequest()
	}
	const project = await findByIdAndTitle(id, title)
	for (let file of files){
		const paths = file.originalname.split('/')
		project.files.push({ contentType: file.mimetype, webkitRelativePath: file.originalname, data: file.buffer, name: paths[paths.length-1]})
		console.log(file)
		await project.save()
	}

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

router.post('/info/:title', upload.array("fr2"),async (req, res, next) => {
	try {
		const { id } = req.session.user
		const { title } = req.params;
		const { files } = req;
		const ret = await setFiles(id, title, files);
		res.send(true);
	} catch (err) {
		next(err);
	}
});

module.exports = router;