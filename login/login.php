<?php #include('server.php') ?>
<!DOCTYPE html>
<html>
<head>
  <title>Login</title>
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body class="container">
  <div class="header">
  	<h2>Conectare</h2>
  </div>

  <form method="post" action="login.php">
  	<?php #include('errors.php'); ?>
  	<div class="input-group">
  		<label>Nume de utilizator</label>
  		<input type="text" name="username" >
  	</div>
  	<div class="input-group">
  		<label>Parola</label>
  		<input type="password" name="password">
  	</div>
  	<div class="input-group">
  		<button type="submit" class="btn" name="login_user">Conectare</button>
  	</div>
  	<p>
  		Creaza un cont  <a href="register.php">Inregistrare</a>
  	</p>
  </form>
</body>
</html>
