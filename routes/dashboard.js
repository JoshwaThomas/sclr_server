const express = require('express');
const router = express.Router();
const ApplicantModel = require('../models/fersh');
const DonarModel = require('../models/donar');
const AmountModel = require('../models/amt')


router.get('/counts', async (req, res) => {
    try {
        const totalApplicants = await ApplicantModel.countDocuments({});
        const totalDonars = await DonarModel.countDocuments({});
        const ugCount = await ApplicantModel.countDocuments({ ugOrPg: 'UG' });
        const pgCount = await ApplicantModel.countDocuments({ ugOrPg: 'PG' });
        const amCount = await ApplicantModel.countDocuments({ procategory: 'Aided' });
        const sfmCount = await ApplicantModel.countDocuments({ procategory: 'SFM' });
        const sfwCount = await ApplicantModel.countDocuments({ procategory: 'SFW' });

        const fSem = await ApplicantModel.countDocuments({  ugOrPg: 'UG', semester: 'I' });
        const sSem = await ApplicantModel.countDocuments({  ugOrPg: 'UG', semester: 'II' });
        const tSem = await ApplicantModel.countDocuments({  ugOrPg: 'UG', semester: 'III' });
        const fourSem = await ApplicantModel.countDocuments({  ugOrPg: 'UG', semester: 'IV' });
        const fivSem = await ApplicantModel.countDocuments({  ugOrPg: 'UG', semester: 'V' });
        const sixSem = await ApplicantModel.countDocuments({  ugOrPg: 'UG',semester: 'VI' });

        const pfSem = await ApplicantModel.countDocuments({ ugOrPg: 'PG', semester: 'I' });
        const psSem = await ApplicantModel.countDocuments({ ugOrPg: 'PG', semester: 'II' });
        const ptSem = await ApplicantModel.countDocuments({ ugOrPg: 'PG', semester: 'III' });
        const pfourSem = await ApplicantModel.countDocuments({ ugOrPg: 'PG', semester: 'IV' });

        const totalBenefit = await AmountModel.countDocuments({});
        const scholamtdoc = await AmountModel.find({},'scholamt');
        const scholamt = scholamtdoc.map(doc => doc.scholamt);

        res.json({
            totalApplicants,
            totalDonars,
            totalBenefit,
            scholamt,
            ugPercent: (ugCount / totalApplicants) * 100,
            pgPercent: (pgCount / totalApplicants) * 100,
            amPercent: (amCount / totalApplicants) * 100,
            sfmPercent: (sfmCount / totalApplicants) * 100,
            sfwPercent: (sfwCount / totalApplicants) * 100,
            mensTotal: (amCount + sfmCount / totalApplicants) * 100,
            firstYear: (fSem + sSem),
            secYear: (tSem + fourSem),
            thirdYear: (fivSem + sixSem),
            pgfirstYear: (pfSem + psSem),
            pgsecYear: (ptSem + pfourSem),

        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
