const express = require ('express');
const router = express.Router ();
const db = require ('../data/helpers/actionModel');


router.get ('/', (req, res) => {
    db.get ()
        .then (actions => {
            res.status (200).json (actions);
        })
        .catch (error => {
            console.log ('get all actions error', error);
            res.status (500).json ({message: 'Was not able to get actions from the database.'});
        });
});

router.get('/:id', (req, res) => {
	const actionId = req.params.id;
	db.get(actionId)
        .then(project => {
            if (project) {
            	res.status(200).json(project)
            } else {
            	res.status(500).json({message: 'No action with that id found.'})
            }
        })
        .catch(error => {
            console.log ('get action by id error', error);
            res.status(500).json({message: 'There was an error getting an action by id.'})
        })
});

router.post ('/:id', checkPost, (req, res) => {
    const newAction = {...req.body,project_id: req.params.id};
    db.insert (newAction)
        .then (post => {
            res.status (201).json ({created: post});
        })
        .catch (error => {
            console.log ('post a new action error', error);
            res.send (500).json ({message: 'Was not able to add a new action to the database.'});
        });
});

router.put ('/:id', checkPost, (req, res) => {
    const actionId = req.params.id;
    const actionEdit = req.body;
    console.log (actionEdit, actionId);
    db.update (actionId, actionEdit)
        .then (project => {
            res.status (200).json (project);
        })
        .catch (error => {
            console.log ('edit action error', error);
            res.status (500).json ({message: 'There was an error updating that action.'});
        });
});

router.delete ('/:id', (req, res) => {
    const actionId = req.params.id;
    let removeAction = {};
    db.get (actionId)
        .then (action => {
            if (action) {
                removeAction = action;
            } else {
                console.log ('no action found');
            }

        })
        .catch (error => {
            console.log ('delete get by id error', error);
        });
    db.remove (actionId)
        .then (count => {
            if (count) {
                res.status (200).json ({
                    message: `Successfully removed the action with Id: ${actionId}`,
                    deleted: removeAction
                });
            } else {
                res.status (500).json ({message: 'There is no action with that Id.'});
            }
        })
        .catch (error => {
            console.log ('remove action error', error);
            res.status (500).json ({message: 'There was an error when trying to remove that action.'});
        });
});

function checkPost (req, res, next) {
    const post = req.body;
    if (post) {
        if (post.notes && post.description) {
            next ();
        } else if ( !post.notes && !post.description) {
            res.status (500).json ({message: 'You must provide some information including note and description.'});
        } else if ( !post.notes) {
            res.status (500).json ({message: 'You must provide a valid note.'});
        } else if ( !post.description) {
            res.status (500).json ({message: 'You must provide a valid description.'});
        }
    } else {
        res.status (500).json ({message: 'you did not provide a body.'});
    }

}

module.exports = router;