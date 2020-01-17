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

router.get ('/:id', validateId, (req, res) => {
    res.status (200).json (req.validatedObject);
});

router.get ('/:id/actions', validateId, (req, res) => {
    const projectId = req.params.id;
    db.getProjectActions (projectId)
        .then (actions => {
            if (actions) {
                res.status (200).json (actions);
            } else {
                res.status (500).json ({message: 'No actions for that id found.'});
            }
        })
        .catch (error => {
            console.log ('get project by id error', error);
            res.status (500).json ({message: 'There was an error getting project actions.'});
        });
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

router.put ('/:id', validateId, checkPost, (req, res) => {
    const projectId = req.params.id;
    const projectEdit = req.body;
    console.log (projectEdit, projectId);
    db.update (projectId, projectEdit)
        .then (project => {
            res.status (200).json ({previous: req.validatedObject, updated: project});
        })
        .catch (error => {
            console.log ('edit project error', error);
            res.status (500).json ({message: 'There was an error updating that project.'});
        });
});

router.delete ('/:id', validateId, (req, res) => {
    const projectId = req.params.id;
    let removeProject = req.validatedObject;
    db.remove (projectId)
        .then (count => {
            res.status (200).json ({
                message: `Successfully removed ${count} project with Id: ${projectId}`,
                deleted: removeProject
            });
        })
        .catch (error => {
            console.log ('remove project error', error);
            res.status (500).json ({message: 'There was an error when trying to remove that project.'});
        });
});

function validateId (req, res, next) {
    if (Number (req.params.id)) {
        db.get (req.params.id)
            .then (validatedId => {
                if (validatedId) {
                    req.validatedObject = validatedId;
                    next ();
                } else {
                    res.status (500).json ({message: `Nothing with Id: ${req.params.id}`});
                }
            });
    } else {
        res.status (404).json ({message: 'Please provide a valid id.'});
    }
}

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