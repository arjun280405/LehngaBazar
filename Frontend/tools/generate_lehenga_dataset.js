/*
Script: generate_lehenga_dataset.js
- Fetches the images.csv from the Generative_fashion repo
- Filters rows whose description mentions lehenga (case-insensitive)
- Writes Frontend/src/data/lehngaDataset.json

Usage:
  cd Frontend
  npm install axios csv-parse
  node tools/generate_lehenga_dataset.js

Note: this uses the raw GitHub file; no Google Drive download required since images.csv includes many product image URLs.
*/

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { parse } = require('csv-parse/sync');

const CSV_URL = 'https://raw.githubusercontent.com/ronakkaoshik42/Generative_fashion/master/images.csv';
const OUT_PATH = path.resolve(__dirname, '../src/data/lehngaDataset.json');

(async function main() {
    try {
        console.log('Fetching images.csv from Generative_fashion...');
        const res = await axios.get(CSV_URL, { responseType: 'text' });
        const csv = res.data;

        // parse CSV
        const records = parse(csv, {
            columns: true,
            skip_empty_lines: true,
            relax_quotes: true
        });

        console.log(`Total rows in CSV: ${records.length}`);

        // filter for lehenga-related descriptions
        const lehengaRegex = /\blehenga\b|\blehng[ae]\b|lehenga choli|ghagra|ghaghra|lehenga-set/i;

        const filtered = records
            .map((r, idx) => ({ link: r.link?.trim?.(), description: (r.description || '').trim(), id: r.id || idx }))
            .filter(r => r.description && lehengaRegex.test(r.description))
            .map((r, i) => ({
                id: `${r.id || i}`,
                product_title: r.description,
                image_url: r.link.replace(/"/g, ''),
                source: 'generative_fashion_images.csv'
            }));

        console.log(`Found ${filtered.length} lehenga-related entries.`);

        if (!fs.existsSync(path.dirname(OUT_PATH))) fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });

        fs.writeFileSync(OUT_PATH, JSON.stringify(filtered, null, 2), 'utf8');
        console.log('Wrote', OUT_PATH);

        console.log('\nNext steps:');
        console.log('- Restart the dev server or refresh the app so Vite picks up the new JSON.');
        console.log('- The Explore page already reads `src/data/lehngaDataset.json` (if not, point it to this file).');

    } catch (err) {
        console.error('Error:', err.message || err);
        process.exit(1);
    }
})();
