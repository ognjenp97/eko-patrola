const express = require('express');
const router = express.Router();
const Report = require('../models/Reports');
const upload = require('../config/upload');
const supabase = require('../config/supabase');
const requireAdmin = require('../middleware/auth');

async function uploadImagesToSupabase(files) {
  const uploadPromises = files.map(async (file) => {
    const fileName = `${Date.now()}_${file.originalname}`;

    const { error } = await supabase.storage
      .from('report-images')
      .upload(fileName, file.buffer, { contentType: file.mimetype });
    if (error) throw error;

    const { data } = supabase.storage.from('report-images').getPublicUrl(fileName);
    return data.publicUrl;
  });

  return Promise.all(uploadPromises);
}

router.post('/', upload.array('images', 8), async (req, res) => {
  try {
    const imageUrls = await uploadImagesToSupabase(req.files);

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
    const reports = await Report.find({ status: { $in: ['active', 'cleaned'] } }).sort({
      createdAt: -1,
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/admin', requireAdmin, async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      status: { $in: ['active', 'cleaned'] },
    });

    if (!report) {
      return res.status(404).json({ message: 'Prijava nije pronađena.' });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(404).json({ message: 'Prijava nije pronađena.' });
  }
});

router.post('/:id/after-images', upload.array('images', 8), async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      status: { $in: ['active', 'cleaned'] },
    });

    if (!report) {
      return res.status(404).json({ message: 'Prijava nije pronađena.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Dodajte bar jednu fotografiju.' });
    }

    const newUrls = await uploadImagesToSupabase(req.files);

    report.afterImages = [...report.afterImages, ...newUrls].slice(0, 8);
    report.status = 'cleaned';
    await report.save();

    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const allowedStatuses = ['pending', 'active', 'cleaned'];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'Nevažeći status.' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Prijava nije pronađena.' });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Prijava nije pronađena.' });
    }

    const allUrls = [...report.images, ...report.afterImages];
    const fileNames = allUrls.map((url) => url.split('/report-images/')[1]);
    if (fileNames.length > 0) {
      await supabase.storage.from('report-images').remove(fileNames);
    }

    await report.deleteOne();
    res.status(200).json({ message: 'Prijava obrisana.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
