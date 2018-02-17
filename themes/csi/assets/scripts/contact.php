<?php
$name = $_POST['username'];
$email = $_POST['useremail'];
$phone = $_POST['userphone']
$message = $_POST['usermessage'];
$formcontent="From: $name \n Phone: $phone \n Message: $message";
$recipient = "codypersinger@gmail.com";
$subject = $_POST['usersubject'];
$mailheader = "From: $email \r\n";
mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");
header("location: /?page=success");
?>