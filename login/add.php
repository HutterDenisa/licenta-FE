<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Post Form</title>
</head>
<body style=" font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    margin: 0;
    padding: 0;">

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Process the form data when the form is submitted

  // Retrieve form data
  $username = $_POST["username"];
  $postTitle = $_POST["post_title"];
  $param1 = $_POST["param1"];
  $param2 = $_POST["param2"];
  $param3 = $_POST["param3"];
  $param4 = $_POST["param4"];


  // File Upload Handling
  $targetDir = "uploads/";  // create a folder named 'uploads' in the same directory as this file
  $targetFile1 = $targetDir . basename($_FILES["photo1"]["name"]);
  $targetFile2 = $targetDir . basename($_FILES["photo2"]["name"]);
  $targetFile2 = $targetDir . basename($_FILES["photo3"]["name"]);
  $targetFile2 = $targetDir . basename($_FILES["photo4"]["name"]);
  $targetFile2 = $targetDir . basename($_FILES["photo5"]["name"]);
  $targetFile2 = $targetDir . basename($_FILES["photo6"]["name"]);
  $targetFile2 = $targetDir . basename($_FILES["photo7"]["name"]);
  $targetFile2 = $targetDir . basename($_FILES["photo8"]["name"]);

  // Move uploaded files to the specified folder
  move_uploaded_file($_FILES["photo1"]["tmp_name"], $targetFile1);
  move_uploaded_file($_FILES["photo2"]["tmp_name"], $targetFile2);
  move_uploaded_file($_FILES["photo3"]["tmp_name"], $targetFile3);
  move_uploaded_file($_FILES["photo4"]["tmp_name"], $targetFile4);
  move_uploaded_file($_FILES["photo5"]["tmp_name"], $targetFile5);
  move_uploaded_file($_FILES["photo6"]["tmp_name"], $targetFile6);
  move_uploaded_file($_FILES["photo7"]["tmp_name"], $targetFile7);
  move_uploaded_file($_FILES["photo8"]["tmp_name"], $targetFile8);

  // Perform any further processing or database operations here

  // Display a success message
  echo "<h2>Postarea a fost creata cu succes!</h2>";
}
?>

<form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post" enctype="multipart/form-data" style="max-width: 600px;
    margin: 50px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
  <label for="username" style=" display: block;
    margin-bottom: 8px;">Nume utilizator: </label>
  <input style=" width: 100%;
    padding: 10px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;" type="text" name="username" required><br>

  <label for="post_title">Titlu: </label>
  <input type="text" name="post_title" required><br>

  <label for="param1">Tip: </label>
  <input type="text" name="param1" required><br>

  <label for="param2">Rasa: </label>
  <input type="text" name="param2" required><br>

  <label for="param3">Gen: </label>
  <input type="text" name="param3" required><br>

  <label for="param4">Oras: </label>
  <input type="text" name="param4" required><br>



  <label for="photo1">Photo 1:</label>
  <input type="file" name="photo1" accept="image/*" required><br>

  <label for="photo2">Photo 2:</label>
  <input type="file" name="photo2" accept="image/*" required><br>

  <label for="photo2">Photo 3:</label>
  <input type="file" name="photo2" accept="image/*" required><br>

  <label for="photo2">Photo 4:</label>
  <input type="file" name="photo2" accept="image/*" required><br>

  <label for="photo2">Photo 5:</label>
  <input type="file" name="photo2" accept="image/*" required><br>

  <label for="photo2">Photo 6:</label>
  <input type="file" name="photo2" accept="image/*" required><br>

  <label for="photo2">Photo 7:</label>
  <input type="file" name="photo2" accept="image/*" required><br>

  <label for="photo2">Photo 8:</label>
  <input type="file" name="photo2" accept="image/*" required><br>

  <input type="submit" value="Submit">
</form>

</body>
</html>
