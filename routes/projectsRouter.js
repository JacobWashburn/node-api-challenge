const express = require ('express');
const router = express.Router ();
const db = require ('../data/helpers/projectModel');


router.get ('/', (req, res) => {
    db.get ()
        .then (projects => {
            res.status (200).json (projects);
        })
        .catch (error => {
            console.log ('get all projects error', error);
            res.status (500).json ({message: 'Was not able to get projects from the database.'});
        });
});

router.get('/:id', (req, res) => {
	const projectId = req.params.id;
	db.get(projectId)
        .then(project => {
            if (project) {
            	res.status(200).json(project)
            } else {
            	res.status(500).json({message: 'No project with that id found.'})
            }
        })
        .catch(error => {
            console.log ('get project by id error', error);
            res.status(500).json({message: 'There was an error getting a project by id.'})
        })
});

router.get('/:id/actions', (req, res) => {
	const projectId = req.params.id;
	db.getProjectActions(projectId)
        .then(actions => {
            if (actions) {
            	res.status(200).json(actions)
            } else {
            	res.status(500).json({message: 'No actions for that id found.'})
            }
        })
        .catch(error => {
            console.log ('get project by id error', error);
            res.status(500).json({message: 'There was an error getting project actions.'})
        })
});

router.post ('/', checkPost, (req, res) => {
    const newPost = req.body;
    db.insert (newPost)
        .then (post => {
            res.status (201).json ({created: post});
        })
        .catch (error => {
            console.log ('post a new project error', error);
            res.send (500).json ({message: 'Was not able to add a new project to the database.'});
        });
});

router.put ('/:id', checkPost, (req, res) => {
    const projectId = req.params.id;
    const projectEdit = req.body;
    console.log (projectEdit, projectId);
    db.update (projectId, projectEdit)
        .then (project => {
            res.status (200).json (project);
        })
        .catch (error => {
            console.log ('edit project error', error);
            res.status (500).json ({message: 'There was an error updating that project.'});
        });
});

router.delete ('/:id', (req, res) => {
    const projectId = req.params.id;
    let removeProject = {};
    db.get (projectId)
        .then (project => {
            if (project) {
                removeProject = project;
            } else {
                console.log ('no project found');
            }

        })
        .catch (error => {
            console.log ('delete get by id error', error);
        });
    db.remove (projectId)
        .then (count => {
            if (count) {
                res.status (200).json ({
                    message: `Successfully removed the project with Id: ${projectId}`,
                    deleted: removeProject
                });
            } else {
                res.status (500).json ({message: 'There is no project with that Id.'});
            }
        })
        .catch (error => {
            console.log ('remove project error', error);
            res.status (500).json ({message: 'There was an error when trying to remove that project.'});
        });
});

function checkPost (req, res, next) {
    const post = req.body;
    if (post) {
        if (post.name && post.description) {
            next ();
        } else if ( !post.name && !post.description) {
            res.status (500).json ({message: 'You must provide some information including name and description.'});
        } else if ( !post.name) {
            res.status (500).json ({message: 'You must provide a valid name.'});
        } else if ( !post.description) {
            res.status (500).json ({message: 'You must provide a valid description.'});
        }
    } else {
        res.status (500).json ({message: 'you did not provide a body.'});
    }

}

module.exports = router;