<?php
session_start();

function getIfSet(&$value, $default = null) {
  return isset($value) ? $value : $default;
}

if (!isset($_SESSION['count'])) {
  $_SESSION['count'] = 0;
}
if (!isset($_SESSION['previous'])) {
  $_SESSION['previous'] = ' ';
}

$_SESSION['count'] += 1;

$msg = getIfSet($_REQUEST['msg']);

if ($msg == null) {
  $message = "(".$_SESSION['count']."): `msg` key missing from request";
  $response = array (
    'code' => 1,
    'msg'  => $message
  );
  $_SESSION['previous'] = $msg;
} else {
  if (strcmp($_SESSION['previous'], $msg) == 0) {
    $message = "(".$_SESSION['count']."): Duplicate received. Ignoring.";
    $response = array (
      'code' => 2,
      'msg'  => $message
    );
  } else {
    $message = "(".$_SESSION['count']."): ".$msg;
    $response = array (
      'code' => 0,
      'msg'  => $message
    );
    $_SESSION['previous'] = $msg;
  }
}

header('Content-type: application/json');
echo json_encode($response);