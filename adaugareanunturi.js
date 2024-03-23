function submitForm() {

  var userId = getUserId();
  var title = document.getElementById('title').value;
  var tip = document.getElementById('tip').value;
  var rasa = document.getElementById('rasa').value;
  var gen = document.getElementById('gen').value;
  var culoare = document.getElementById('culoare').value;
  var varsta = document.getElementById('varsta').value;
  var oras = document.getElementById('oras').value;
  var adresa = document.getElementById('adresa').value;
  var description = document.getElementById('description').value;
  var image1 = document.getElementById('image1').files[0];
  var image2= document.getElementById('image2').files[1];
  var image3 = document.getElementById('image3').files[2];
  var image4 = document.getElementById('image4').files[3];
  var image5 = document.getElementById('image5').files[4];


  var formData = new FormData();
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
  formData.append('image2', image2);
  formData.append('image3', image3);
  formData.append('image4', image4);
  formData.append('image5', image5);
  formData.append('nrLikes', 0);
  formData.append('likedByCurrentUser', false);



  var token = localStorage.getItem('token');

  fetch('http://localhost:8080/anunt', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'multipart/form-data'
    },
    body: formData,
    mode: 'cors',
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Eroare la salvarea anunțului');
      }
    })
    .then(data => {
      console.log('Anunt salvat cu succes:', data);
      alert('Anunt salvat cu succes!');

    })
    .catch(error => {
      console.error(error.message);

    });
}

function getUserId() {
  var userId = localStorage.getItem('userId');
  return userId;
}

function back(){
  window.location.href = 'index.html';
}
