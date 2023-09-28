const express = require('express');
const router = new express.Router()
const db = require("../db");
const ExpressError = require('../expressError');

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT id, comp_code, amt, paid, add_date, paid_date 
        FROM invoices;`);
        return res.json({invoices: results.rows});
    } catch (error) {
        return next(error);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const results = await db.query(`SELECT id, comp_code, amt, paid, add_date, paid_date, companies.code,
        companies.name, companies.description
        FROM invoices JOIN companies ON companies.code=invoices.comp_code WHERE id=$1 RETURNING ;`, [id]);
        if (!results.rows[0]) throw new ExpressError("Not found", 404);
        return res.json({invoice: results.rows[0]});
    } catch (error) {
        return next(error);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const {comp_code, amt} = req.body;
        const results = await db.query(`INSERT INTO invoices (comp_code, amt)
        VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date;`, [comp_code, amt]);
        return res.json({invoice: results.rows});
    } catch (error) {
        return next(error);
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const {amt} = req.body;
        const results = await db.query(`UPDATE invoices
        SET amt=$1
        WHERE id=$2 
        RETURNING id, comp_code, amt, paid, add_date, paid_date;`, [amt, id]);
        return res.json({invoice: results.rows});
    } catch (error) {
        return next(error);
    }
})


router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        const results = await db.query(`DELETE FROM invoices WHERE id=$1;`, [id]);
        if (!results.rows[0]) throw new ExpressError("Not found", 404);
        return res.json({invoice: results.rows});
    } catch (error) {
        return next(error);
    }
})

module.exports = router;