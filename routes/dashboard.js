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
        const totalFresher = await ApplicantModel.countDocuments({ acyear }); 
        const totalApplicants = totalRenewal + totalFresher
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
        const damCountr = await RenewalModel.countDocuments({ acyear, procategory: { $in: ['Aided', 'SFM'] }, deeniyath: 'Yes', deeniyathPer: 0 })
        const mamCountr = await RenewalModel.countDocuments({ acyear, procategory: { $in: ['Aided', 'SFM'] }, deeniyath: 'No', deeniyathPer: 0 })

        // const dsmCount = await ApplicantModel.countDocuments({acyear, procategory: 'SFM', deeniyath: 'Yes', deeniyathPer: 0})
        const dwCount = await ApplicantModel.countDocuments({ acyear, procategory: 'SFW', deeniyath: 'Yes', deeniyathPer: 0 })
        const mwCount = await ApplicantModel.countDocuments({ acyear, procategory: 'SFW', deeniyath: 'No', deeniyathPer: 0 })
        const dwCountr = await RenewalModel.countDocuments({ acyear, procategory: 'SFW', deeniyath: 'Yes', deeniyathPer: 0 })
        const mwCountr = await RenewalModel.countDocuments({ acyear, procategory: 'SFW', deeniyath: 'No', deeniyathPer: 0 })

        const damTotal = await ApplicantModel.countDocuments({ acyear, procategory: { $in: ['Aided', 'SFM'] }, deeniyath: 'Yes' })
        const mamTotal = await ApplicantModel.countDocuments({ acyear, procategory: { $in: ['Aided', 'SFM'] }, deeniyath: 'No' })
        const dwTotal = await ApplicantModel.countDocuments({ acyear, procategory: 'SFW', deeniyath: 'Yes' })
        const mwTotal = await ApplicantModel.countDocuments({ acyear, procategory: 'SFW', deeniyath: 'No' })
        const damTotalr = await RenewalModel.countDocuments({ acyear, procategory: { $in: ['Aided', 'SFM'] }, deeniyath: 'Yes' })
        const mamTotalr = await RenewalModel.countDocuments({ acyear, procategory: { $in: ['Aided', 'SFM'] }, deeniyath: 'No' })
        const dwTotalr = await RenewalModel.countDocuments({ acyear, procategory: 'SFW', deeniyath: 'Yes' })
        const mwTotalr = await RenewalModel.countDocuments({ acyear, procategory: 'SFW', deeniyath: 'No' })

        const semCount = await ApplicantModel.countDocuments({ acyear, semPercentage: 0, semester: { $in: ['III', 'IV', 'V', 'VI', 'II'] } })
        const semCountr = await RenewalModel.countDocuments({ acyear, semPercentage: 0, semester: { $in: ['III', 'IV', 'V', 'VI', 'II'] } })

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
        // console.log('f', fSem, 's', sSem, 't', tSem, 'f', fourSem, 'fi', fivSem, 'si', sixSem, 'pgf',pfSem, 'ps',psSem, 'pt',ptSem, 'pf',pfourSem)


        const rfSem = await RenewalModel.countDocuments({ acyear, ugOrPg: 'UG', semester: 'I' });
        const rsSem = await RenewalModel.countDocuments({ acyear, ugOrPg: 'UG', semester: 'II' });
        const rtSem = await RenewalModel.countDocuments({ acyear, ugOrPg: 'UG', semester: 'III' });
        const rfourSem = await RenewalModel.countDocuments({ acyear, ugOrPg: 'UG', semester: 'IV' });
        const rfivSem = await RenewalModel.countDocuments({ acyear, ugOrPg: 'UG', semester: 'V' });
        const rsixSem = await RenewalModel.countDocuments({ acyear, ugOrPg: 'UG', semester: 'VI' });

        const rpfSem = await RenewalModel.countDocuments({ acyear, ugOrPg: 'PG', semester: 'I' });
        const rpsSem = await RenewalModel.countDocuments({ acyear, ugOrPg: 'PG', semester: 'II' });
        const rptSem = await RenewalModel.countDocuments({ acyear, ugOrPg: 'PG', semester: 'III' });
        const rpfourSem = await RenewalModel.countDocuments({ acyear, ugOrPg: 'PG', semester: 'IV' });
        
        // console.log('rf', rfSem, 'rs', rsSem, 'rt', rtSem, 'rf', rfourSem, 'rfi', rfivSem, 'rsi', rsixSem, 'rpgf',rpfSem, 'rps',rpsSem, 'rpt',rptSem, 'rpf',rpfourSem)


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
        const raaCount = await RenewalModel.countDocuments({
            acyear, procategory: 'Aided',
            classAttendancePer: 0
        });
        const rselfmCount = await RenewalModel.countDocuments({
            acyear, procategory: 'SFM',
            classAttendancePer: 0
        });
        const rselfwCount = await RenewalModel.countDocuments({
            acyear, procategory: 'SFW',
            classAttendancePer: 0
        });
        const totalApplication = totalApplicants + totalRenewal;
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
                rfirstYear: (rfSem + rsSem),
                rsecYear: (rtSem + rfourSem),
                rthirdYear: (rfivSem + rsixSem),
                rpgfirstYear: (rpfSem + rpsSem),
                rpgsecYear: (rptSem + rpfourSem),
                aaCount: (aaCount + raaCount),
                amCount,
                selfmCount: (selfmCount + rselfmCount),
                sfmCount,
                selfwCount: (selfwCount + rselfwCount),
                sfwCount,
                damCount: damCount + damCountr,
                damTotal: damTotal + damTotalr,
                dwCount: dwCount + dwCountr,
                dwTotal: dwTotal + dwTotalr,
                aaComplete: (amCount - aaCount),
                selfmComplete: (sfmCount - selfmCount),
                selfwComplete: (sfwCount - selfwCount),
                aCompleted: ((damTotal + damTotalr) - (damCount + damCountr)),
                wCompleted: ((dwTotal + dwTotalr) - (dwCount + dwCountr)),
                mamCount: mamCount + mamCountr,
                mamTotal: mamTotal + mamTotalr,
                mwCount: mwCount + mwCountr,
                mwTotal: mwTotal + mwTotalr,
                maCompleted: ((mamTotal + mamTotalr) - (mamCount + mamCountr)),
                mwCompleted: ((mwTotal + mwTotalr) - (mwCount + mwCountr)),
                semCount: semCount + semCountr,
                semComplete: (totalApplication - (semCount + semCountr)),
                totalFresher:totalFresher,
                freshPer:((totalFresher/totalApplicants)*100),
                renewalPer:((totalRenewal/totalApplicants)*100)




            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;

router.get('/columnBarData', async (req, res) => {
    try {
        const activeAcademicYear = await AcademicModel.findOne({ active: '1' });
        if (!activeAcademicYear) {
            return res.status(404).json({ message: 'No active academic year found' });
        }

        const acyear = activeAcademicYear.acyear;

        // Aggregation pipeline to count data directly in MongoDB
        const result = await ApplicantModel.aggregate([
            {
                $lookup: {
                    from: "amounts", // Replace with your actual collection name for AmountModel
                    localField: "registerNo",
                    foreignField: "registerNo",
                    as: "scholarshipInfo",
                },
            },
            {
                $unwind: "$scholarshipInfo",
            },
            {
                $match: {
                    "scholarshipInfo.acyear": acyear,
                    "scholarshipInfo.scholamt": { $gt: 0 },
                    action:1
                },
            },
            {
                $addFields: {
                    yearLabel: {
                        $switch: {
                            branches: [
                                { case: { $and: [{ $eq: ["$ugOrPg", "UG"] }, { $in: ["$semester", ["I", "II"]] }] }, then: "I UG" },
                                { case: { $and: [{ $eq: ["$ugOrPg", "UG"] }, { $in: ["$semester", ["III", "IV"]] }] }, then: "II UG" },
                                { case: { $and: [{ $eq: ["$ugOrPg", "UG"] }, { $in: ["$semester", ["V", "VI"]] }] }, then: "III UG" },
                                { case: { $and: [{ $eq: ["$ugOrPg", "PG"] }, { $in: ["$semester", ["I", "II"]] }] }, then: "I PG" },
                                { case: { $and: [{ $eq: ["$ugOrPg", "PG"] }, { $in: ["$semester", ["III", "IV"]] }] }, then: "II PG" },
                            ],
                            default: null,
                        },
                    },
                },
            },
            {
                $group: {
                    _id: { yearLabel: "$yearLabel", procategory: "$procategory" },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Process the aggregated result into the desired format
        const counts = {
            'I UG': { Men: 0, Women: 0, Total: 0 },
            'II UG': { Men: 0, Women: 0, Total: 0 },
            'III UG': { Men: 0, Women: 0, Total: 0 },
            'I PG': { Men: 0, Women: 0, Total: 0 },
            'II PG': { Men: 0, Women: 0, Total: 0 },
        };

        result.forEach(({ _id, count }) => {
            const { yearLabel, procategory } = _id;

            if (yearLabel && counts[yearLabel]) {
                if (procategory === 'SFW') {
                    counts[yearLabel].Women += count;
                } else if (['SFM', 'Aided'].includes(procategory)) {
                    counts[yearLabel].Men += count;
                }
                counts[yearLabel].Total += count;
            }
        });

        res.json(counts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
