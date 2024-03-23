function trimite() {
  var nume = document.getElementById('Nume').value;
  var email = document.getElementById('Email').value;
  var telefon = document.getElementById('Telefon').value;
  var subiect = document.getElementById('Subiect').value;
  var mesaj = document.getElementById('Mesaj').value;

  fetch('http://localhost:8080/contact', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nume: nume,
      email: email,
      telefon: telefon,
      subiect: subiect,
      mesaj: mesaj
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Mesaj inregistrat cu succes:', data);
      alert('Mesaj inregistrat cu succes');
    })
    .catch(error => {
      console.error('Eroare la inregistrarea mesajului:', error);
    });
}
function sterge(){
 var formular= document.getElementById("form");
 formular.reset();
}
