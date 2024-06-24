function submitForm() {

  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var password2 = document.getElementById('password2').value;


  if (password !== password2) {
    alert('Parola și confirmarea parolei nu se potrivesc.');
    return;
  }


  fetch('http://localhost:8080/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: name,
      email: email,
      password: password,
      role: "PERSOANA"
    })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Utilizator înregistrat cu succes:', data);

      window.location.href = '../index.html';
    })
    .catch(error => {
      console.error('Eroare la înregistrarea utilizatorului:', error);

    });
}

function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


function isValidPassword(password) {
  var passwordRegex = /^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&*-_]).{8,}$/;
  return passwordRegex.test(password);
}

function toLogin(){
  window.location.href='../conectare/login.html';
}
