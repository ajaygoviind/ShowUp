// index.js — the entry point of our backend server
const express = require('express'); // pull in the Express library
const app = express();              // create our app/server object
const PORT = 3000;                  // the port our server will listen on
//Let Express read Json sent in the request body ( needed for POST)
app.use(express.json());
app.use(express.static('public'));

//List of activities , each activity is an object.
//One seed activity so that it won't be empty while building.

let activities = [

  { 
    id: 1,
    title: 'Football at the park',
    date: '21.09.2026',
    location: 'Rheinbreitbach' ,
    rsvps: []
    
  }
];
// Define a route: when someone visits "/", run this function
app.get('/', (req, res) => {
  res.send('Hello from ShowUp!');
});

//READ: send back the full list of activities as JSON
app.get('/activities' , (req,res) => {
  res.json(activities);
});

//CREATE: build a new activity from sent data and add it to the list
app.post('/activities' , (req,res) => {
  const newActivity = {
    id: Date.now(),                 //unique id from current time
    title: req.body.title,         //title they type
    date: req.body.date,          //date they type
    location: req.body.location,  // location they type   
    rsvps: []                    //nobody has responded yet
  };
  activities.push(newActivity); //add to the list
  res.json(newActivity); //send it back as confirmation
});

// 👇 NEW
//RSVP: someone responds to one activity
app.post('/activities/:id/rsvp', (req, res) => {
  const id = Number(req.params.id);                    // which activity? taken from the URL
  const activity = activities.find(a => a.id === id);  // look for it in the list

  // If no activity has that id, reply with an error
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }

  const rsvp = {
    name: req.body.name,           // who is answering
    status: req.body.status,       // 'present', 'absent' or 'unsure'
    reason: req.body.reason || ''  // optional reason, empty if none given
  };

  activity.rsvps.push(rsvp);       // add the answer to that activity's list
  res.json(activity);              // send back the updated activity
});

// Start the server, listening on PORT
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});