<?php
// Database credentials
$servername = "localhost";
$username = "root";  // Replace with your MySQL username
$password = "";      // Replace with your MySQL password
$dbname = "typing";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve form data
$name = $_POST['name'];
$dob = $_POST['dob'];
$gender = $_POST['gender'];
$contact = $_POST['contact'];
$email = $_POST['email'];
$address = $_POST['address'];
$username = $_POST['username'];
$password = $_POST['password'];
$re_password = $_POST['re_password'];

// Password confirmation check
if ($password != $re_password) {
    echo "Passwords do not match!";
    exit();
}


// Insert data into the database
$sql = "INSERT INTO user_info (name, dob, gender, contact_number, email, address, username, password)
        VALUES ('$name', '$dob', '$gender', '$contact', '$email', '$address', '$username', '$password')";

if ($conn->query($sql) === TRUE) {
    echo "Registration successful!";
    header("Location: index.html"); 
    exit();
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Close connection
$conn->close();
?>
