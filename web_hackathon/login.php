<?php
// Database connection variables
$servername = "localhost";
$username = "root"; // Replace with your MySQL username
$password = ""; // Replace with your MySQL password
$dbname = "typing";

// Create a connection to MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $inputUsername = $conn->real_escape_string($_POST['username']);
    $inputPassword = $conn->real_escape_string($_POST['password']);

    // Prepare and execute SQL query to fetch user data
    $sql = "SELECT password FROM user_info WHERE username = '$inputUsername'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Fetch the stored password for this username
        $row = $result->fetch_assoc();
        $storedPassword = $row['password'];

        // Check if the entered password matches the stored password
        if ($inputPassword === $storedPassword) {
            header("Location: interface.html");
        } else {
            echo '<script>
                    alert("Incorrect password. Please try again.");
                    window.location.href = "index.html";
                  </script>';
        }
    } else {
        echo '<script>
                alert("Username not found. Please check your credentials or register first.");
                window.location.href = "index.html";
              </script>';
    }
}

// Close the connection
$conn->close();
?>