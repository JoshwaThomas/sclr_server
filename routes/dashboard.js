const express = require('express');
const router = express.Router();
const ApplicantModel = require('../models/fersh');
const DonarModel = require('../models/donar');
const AmountModel = require('../models/amt');
const RenewalModel = require('../models/renewal');
const AcademicModel = require('../models/academic');


router.get('/counts', async (req, res) => {
    try {
        const activeAcademicYear = await AcademicModel.findOne({ active: '1' });

        if (!activeAcademicYear) {
            return res.status(404).json({ message: 'No active academic year found' });
        }
        const acyear = activeAcademicYear.acyear;
        const totalRenewal = await RenewalModel.countDocuments({ acyear });
        const totalApplicants = await ApplicantModel.countDocuments({ acyear });
        const totalDonars = await DonarModel.countDocuments();
        const ugCount = await ApplicantModel.countDocuments({ acyear, fresherOrRenewal: 'Fresher' });
        const pgCount = await RenewalModel.countDocuments({ acyear, fresherOrRenewal: 'renewal' });
        const amCount = await ApplicantModel.countDocuments({ acyear, procategory: 'Aided' });
        const sfmCount = await ApplicantModel.countDocuments({ acyear, procategory: 'SFM' });
        const sfwCount = await ApplicantModel.countDocuments({ acyear, procategory: 'SFW' });
        const ramCount = await RenewalModel.countDocuments({ acyear, procategory: 'Aided' });
        const rsfmCount = await RenewalModel.countDocuments({ acyear, procategory: 'SFM' });
        const rsfwCount = await RenewalModel.countDocuments({ acyear, procategory: 'SFW' });
        // console.log(amCount,",",sfmCount,",",sfwCount ,",",ramCount ,",",rsfmCount,",",rsfwCount)

        const damCount = await ApplicantModel.countDocuments({ acyear, procategory: { $in: ['Aided', 'SFM'] }, deeniyath: 'Yes', deeniyathPer: 0 })
        const mamCount = await ApplicantModel.countDocuments({ acyear, procategory: { $in: ['Aided', 'SFM'] }, deeniyath: 'No', deeniyathPer: 0 })

        // const dsmCount = await ApplicantModel.countDocuments({acyear, procategory: 'SFM', deeniyath: 'Yes', deeniyathPer: 0})
        const dwCount = await ApplicantModel.countDocuments({ acyear, procategory: 'SFW', deeniyath: 'Yes', deeniyathPer: 0 })
        const mwCount = await ApplicantModel.countDocuments({ acyear, procategory: 'SFW', deeniyath: 'No', deeniyathPer: 0 })

        const damTotal = await ApplicantModel.countDocuments({ acyear, procategory: { $in: ['Aided', 'SFM'] }, deeniyath: 'Yes' })
        const mamTotal = await ApplicantModel.countDocuments({ acyear, procategory: { $in: ['Aided', 'SFM'] }, deeniyath: 'No' })
        // const dsmTotal = await ApplicantModel.countDocuments({acyear, procategory: 'SFM', deeniyath: 'Yes'})
        const dwTotal = await ApplicantModel.countDocuments({ acyear, procategory: 'SFW', deeniyath: 'Yes' })
        const mwTotal = await ApplicantModel.countDocuments({ acyear, procategory: 'SFW', deeniyath: 'No' })

        const semCount = await ApplicantModel.countDocuments({ acyear, semPercentage: 0 })



        const fSem = await ApplicantModel.countDocuments({ acyear, ugOrPg: 'UG', semester: 'I' });
        const sSem = await ApplicantModel.countDocuments({ acyear, ugOrPg: 'UG', semester: 'II' });
        const tSem = await ApplicantModel.countDocuments({ acyear, ugOrPg: 'UG', semester: 'III' });
        const fourSem = await ApplicantModel.countDocuments({ acyear, ugOrPg: 'UG', semester: 'IV' });
        const fivSem = await ApplicantModel.countDocuments({ acyear, ugOrPg: 'UG', semester: 'V' });
        const sixSem = await ApplicantModel.countDocuments({ acyear, ugOrPg: 'UG', semester: 'VI' });

        const pfSem = await ApplicantModel.countDocuments({ acyear, ugOrPg: 'PG', semester: 'I' });
        const psSem = await ApplicantModel.countDocuments({ acyear, ugOrPg: 'PG', semester: 'II' });
        const ptSem = await ApplicantModel.countDocuments({ acyear, ugOrPg: 'PG', semester: 'III' });
        const pfourSem = await ApplicantModel.countDocuments({ acyear, ugOrPg: 'PG', semester: 'IV' });

        const uniqueRegisterNos = await AmountModel.distinct("registerNo", { acyear });
        const totalBenefit = uniqueRegisterNos.length;
        const scholamtdoc = await AmountModel.find({ acyear }, 'scholamt');
        const donaramtdoc = await DonarModel.find({ acyear }, 'amount');
        const scholamt = scholamtdoc.map(doc => doc.scholamt);
        const donaramt = donaramtdoc.map(doc => doc.amount);

        const aaCount = await ApplicantModel.countDocuments({
            acyear, procategory: 'Aided',
            classAttendancePer: 0
        });
        const selfmCount = await ApplicantModel.countDocuments({
            acyear, procategory: 'SFM',
            classAttendancePer: 0
        });
        const selfwCount = await ApplicantModel.countDocuments({
            acyear, procategory: 'SFW',
            classAttendancePer: 0
        });

        res.json({
            totalApplicants,
            totalRenewal,
            totalDonars,
            totalBenefit,
            scholamt,
            donaramt,
            totalApplication: (totalApplicants + totalRenewal),
            ramCount,
            rsfmCount,
            rsfwCount,
            ugCount,
            pgCount,
            ugPercent: (ugCount / (totalApplicants + totalRenewal)) * 100,
            pgPercent: (pgCount / (totalApplicants + totalRenewal)) * 100,
            amPercent: (amCount / totalApplicants) * 100,
            sfmPercent: (sfmCount / totalApplicants) * 100,
            sfwPercent: (sfwCount / totalApplicants) * 100,
            mensTotal: ((amCount + sfmCount) / totalApplicants) * 100,
            fSem,
            sSem,
            tSem,
            fourSem,
            fivSem,
            sixSem,
            pfSem,
            psSem,
            ptSem,
            pfourSem,
            firstYear: (fSem + sSem),
            secYear: (tSem + fourSem),
            thirdYear: (fivSem + sixSem),
            pgfirstYear: (pfSem + psSem),
            pgsecYear: (ptSem + pfourSem),
            aaCount,
            amCount,
            selfmCount,
            sfmCount,
            selfwCount,
            sfwCount,
            damCount,
            damTotal,
            dwCount,
            dwTotal,
            aaComplete: (amCount - aaCount),
            selfmComplete: (sfmCount - selfmCount),
            selfwComplete: (sfwCount - selfwCount),
            aCompleted: (damTotal - damCount),
            wCompleted: (dwTotal - dwCount),
            mamCount,
            mamTotal,
            mwCount,
            mwTotal,
            maCompleted: (mamTotal - mamCount),
            mwCompleted: (mwTotal - mwCount),
            semCount,
            semComplete: (totalApplicants - semCount),




        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;
