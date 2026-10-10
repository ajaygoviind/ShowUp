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
    .then(data => console.log('Server replied:', data));
});