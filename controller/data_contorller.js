// controllers/vocabularyController.js
const Vocabulary = require("../model/dataModel");
const gtts = require("gtts");
const cloudinary = require("../cloudinary");
const fs = require("fs");
const path = require("path");

// Generate audio + upload to Cloudinary
const generateAndUploadAudio = async (word) => {
  return new Promise((resolve, reject) => {
    const tempPath = path.join(__dirname, `${word}.mp3`);
    const speech = new gtts(word, "en");

    // Generate local temp file
    speech.save(tempPath, async (err) => {
      if (err) return reject(err);

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(tempPath, {
          resource_type: "video", // mp3 needs 'video'
          folder: "vocabulary_audio"
        });

        // Remove temp file
        fs.unlinkSync(tempPath);

        resolve(result.secure_url); // Return Cloudinary URL
      } catch (uploadErr) {
        reject(uploadErr);
      }
    });
  });
};

// POST: Add single word
const vocPOST = async (req, res) => {
  try {
    const { englishWord, banglaMeaning, explanation, level } = req.body;

    // Check duplicate
    const exist = await Vocabulary.findOne({ englishWord: englishWord });
    if (exist) return res.status(400).json({ message: "Word already exists" });

    // Audio
    const audioURL = await generateAndUploadAudio(englishWord);

    // Save to MongoDB
    const newWord = new Vocabulary({
      englishWord,
      banglaMeaning,
      explanation,
      level,
      audio: audioURL
    });

    await newWord.save();
    res.json({ message: "Word added successfully", data: newWord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST: Bulk insert words
const vocPOSTBulk = async (req, res) => {
  try {
    const words = req.body.words; // array of {englishWord, banglaMeaning, explanation, level}
    const existingWords = await Vocabulary.find({}, { englishWord: 1 });
    const existingSet = new Set(existingWords.map(w => w.englishWord.toLowerCase()));

    const addedWords = [];
    for (const word of words) {
      if (existingSet.has(word.englishWord.toLowerCase())) {
        console.log(`${word.englishWord} exists. Skipping...`);
        continue;
      }

      const audioURL = await generateAndUploadAudio(word.englishWord);

      const newWord = new Vocabulary({
        englishWord: word.englishWord,
        banglaMeaning: word.banglaMeaning,
        explanation: word.explanation,
        level: word.level,
        audio: audioURL
      });

      await newWord.save();
      addedWords.push(newWord);
      console.log(`${word.englishWord} added!`);
    }

    res.json({ message: "Bulk insert completed", added: addedWords.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET: Fetch words (optional: by level)
const vocGET = async (req, res) => {
  try {
    const level = req.query.level;
    let filter = {};
    if (level) filter.level = level;

    const words = await Vocabulary.find(filter);
    res.json(words);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const vocALL = async (req, res) => {
  try {
   

    const words = await Vocabulary.find();
    res.json(words);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { vocPOST, vocPOSTBulk, vocGET,vocALL };