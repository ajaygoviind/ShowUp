// tests/app.test.js — automatic tests for the ShowUp server routes.
// Run them with: npm test
//
// supertest sends fake requests to the app (like curl, but from code),
// and Jest checks that the answers are what we expect.

// Use a temporary in-memory database for the tests,
// so they never touch the real showup.db file.
// This must be set BEFORE index.js is loaded.
process.env.DB_FILE = ':memory:';

const request = require('supertest');
const app = require('../index');

// TEST 1 — reading the list
test('GET /activities returns a list that includes the seed activity', async () => {
  const res = await request(app).get('/activities');

  expect(res.status).toBe(200);                      // request succeeded
  expect(Array.isArray(res.body)).toBe(true);        // we got a list back
  expect(res.body[0].title).toBe('Football at the park');
  expect(res.body[0].rsvps).toEqual([]);             // nobody has answered yet
});

// TEST 2 — creating an activity
test('POST /activities creates a new activity and it appears in the list', async () => {
  const res = await request(app)
    .post('/activities')
    .send({ title: 'Movie night', date: '2026-12-01' });

  expect(res.status).toBe(200);
  expect(res.body.title).toBe('Movie night');        // server sends back what it saved
  expect(res.body.id).toBeDefined();                 // and gave it an id

  // Check it is really stored: ask for the list again
  const list = await request(app).get('/activities');
  const titles = list.body.map(activity => activity.title);
  expect(titles).toContain('Movie night');
});

// TEST 3 — RSVPing to an activity
test('POST /activities/:id/rsvp stores an answer with a reason', async () => {
  const res = await request(app)
    .post('/activities/1/rsvp')
    .send({ name: 'Ajay', status: 'unsure', reason: 'late from work' });

  expect(res.status).toBe(200);
  expect(res.body.rsvps).toContainEqual({
    name: 'Ajay',
    status: 'unsure',
    reason: 'late from work'
  });
});

// TEST 4 — RSVPing to an activity that does not exist
test('POST /activities/:id/rsvp returns 404 for an unknown activity', async () => {
  const res = await request(app)
    .post('/activities/9999/rsvp')
    .send({ name: 'Ajay', status: 'present' });

  expect(res.status).toBe(404);
  expect(res.body.error).toBe('Activity not found');
});
