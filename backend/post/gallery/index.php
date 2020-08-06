<?php
require_once("../../config.php");

/**
 * 
 * Get headers
 * 
 */
$headers = getallheaders();

if(isset($headers['Authorisation'])) {
  require_once("../../authorisation/jwt.php");

  $id_token = $headers['Authorisation'];
  try {
    $userinfo = JWT::decode($id_token, $key, array("HS256"));
  } catch(Exception $error) {
    header("HTTP/1.0 401 Unauthorized");
    exit;
  }
} else {
  header("HTTP/1.0 401 Unauthorized");
  exit;
}

/**
 * 
 * Get user ID
 * 
 */
$user_id = $userinfo->user_id;

if($_SERVER['REQUEST_METHOD'] == 'POST') {
  if(isset($_FILES['file'])) {
    $verification = getimagesize($_FILES['file']['tmp_name']);
    if($verification == false) {
      die("Failed|The file uploaded is not an image.");
    }

    $filename = basename($_FILES['file']['name']);
    $targeted = "../../../gallery/" . $filename;

    if(!file_exists($targeted)) {
      if(move_uploaded_file($_FILES['file']['tmp_name'], $targeted)) {
        $description = $dbcon->real_escape_string($_POST['description']);
        $title = $dbcon->real_escape_string($_POST['title']);
        $SQL   = "INSERT INTO gallery SET gallery.user_id = $user_id, gallery.filename = '$filename', gallery.posted = CURRENT_TIMESTAMP, gallery.modified = CURRENT_TIMESTAMP, gallery.title = '$title', gallery.description = '$description'";
        $query = $dbcon->query($SQL) or trigger_error($dbcon->error . ": [$SQL]");
        if($query) {
          echo("Success");
        }
      }
    } else {
      echo("Failed|A file with a similar file name already exists.");
    }
  } else {
    echo("Failed|There is no file uploaded.");
  }
}