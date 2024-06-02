function submitForm() {

  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var password2 = document.getElementById('password2').value;

  //
  // if (name.length < 2) {
  //   alert('Numele trebuie să conțină cel puțin 2 caractere.');
  //   return;
  // }
  //
  //
  // if (!isValidEmail(email)) {
  //   alert('Introduceți o adresă de email validă.');
  //   return;
  // }


  /*if (!isValidPassword(password)) {
    alert('Parola trebuie să conțină cel puțin 8 caractere, cel puțin 1 literă mică, 1 literă mare, 1 cifră și 1 caracter special.');
    return;
  }*/


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
