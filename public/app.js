// Grab the Create button from the page using its id
const createBtn = document.getElementById('createBtn');

// Listen for clicks on it. When clicked, run this function.
createBtn.addEventListener('click', () => {
  // Read what the user typed into each input box
  const title = document.getElementById('titleInput').value;
  const date = document.getElementById('dateInput').value;

  // Stop if the title is empty
  if (title === '') {
    alert('Please enter a title');
    return;
  }

  // Send the new activity to the server
  fetch('/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title, date: date })
  })
    .then(response => response.json())
    .then(data => {
      loadActivities();                                  // reload the list
      document.getElementById('titleInput').value = '';  // empty title box
      document.getElementById('dateInput').value = '';   // empty date box
    });
});

// Ask the server for all activities and show them on the page
function loadActivities() {
  fetch('/activities')
    .then(response => response.json())
    .then(activities => {
      const list = document.getElementById('activityList');
      list.innerHTML = '';   // empty it first, so nothing shows twice

      activities.forEach(activity => {
        const item = document.createElement('li');
        item.textContent = activity.title + ' – ' + activity.date + ' ';

        // NEW: make 3 buttons, one for each status
        ['present', 'absent', 'unsure'].forEach(status => {
          const btn = document.createElement('button');      // make a button
          btn.textContent = status;                          // its label
          btn.addEventListener('click', () => {              // when clicked...
            sendRsvp(activity.id, status);                   // ...send this RSVP
          });
          item.appendChild(btn);                             // add it to the line
        });

        // NEW: show every answer this activity already has
        activity.rsvps.forEach(rsvp => {
          const answer = document.createElement('p');
          let text = rsvp.name + ': ' + rsvp.status;
          if (rsvp.reason !== '') {
            text = text + ' (' + rsvp.reason + ')';          // add reason if there is one
          }
          answer.textContent = text;
          item.appendChild(answer);
        });

        list.appendChild(item);
      });
    });
}

// NEW: send one RSVP to the server
function sendRsvp(activityId, status) {
  const name = document.getElementById('nameInput').value;

  // Stop if no name typed
  if (name === '') {
    alert('Please enter your name first');
    return;
  }

  // Ask for an optional reason (Cancel = no reason)
  const reason = prompt('Reason (optional):') || '';

  // Send it to /activities/<id>/rsvp
  fetch('/activities/' + activityId + '/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, status: status, reason: reason })
  })
    .then(response => response.json())
    .then(data => {
      loadActivities();   // reload so the new answer shows
    });
}

loadActivities();   // run it once when the page loads