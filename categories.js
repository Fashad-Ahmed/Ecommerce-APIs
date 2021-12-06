const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const categoryList = await Category.find();

    if (!categoryList) {
        res.status(500).json({ success: false })
    }
    res.status(200).send(categoryList);
})

router.get(`/:id`, async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(500).json({ message: 'The category was not found by id.' })
    }
    res.status(200).send(category);
})

router.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })

    category = await category.save();

    if (!category)
        return res.status(404).send('the category can not be created!')

    res.send(category);
})

router.post(`/:id`, async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        }
    )
    if (!category)
        return res.status(404).send('the category can not be updated!')

    res.send(category);
})

router.delete(`/:id`, (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            res.status(200).json({ success: true, message: 'The category is found and deleted.' })
        } else {
            res.status(404).json({ success: false, message: 'The category is not found.' })
        }
    }).catch(err => {
        res.status(404).json({ success: false, message: err })
    })
})

module.exports = router;