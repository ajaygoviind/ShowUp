// Grab the Create button from the page using its id
const createBtn = document.getElementById('createBtn');

// Listen for clicks on it. When clicked, run this function.
createBtn.addEventListener('click', () => {
  console.log('Button was clicked!');

  // Read what the user typed into each input box
  const title = document.getElementById('titleInput').value;
  const date = document.getElementById('dateInput').value;


  // Stop if the title is empty
  if (title === '') {
    console.log('Please enter a title');
    return;
  }

  console.log(title);
  console.log(date);

  // Send the new activity to the server
  fetch('/activities', {
    method: 'POST',                                    // we're creating something
    headers: { 'Content-Type': 'application/json' },   // tell the server it's JSON
    body: JSON.stringify({ title: title, date: date }) // the data, as JSON text
  })
    .then(response => response.json())                 // read the server's reply
    .then(data => {
      console.log('Server replied:', data);
      loadActivities();                                 //reload the list
      document.getElementById('titleInput').value = ''; //empty title box
      document.getElementById('dateInput').value = '';  //empty date box
});
});

// Ask the server for all activities and show them on the page
function loadActivities() {
  fetch('/activities')                          // GET request: "give me the list"
    .then(response => response.json())          // read the reply as JSON
    .then(activities => {
      const list = document.getElementById('activityList');  // find the <ul>
      list.innerHTML = '';                      // empty it first, so nothing shows twice

      // Go through the list, one activity at a time
      activities.forEach(activity => {
        const item = document.createElement('li');            // make a new <li>
        item.textContent = activity.title + ' – ' + activity.date;  // its text
        list.appendChild(item);                               // add it to the <ul>
      });
    });
}

loadActivities();   // run it once when the page loads