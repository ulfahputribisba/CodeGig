const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Gig = require('../models/Gig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//get gig lists
router.get('/', (req, res) => 
    Gig.findAll() //Gig : model
        .then(gigs => {
            res.render('allgigs', {
                gigs
            });
        })
        .catch(err => console.log(err))
);

//display add gig form
router.get('/add', (req, res) => res.render('add'));

//add a gig
router.post('/add', (req, res) => {
    let { title, technologies, budget, description, contact_email } = req.body;
    let errors = [];

    //warning validation
    if(!title){
        errors.push({ text: "Please add a title"});
    }
    if(!technologies){
        errors.push({ text: "Please add some technologies"});
    }
    if(!description){
        errors.push({ text: "Please add some description"});
    }
    if(!contact_email){
        errors.push({ text: "Please add a contact email"});
    }
    
    //check for errors
    if(errors.length > 0){
        res.render('add', {
            errors,
            title, 
            technologies, 
            budget, 
            description, 
            contact_email
        });
    } else{
        //unknown budget if it's null
        if(!budget){
            budget = 'Unknown';
        } else{
            budget = `Rp${budget}`;
        }

        // Make lower case and remove space after comma
        // technologies = technologies.toLowerCase().replace(/, /g, ',');

        //insert into table
        Gig.create({
            title, 
            technologies,
            description,
            budget,
            contact_email
        })
            .then(gig => res.redirect('/gigs'))
            .catch(err => console.log(err))
    }
});

//search for gigs
router.get('/search', (req, res) => {
    let { term } = req.query;

    //make lowercase
    //term = term.toLowerCase();
    
    Gig.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } })
        .then(gigs => res.render('allgigs', { gigs }))
        .catch(err => console.log(err));

});

module.exports = router;
