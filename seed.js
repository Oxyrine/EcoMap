import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });

const db = new Database(path.join(__dirname, 'data', 'waste.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    image TEXT,
    wasteType TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'reported' CHECK(status IN ('reported','in-progress','cleaned')),
    reporterName TEXT DEFAULT 'Anonymous',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  )
`);

// Sample reports around New Delhi, India
const sampleReports = [
  { lat: 28.6139, lng: 77.2090, type: 'plastic', desc: 'Large pile of plastic bags and bottles near bus stop', status: 'reported', name: 'Rahul S.' },
  { lat: 28.6304, lng: 77.2177, type: 'organic', desc: 'Rotting food waste dumped on roadside near market', status: 'reported', name: 'Priya M.' },
  { lat: 28.5921, lng: 77.2307, type: 'e-waste', desc: 'Old monitors and keyboards abandoned near park', status: 'in-progress', name: 'Amit K.' },
  { lat: 28.6442, lng: 77.2163, type: 'construction', desc: 'Construction debris blocking pedestrian path', status: 'reported', name: 'Sneha R.' },
  { lat: 28.6100, lng: 77.2300, type: 'mixed', desc: 'Mixed waste overflowing from municipal bin', status: 'in-progress', name: 'Vikram P.' },
  { lat: 28.6350, lng: 77.2250, type: 'plastic', desc: 'Plastic waste floating in drain near residential area', status: 'cleaned', name: 'Neha G.' },
  { lat: 28.6200, lng: 77.2000, type: 'hazardous', desc: 'Chemical containers dumped near water source', status: 'reported', name: 'Arjun D.' },
  { lat: 28.6500, lng: 77.2100, type: 'organic', desc: 'Garden waste piled up along the walking trail', status: 'cleaned', name: 'Kavita L.' },
  { lat: 28.5800, lng: 77.2400, type: 'plastic', desc: 'Styrofoam and packaging material near school', status: 'reported', name: 'Rohan T.' },
  { lat: 28.6050, lng: 77.2150, type: 'mixed', desc: 'Illegal dumping spot behind shopping complex', status: 'in-progress', name: 'Divya N.' },
  { lat: 28.6280, lng: 77.1950, type: 'e-waste', desc: 'Discarded batteries and phone chargers in vacant lot', status: 'reported', name: 'Sanjay V.' },
  { lat: 28.6180, lng: 77.2350, type: 'construction', desc: 'Broken tiles and cement bags left after renovation', status: 'cleaned', name: 'Meera B.' },
  { lat: 28.6400, lng: 77.2300, type: 'organic', desc: 'Banana peels and vegetable scraps near street vendor', status: 'reported', name: 'Karan J.' },
  { lat: 28.5950, lng: 77.2050, type: 'hazardous', desc: 'Paint cans and solvent bottles near playground', status: 'in-progress', name: 'Ananya S.' },
  { lat: 28.6250, lng: 77.2400, type: 'plastic', desc: 'Single-use plastic cups littering the park area', status: 'reported', name: 'Varun M.' },
];

const insert = db.prepare(
  `INSERT INTO reports (latitude, longitude, wasteType, description, status, reporterName, createdAt)
   VALUES (?, ?, ?, ?, ?, ?, datetime('now', ?))`
);

const clear = db.prepare('DELETE FROM reports');
clear.run();

const insertAll = db.transaction((reports) => {
  reports.forEach((r, i) => {
    insert.run(r.lat, r.lng, r.type, r.desc, r.status, r.name, `-${(reports.length - i) * 2} hours`);
  });
});

insertAll(sampleReports);
console.log(`Seeded ${sampleReports.length} sample waste reports.`);
db.close();
