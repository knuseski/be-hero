const express = require('express');
const User = require('../model/User')

const router = express.Router();


router.get('/', (async (req, res) => {
    try {
        const find = await User.find();
        res.json(find);
    } catch (e) {
        res.json({message: e})
    }
}));

router.get('/:id', (async (req, res) => {
    try {
        const {id} = req.params;
        const found = await User.findById(id);
        res.json(found);
    } catch (e) {
        res.json({message: e})
    }
}));

router.post('/', (async (req, res) => {
    const user = new User(req.body);

    try {
        const saved = await user.save();
        res.json(saved);
    } catch (e) {
        res.json({message: e})
    }
}));

router.delete('/:id', (async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await User.remove({_id: id});
        res.json(deleted);
    } catch (e) {
        res.json({message: e})
    }
}));

router.patch('/:id', (async (req, res) => {
    try {
        const {id} = req.params;
        const updated = await User.updateOne({_id: id}, {$set: req.body});
        res.json(updated);
    } catch (e) {
        res.json({message: e})
    }
}));


module.exports = router;
