<?php
/**
 * 
 * Authorisation Script
 * 
 */
require("../config.php");

if($_SERVER['REQUEST_METHOD'] == 'POST') {
  /** Set Content Type */
  // header("Content-type: application/json");

  $result = array(); // Initiate $result array

  /** Get posted data */
  $data = json_decode(file_get_contents('php://input'), true);

  /** Sanitise credentials */
  $username = $dbcon->real_escape_string($data['username']);
  $password = $dbcon->real_escape_string($data['password']);
  $password = md5($password);

  $SQL   = "SELECT * FROM user WHERE user.deleted = 0 AND user.username = '$username' AND user.password = '$password' LIMIT 1";
  $query = $dbcon->query($SQL) or trigger_error($dbcon->error . ": [$SQL]");

  if($query) {
      if($query->num_rows > 0) {
          require_once("jwt.php");

          $nbf = time();
          $exp = time() + 1800;
          $key = "5f2b5cdbe5194f10b3241568fe4e2b24";

          $user = $query->fetch_array(MYSQLI_ASSOC);
          unset($user['password']);

          $payload = array();
          $payload['user_id'] = $user['ID'];
          if(isset($nbf)) {
              $payload['nbf'] = $nbf;
          }
          if(isset($exp)) {
              $payload['exp'] = $exp;
          }

          $result = array("token" => JWT::encode($payload, $key), "name" => $user['firstname']);
      } else {
          $result = array("error" => "Username and password do not match.");
      }
  } else {
    $result = array("error" => "Server error. Please try again later.");
  }

  echo(json_encode($result));
} else {
  header("HTTP/1.0 401 Unauthorized");
  exit;
}
