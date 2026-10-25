// index.js — the entry point of our backend server
const express = require('express');          // pull in the Express library
const Database = require('better-sqlite3');  // NEW: pull in the SQLite library
const app = express();                       // create our app/server object
const PORT = 3000;                           // the port our server will listen on

app.use(express.json());           // let Express read JSON sent in requests
app.use(express.static('public')); // serve the files in /public to the browser

// NEW: open the database file (it gets created the first time)
const db = new Database('showup.db');

// NEW: create the two tables, but only if they don't exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT,
    location TEXT
  );
  CREATE TABLE IF NOT EXISTS rsvps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL,
    reason TEXT
  );
`);

// NEW: add the football activity once, only if the table is empty
const count = db.prepare('SELECT COUNT(*) AS n FROM activities').get().n;
if (count === 0) {
  db.prepare('INSERT INTO activities (title, date, location) VALUES (?, ?, ?)')
    .run('Football at the park', '2026-09-21', 'Rheinbreitbach');
}

//READ: send back all activities, each with its RSVPs
app.get('/activities', (req, res) => {
  const activities = db.prepare('SELECT * FROM activities').all();  // all rows

  // For each activity, fetch its answers from the rsvps table
  activities.forEach(activity => {
    activity.rsvps = db
      .prepare('SELECT name, status, reason FROM rsvps WHERE activity_id = ?')
      .all(activity.id);
  });

  res.json(activities);
});

//CREATE: add a new activity to the database
app.post('/activities', (req, res) => {
  const result = db
    .prepare('INSERT INTO activities (title, date, location) VALUES (?, ?, ?)')
    .run(req.body.title, req.body.date, req.body.location || null);

  // Read the new row back so we can send it as confirmation
  const newActivity = db
    .prepare('SELECT * FROM activities WHERE id = ?')
    .get(result.lastInsertRowid);
  newActivity.rsvps = [];   // nobody has responded yet

  res.json(newActivity);
});

//RSVP: someone responds to one activity
app.post('/activities/:id/rsvp', (req, res) => {
  const id = Number(req.params.id);   // which activity? taken from the URL
  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(id);

  // If no activity has that id, reply with an error
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  // Save the answer, linked to the activity by activity_id
  db.prepare('INSERT INTO rsvps (activity_id, name, status, reason) VALUES (?, ?, ?, ?)')
    .run(id, req.body.name, req.body.status, req.body.reason || '');

  // Send back the activity with all its answers
  activity.rsvps = db
    .prepare('SELECT name, status, reason FROM rsvps WHERE activity_id = ?')
    .all(id);
  res.json(activity);
});

// Start the server, listening on PORT
app.listen(PORT, (error) => {
  if (error) {
    console.log('Could not start the server:', error);  // show what went wrong
    return;
  }
  console.log(`Server running at http://localhost:${PORT}`);
});