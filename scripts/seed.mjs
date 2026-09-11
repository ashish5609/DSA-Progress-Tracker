import 'dotenv/config';import fs from 'node:fs';import postgres from 'postgres';
if(!process.env.DATABASE_URL)throw Error('Set DATABASE_URL before seeding.');
const file=process.env.DSA_CSV_PATH||'C:/Users/Ashish/Downloads/DSA_question_sheet_sorted_learning_order.csv';
if(!fs.existsSync(file))throw Error(`CSV not found: ${file}`);
const parse=text=>{const out=[];let row=[],field='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&quoted&&n==='"'){field+='"';i++}else if(c==='"')quoted=!quoted;else if(c===','&&!quoted){row.push(field);field=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&n==='\n')i++;row.push(field);if(row.some(Boolean))out.push(row);row=[];field=''}else field+=c}return out};
const rows=parse(fs.readFileSync(file,'utf8')).slice(1),sql=postgres(process.env.DATABASE_URL);for(const r of rows)await sql`INSERT INTO questions(id,study_order,difficulty,title,frequency,link,topics,study_topic) VALUES (${Number(r[0])},${Number(r[0])},${r[1]},${r[2]},${Number(r[3])||0},${r[4]},${r[5]},${r[6]}) ON CONFLICT (id) DO NOTHING`;await sql.end();console.log(`Seeded ${rows.length} questions.`);
