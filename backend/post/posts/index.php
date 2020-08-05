<?php
require_once("../../config.php");

/**
 * 
 * Get headers
 * 
 */
$headers = getallheaders();

$key = "5f2b5cdbe5194f10b3241568fe4e2b24";

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
  $post = json_decode(file_get_contents("php://input"), true);
  if(isset($post['ID']) && is_numeric($post['ID'])) {
    $ID = $post['ID'];
  }

  if($post['title'] && $post['slug'] && $post['type'] && $post['content']) {
    $slug = $dbcon->real_escape_string($post['slug']);
    $type = $dbcon->real_escape_string($post['type']);
    $title = $dbcon->real_escape_string($post['title']);
    $content = $dbcon->real_escape_string($post['content']);

    if(isset($ID)) {
      $SQL   = "UPDATE post SET post.title = '$title', post.slug = '$slug', post.type = '$type', post.content = '$content'";
      $query = $dbcon->query($SQL) or trigger_error($dbcon->error . ": [$SQL]");
      if($query) {
        echo("Success");
      } else {
        echo("Failed|There was an error updating post.");
      }
    } else {
      $check_slug = $dbcon->query("SELECT * FROM post WHERE post.slug = '$slug'") or trigger_error($dbcon->error . ": [$SQL]");
      if($check_slug && $check_slug->num_rows > 0) {
        echo("Failed|A post with the same title already exists.");
      } else {
        $SQL   = "INSERT INTO post SET post.author_id = $user_id, post.title = '$title', post.slug = '$slug', post.type = '$type', post.created = CURRENT_TIMESTAMP, post.content = '$content'";
        $query = $dbcon->query($SQL) or trigger_error($dbcon->error . ": [$SQL]");
        if($query) {
          echo("Success");
        } else {
          echo("Failed|There was an error submitting post.");
        }
      }
    }
  }
}