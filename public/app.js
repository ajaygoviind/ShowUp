// Grab the Create button from the page using its id
const createBtn = document.getElementById('createBtn');

// Listen for clicks on it. When clicked, run this function.
createBtn.addEventListener('click', () => {
  console.log('Button was clicked!');

  //Read what the user typed into each input box
  const title = document.getElementById('titleInput').value;
  const date = document.getElementById('dateInput').value;

  //NEW:stop if the title is empty
  if(title=== ('')){
    console.log('Please enter a title');
    return;
  }
  console.log(title);
  console.log(date);


});