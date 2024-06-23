const express = require('express');
const router = express.Router();
const ApplicantModel = require('../models/fersh');


router.get('/counts', async (req, res) => {
    try {
        const totalApplicants = await ApplicantModel.countDocuments({});
        const ugCount = await ApplicantModel.countDocuments({ ugOrPg: 'ug' });
        const pgCount = await ApplicantModel.countDocuments({ ugOrPg: 'pg' });
        const amCount = await ApplicantModel.countDocuments({ procategory: 'Aided Mens' });
        const sfmCount = await ApplicantModel.countDocuments({ procategory: 'SF Mens' });
        const sfwCount = await ApplicantModel.countDocuments({ procategory: 'SF Womens' });

        const fSem = await ApplicantModel.countDocuments({  ugOrPg: 'ug', semester: 'Isemester' });
        const sSem = await ApplicantModel.countDocuments({  ugOrPg: 'ug', semester: 'IIsemester' });
        const tSem = await ApplicantModel.countDocuments({  ugOrPg: 'ug', semester: 'IIIsemester' });
        const fourSem = await ApplicantModel.countDocuments({  ugOrPg: 'ug', semester: 'IVsemester' });
        const fivSem = await ApplicantModel.countDocuments({  ugOrPg: 'ug', semester: 'Vsemester' });
        const sixSem = await ApplicantModel.countDocuments({  ugOrPg: 'ug',semester: 'VIsemester' });

        const pfSem = await ApplicantModel.countDocuments({ ugOrPg: 'pg', semester: 'Isemester' });
        const psSem = await ApplicantModel.countDocuments({ ugOrPg: 'pg', semester: 'IIsemester' });
        const ptSem = await ApplicantModel.countDocuments({ ugOrPg: 'pg', semester: 'IIIsemester' });
        const pfourSem = await ApplicantModel.countDocuments({ ugOrPg: 'pg', semester: 'IVsemester' });

        res.json({
            totalApplicants,
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
