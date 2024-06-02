function submitForm() {
  var userId = getUserId();
  console.log(userId);
  var title = document.getElementById('title').value;
  console.log(title);
  var tip = document.getElementById('tip').value;
  console.log(tip);
  var rasa = document.getElementById('rasa').value;
  console.log(rasa);
  var gen = document.getElementById('gen').value;
  console.log(gen);
  var culoare = document.getElementById('culoare').value;
  console.log(culoare);
  var varsta = document.getElementById('varsta').value;
  console.log(varsta);
  var oras = document.getElementById('oras').value;
  console.log(oras);
  var adresa = document.getElementById('adresa').value;
  console.log(adresa);
  var description = document.getElementById('description').value;
  console.log(description);
  var image1 = document.getElementById('image1').files[0];
  var tipAnunt = document.getElementById('tipAnunt').value;
  console.log(tipAnunt);

  let formData = new FormData();
  formData.append('userId', userId);
  formData.append('title', title);
  formData.append('tip', tip);
  formData.append('rasa', rasa);
  formData.append('gen', gen);
  formData.append('culoare', culoare);
  formData.append('varsta', varsta);
  formData.append('oras', oras);
  formData.append('adresa', adresa);
  formData.append('description', description);
  formData.append('image1', image1);
  formData.append('tipAnunt', tipAnunt);
  formData.append('nrLikes', 0);
  formData.append('likedByCurrentUser', false);


  console.log(formData);
  var token = localStorage.getItem('token');

  console.log('Request body:', formData);

  fetch('http://localhost:8080/anunt', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
     // 'Content-Type': 'application/json'
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
      console.log('Anunt salvat cu succes:', data);
      alert('Anunt salvat cu succes!');
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
