const express = require('express');
const router = express.Router();
const RejectModel = require('../models/reject');
const AmountModel = require('../models/amt');
const ApplicantModel = require('../models/fersh');
const RenewalModel = require('../models/renewal');
const DonarDataModel = require('../models/donardata');
const DonarModel = require('../models/donar');
const Academic = require('../models/academic');

router.post("/reject", (req, res) => {
    RejectModel.create(req.body)
        .then(result => res.json({success: true, result}))
        .catch(err => res.json(err));


})


router.get('/studawardreport', async (req, res) => {
    try {
        // Aggregate records by registerNo and acyear
        const amountData = await AmountModel.aggregate([
            {
                $group: {
                    _id: {
                        registerNo: '$registerNo',
                        acyear: '$acyear'
                    },
                    totalScholamt: {$sum: '$scholamt'},
                    name: {$first: '$name'},
                    dept: {$first: '$dept'},
                    amtdate: {$first: '$amtdate'}
                }
            },
            {
                $project: {
                    registerNo: '$_id.registerNo',
                    acyear: '$_id.acyear',
                    totalScholamt: 1,
                    name: 1,
                    dept: 1,
                    amtdate: 1,
                    _id: 0
                }
            }
        ]);

        // Send the aggregated data
        res.json(amountData);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});




router.get('/donarletter', async (req, res) => {
    try {
        const {name} = req.query;
        console.log(`Searching for donor with name: ${name}`);

        const donar = await DonarDataModel.findOne({name});
        console.log('Donar data:', donar);
        const donoramount = donar.amount
        console.log('Donor Amount:', donoramount)

        if (donar) {
            const donorId = donar.did;
            console.log(`Found donorId (did): ${donorId}`);

            if (!donorId) {
                return res.status(404).json({message: 'Did not found in DonarDataModel'});
            }

            const donorIdfind = await DonarModel.findOne({did: donorId});
            console.log('DonarModel data:', donorIdfind);

            if (donorIdfind) {
                const donorId1 = donorIdfind._id;
                console.log(`Found donorId1 (_id): ${donorId1}`);

                const donoramt = await AmountModel.find({scholdonar: donorId1});
                console.log('AmountModel data:', donoramt);

                if (donoramt.length > 0) {
                    const studreg = donoramt[0].registerNo;  // Access the first element's registerNo
                    console.log(`Student reg.no: ${studreg}`);

                    const stud = await ApplicantModel.find({registerNo: studreg});
                    if (stud) {
                        console.log('Student details:', stud);
                        res.json({
                            donorname: donar.name,
                            donordate: donar.scholdate,
                            donoramount: donar.amount,
                            studname: stud[0].name,
                            studdept: stud[0].dept,
                            studreg: stud[0].registerNo,
                            donoramtscholamt: donoramt[0].scholamt,
                            studmobileNo: stud[0].mobileNo,
                            donar,
                            donoramt,
                            stud
                        });
                    } else {
                        res.status(404).json({message: 'Student not found'});
                    }

                } else {
                    res.status(404).json({message: 'Amount not found'});
                }
            } else {
                res.status(404).json({message: 'Donor not found in DonarModel'});
            }
        } else {
            res.status(404).json({message: 'Donor not found in DonarDataModel'});
        }
    } catch (err) {
        console.error('Error fetching donor data:', err);
        res.status(500).json({error: 'Internal server error'});
    }
})



















// ----------------------------------------------------------------------------------------------------------------

// Fetch Students Details for Modify Modal for Admin

router.get('/status/:registerNo', async (req, res) => {

    const {registerNo} = req.params;

    try {
        const acyearData = await Academic.findOne({active: '1'});
        if (!acyearData) {return res.status(404).send('Active academic year not found');}


        const currentAcyear = acyearData.acyear;

        const amountData = await AmountModel.find({registerNo, acyear: currentAcyear});

        if (amountData && amountData.length > 0) {
            const totalScholamt = amountData.reduce((sum, entry) => sum + entry.scholamt, 0);
            return res.json({...amountData[0]._doc, totalScholamt});
        }


        data = await RejectModel.findOne({registerNo});
        if (data) {return res.json(data)}

        data = await RenewalModel.findOne({registerNo, acyear: currentAcyear});
        if (data) {return res.json(data)}

        data = await ApplicantModel.findOne({registerNo, acyear: currentAcyear});
        if (data) {return res.json(data)}

        return res.json({status: 'Not Exist'});

    } catch (error) {
        console.log("Error in Fetching Students Info for Modify : ", error);
        return res.status(500).json({status: 'error', message: 'An error occurred while fetching the student data'});
    }
})

// ----------------------------------------------------------------------------------------------------------------

// Delete the Current Academic Application for Admin

router.delete('/delete/:registerNo', async (req, res) => {

    try {

        const {registerNo} = req.params;
        const acyearData = await Academic.findOne({active: '1'});
        if (!acyearData) {return res.status(404).json({message: 'Active academic year not found'})}
        const currentAcyear = acyearData.acyear;

        let student = await ApplicantModel.findOne({registerNo, acyear: currentAcyear});
        let modelUsed = null;

        if (student) {modelUsed = ApplicantModel}
        else {
            student = await RenewalModel.findOne({registerNo, acyear: currentAcyear});
            if (student) modelUsed = RenewalModel;
        }

        if (!student) {return res.status(404).json({message: 'Student not found'})}
        await modelUsed.deleteOne({registerNo, acyear: currentAcyear});
        return res.status(200).json({message: 'Student record deleted successfully.'});

    } catch (error) {
        console.error('Error deleting student : ', error);
        return res.status(500).json({message: 'Internal Server Error', error});
    }
})

// ----------------------------------------------------------------------------------------------------------------

// To dispaly the Details for Current Academic Year in Student Dashboard

router.get('/studstatus', async (req, res) => {

    const {registerNo} = req.query;

    try {

        const currAcde = await Academic.findOne({active: '1'});
        let applicant = await RenewalModel.findOne({registerNo: registerNo, acyear: currAcde.acyear});

        if (!applicant) {
            applicant = await ApplicantModel.findOne({registerNo: registerNo, acyear: currAcde.acyear});
        }

        if (applicant) {

            let data = await RejectModel.findOne({registerNo: registerNo, acyear: currAcde.acyear});
            if (data) {return res.json(data)}

            data = await RenewalModel.findOne({registerNo: registerNo, acyear: currAcde.acyear});
            if (data) {return res.json(data)}

            data = await ApplicantModel.findOne({registerNo: registerNo, acyear: currAcde.acyear});
            if (data) {return res.json(data)}

        } else {
            return res.json({success: false, message: 'Applicant does not exist'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: 'error', message: 'An error occurred while fetching the student data'});
    }
});

module.exports = router;