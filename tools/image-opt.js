const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '..', 'assets', 'images');
const sizes = [400, 800, 1200];

async function ensureDir(p){
  if(!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

(async ()=>{
  await ensureDir(dir);
  const files = fs.readdirSync(dir).filter(f => /\.(png|jpe?g)$/i.test(f));
  for(const file of files){
    const input = path.join(dir, file);
    const name = path.parse(file).name;
    let meta;
    try{ meta = await sharp(input).metadata(); } catch(e){ console.error('skipping', input, e.message); continue }

    // generate responsive sizes (if source is larger)
    for(const width of sizes){
      if(meta.width && width > meta.width) continue;
      const outWebp = path.join(dir, `${name}-${width}.webp`);
      const outAvif = path.join(dir, `${name}-${width}.avif`);
      await sharp(input).resize({ width }).toFormat('webp', { quality: 80 }).toFile(outWebp);
      await sharp(input).resize({ width }).toFormat('avif', { quality: 50 }).toFile(outAvif);
      console.log('Generated', outWebp, outAvif);
    }

    // also generate full-size modern formats
    try{
      const outWebpFull = path.join(dir, `${name}.webp`);
      const outAvifFull = path.join(dir, `${name}.avif`);
      await sharp(input).toFormat('webp', { quality: 90 }).toFile(outWebpFull);
      await sharp(input).toFormat('avif', { quality: 60 }).toFile(outAvifFull);
      console.log('Generated full', outWebpFull, outAvifFull);
    }catch(e){ console.error('error generating full formats for', input, e.message) }
  }
  console.log('Image optimization complete.');
})().catch(err=>{ console.error(err); process.exit(1); });
