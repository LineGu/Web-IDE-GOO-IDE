const isMember = session => session && session.user && session.user.id;

exports.isMember = (req, res, next) => {
	if (isMember(req.session)) {
		next();
		return;
	}
	res.redirect('/signin');
};

exports.isNotMember = (req, res, next) => {
	if (isMember(req.session)) {
		res.redirect('workspace');
		return;
	}

	next();
};