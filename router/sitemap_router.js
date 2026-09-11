const express = require('express');
const router = express.Router();
const Vocabulary = require("../model/dataModel") // আপনার model path

router.get('/sitemap.xml', async (req, res) => {
  try {
    const words = await Vocabulary.find({}, '_id updatedAt');
    const baseUrl = 'https://learnixdb.netlify.app';

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', freq: 'daily' },
      { url: '/voc', priority: '0.9', freq: 'daily' },
      { url: '/basic', priority: '0.8', freq: 'weekly' },
      { url: '/inter', priority: '0.8', freq: 'weekly' },
      { url: '/advanced', priority: '0.8', freq: 'weekly' },
      { url: '/grammar', priority: '0.8', freq: 'weekly' },
      { url: '/quiz', priority: '0.8', freq: 'weekly' },
      { url: '/phrases', priority: '0.8', freq: 'weekly' },
      { url: '/numbers', priority: '0.8', freq: 'weekly' },
      { url: '/kids', priority: '0.8', freq: 'weekly' },
      { url: '/language/russian', priority: '0.8', freq: 'weekly' },
      { url: '/language/chinese', priority: '0.8', freq: 'weekly' },
      { url: '/about', priority: '0.6', freq: 'monthly' },
      { url: '/contact', priority: '0.6', freq: 'monthly' },
    ];

    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Dynamic word pages
    words.forEach(word => {
      const lastmod = word.updatedAt ? new Date(word.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      sitemap += `
  <url>
    <loc>${baseUrl}/vocabulary/${word._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    sitemap += '\n</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;