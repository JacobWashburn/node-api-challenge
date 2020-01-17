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

router.get ('/:id', validateId, (req, res) => {
    const actionId = req.params.id;
    db.get (actionId)
        .then (project => {
            if (project) {
                res.status (200).json (project);
            } else {
                res.status (500).json ({message: 'No action with that id found.'});
            }
        })

});

router.post ('/:id', checkPost, (req, res) => {
    const newAction = {...req.body, project_id: req.params.id};
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

router.delete ('/:id', validateId, (req, res) => {
    const actionId = req.params.id;
    let removeAction = req.validatedObject;
    db.remove (actionId)
        .then (count => {
            res.status (200).json ({
                message: `Successfully removed ${count} action with Id: ${actionId}`,
                deleted: removeAction
            });
        })
        .catch (error => {
            console.log ('remove action error', error);
            res.status (500).json ({message: 'There was an error when trying to remove that action.'});
        });
});

function validateId (req, res, next) {
    if (Number(req.params.id)) {
    	db.get (req.params.id)
            .then (validatedId => {
                if (validatedId) {
                    req.validatedObject = validatedId;
                    next ();
                } else {
                    res.status (500).json ({message: `Nothing with Id: ${req.params.id}`});
                }
            })
        .catch (error => {
            console.log ('get by id error', error, req.route);
            res.status (500).json ({message: 'There was an error getting from database.'});
        });
    } else {
    	 res.status (404).json ({message: 'Please provide a valid id.'});
    }
}

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