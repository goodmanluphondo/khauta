<?php
require("../config.php");

header("Content-Type: application/json");

$query = isset($_GET['query']) ? $_GET['query'] : null;

if($query != null) {
    switch($query) {
        case "post":
            if(isset($_GET['id']) && is_numeric($_GET['id'])) {
                $ID    = $_GET['id'];
                $SQL   = "SELECT * FROM post WHERE post.deleted = 0 AND post.ID = $ID LIMIT 1";
                $query = $dbcon->query($SQL) or trigger_error($dbcon->error . ": [$SQL]");

                if($query && $query->num_rows > 0) {
                    $post = $query->fetch_array(MYSQLI_ASSOC);

                    echo(json_encode($post));
                }
            }
        break;
        case "posts":
            $SQL   = "SELECT * FROM post WHERE post.deleted = 0";
            $query = $dbcon->query($SQL) or trigger_error($dbcon->error . ": [$SQL]");

            if($query && $query->num_rows > 0) {
                $posts = array();
                while($post = $query->fetch_array(MYSQLI_ASSOC)) {
                    array_push($posts, $post);
                }

                echo(json_encode($posts));
            }
        break;
    }
}
