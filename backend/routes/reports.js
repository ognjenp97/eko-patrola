const express = require('express');
const router = express.Router();
const Report = require('../models/Reports');
const upload = require('../config/upload');
const supabase = require('../config/supabase');

router.post('/', upload.array('images', 8), async (req, res) => {
  try {
    const uploadPromises = req.files.map(async (file) => {
        const fileName = `${Date.now()}_${file.originalname}`;

        const {error} = await supabase.storage
        .from('report-images')
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });
        if (error) throw error;

        const {data} = supabase.storage
        .from('report-images')
        .getPublicUrl(fileName);

        return data.publicUrl;
    });

    const imageUrls = await Promise.all(uploadPromises);
    
    const report = await Report.create({
        description: req.body.description,
        images: imageUrls,
        location: JSON.parse(req.body.location),
        alreadyCleaned: req.body.alreadyCleaned === 'true',
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;