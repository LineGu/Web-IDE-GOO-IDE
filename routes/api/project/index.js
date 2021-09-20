const router = require('express').Router();
const DB = require('../../../DBModels')
const Error = require('../util/error');
const multer = require("multer");
const fs = require('fs')

let upload = multer({preservePath:true});

const findById = async (projectId) => {
	const projectInfo = await DB.Project.findOne({ id:projectId });
	return projectInfo;
};

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

const addProject = async (id,title,body,projectId) => {
	if (!title) {
		throw new Error.InvalidRequest()
	}
	
	const isExists = await isExistsByIdAndTitle(id,title);
	
	if (isExists) {
		throw new Error.AlreadyExists();
	}
	
	const user = await DB.Account.findOne({ id })
	user.projects.push({title, body, id: projectId})
	await user.save()
	const newProject = new DB.Project({ _creator:id, members: [{ id }] ,title, body, files:[], id:projectId})
	await newProject.save()
	
	const newChattingRoom = new DB.Chatting({ roomId: projectId, chattingList: [] })
	await newChattingRoom.save()
	
	return true
}

const setFiles = async (id,title,files) => {
	if (!title) {
		throw new Error.InvalidRequest()
	}
	const project = await findByIdAndTitle(id, title)
	project.files = []
	for (let file of files){
		const data = file.originalname.split('/')
		const id = data[data.length - 1]
		const paths = data.slice(0,data.length - 1)
		const dbData = {
			mimeType: file.mimetype,
			data: file.buffer,
			id,
			webkitRelativePath: paths.join('/'),
			name: paths[paths.length - 1]
		}
		
		project.files.push(dbData)
	}
	await project.save()
	return true
}

const addMembers = async (projectId, members) => {
	const project = await DB.Project.findOne({ id:projectId })
	for (let id of members) {
		const member = await DB.Account.findOne({ id });
		if (!member) throw new Error.IncorrectAccount();
		project.members.push({ id })
		member.projects.push({ title:project.title, body:project.body, id: projectId })
		await member.save()
		await project.save()
	}
	return true	
}

const getMembers = async (projectId) => {
	const project = await DB.Project.findOne({ id:projectId });
	return project.members
}

router.post('/members', async (req, res, next) => {
	try {
		const { projectId, members } = req.body;
		const ret = await addMembers(projectId, members);
		res.send(ret);
	} catch (err) {
		next(err);
	}
})


router.get('/', async (req, res, next) => {
	try {
		const { id } = req.session.user
		const data = await getProjectsSummary(id);
		res.json(data);
	} catch (err) {
		next(err);
	}
});

router.get('/info/:projectId', async (req, res, next) => {
	try {
		const { id } = req.session.user
		const { projectId } = req.params;
		const data = await findById(projectId);
		res.json(data);
	} catch (err) {
		next(err);
	}
});

router.post('/new', async (req, res, next) => {
	try {
		const { id } = req.session.user
		const { title, body, projectId } = req.body;
		const ret = await addProject(id, title, body, projectId);
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

router.get('/members/:projectId', async (req, res, next) => {
	try {
		const { projectId } = req.params;
		const members = await getMembers(projectId);
		res.json(members);
	} catch (err) {
		next(err);
	}
})

module.exports = router;