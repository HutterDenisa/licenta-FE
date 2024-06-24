
function submitForm() {
  var userId = getUserId();
  console.log(userId);
  var title = document.getElementById('title').value;
  console.log(title);
  var oras = document.getElementById('oras').value;
  console.log(oras);
  var locatie = document.getElementById('locatie').value;
  console.log(locatie);
  var descriere = document.getElementById('descriere').value;
  console.log(descriere);
  var image1 = document.getElementById('image1').files[0];


  let formData = new FormData();
  formData.append('userId', userId);
  formData.append('title', title);
  formData.append('oras', oras);
  formData.append('locatie', locatie);
  formData.append('description', descriere);
  formData.append('image1', image1);
  formData.append('nrLikes', 0);
  formData.append('likedByCurrentUser', false);


  console.log(formData);
  var token = localStorage.getItem('token');

  console.log('Request body:', formData);

  fetch('http://localhost:8080/eveniment', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,

    },
    body: formData,
  })
    .then(response => {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to submit form. Server returned ' + response.status);
      }
    })
    .then(data => {
      console.log(data);
      console.log('Eveniment salvat cu succes:', data);
      alert('Eveniment salvat cu succes!');
    })
    .catch(error => {
      console.error('Error occurred while submitting form:', error.message);
      if (error instanceof TypeError) {
        console.error('TypeError: There was a problem with the data types.');
      } else if (error instanceof SyntaxError) {
        console.error('SyntaxError: There was a syntax error in the code.');
      } else if (error instanceof NetworkError) {
        console.error('NetworkError: Failed to connect to the server.');
      } else {
        console.error('Unknown error occurred:', error.message);
      }
    });
}
function getUserId() {
  var userId = localStorage.getItem('userId');
  return userId;
}


function back(){
  window.location.href = 'index.html';
}
