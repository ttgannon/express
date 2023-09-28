const express = require('express');
const router = new express.Router();
const db = require("../db");
const ExpressError = require('../expressError');

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT code, name, description, invoices 
        FROM companies
        JOIN invoices ON invoices.comp_code = companies.code;`);
        return res.json({companies: results.rows});
    } catch (error) {
        return next(error);
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const {code} = req.params;
        const results = await db.query(
            `SELECT code, name, description FROM companies WHERE code=$1;`, [code]
            );
        return res.json({company: results.rows[0]})
    } catch (error) {
        return next(error);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const {code, name, description} = req.body;
        const results = await db.query(
            `INSERT INTO companies (code, name, description) 
            VALUES ($1, $2, $3) 
            RETURNING code, name, description;`, 
            [code, name, description]
            );
        return res.json({company: results.rows[0]})
    } catch (error) {
        return next(error);
    }
})

router.put('/:code', async (req, res, next) => {
    try {
        const {name, description} = req.body;
        const {code} = req.params;
        const results = await db.query(
            `UPDATE companies
            SET name=$1, description=$2
            WHERE code=$3
            RETURNING code, name, description;`, 
            [name, description, code]
            );
        if (!results.rows[0]) throw new ExpressError("Not found", 404);
        return res.json({company: results.rows[0]})
    } catch (error) {
        return next(error);
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const {code} = req.params;
        const results = await db.query(
            `DELETE FROM companies
            WHERE code=$1`, 
            [code]
            );
        if (!results.rows[0]) throw new ExpressError("Not found", 404);    
        return res.json({status: "deleted"})
    } catch (error) {
        return next(error);
    }
})


module.exports = router;