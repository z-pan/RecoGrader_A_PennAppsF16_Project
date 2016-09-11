<html>
	<head></head>
	<body>
		<!--logic:
		signup: after form action, php checks if the email has an account associated with it. 
		If yes then prompts already have an account(not implemented as of 10/12/2015)
		If no then directs user to signup.html, which is handled by signup.php.
		Also compares invite to database
		login: checks if user matches password. If either is wrong or not found 
		return error.
		-->
	<?php
		//create short variable names
		@ $db = new mysqli('localhost','xyttyxy','1q2w3e4r','crunchfeed');
		if($db->connect_error){
			echo json_encode(101);
		}
		
		if(array_key_exists('signup', $_POST) && array_key_exists('invite', $_POST)){
			$email = $_POST['email'];
			$invite = $_POST['invite'];
			if (!$email || strpos($email, '*@*.')){
				//invalid email address
				echo json_encode(10103);
				header('Location:400.html');
			}
			$get_invite = "SELECT invite_id 
						FROM invite 
						WHERE invite_used = 0 
						LIKE '$invite'";
			//echo $invite;
			if($db->query($get_invite) == true){
				$returned_invite = $db->query($get_invite);
				if ($returned_invite != $invite){
				//invalid invite
				echo json_encode(10104);
				//header('Location:400.html');
				}
			}
			else{
				echo json_encode(10200);
				$token = sha1(hash($email));
				echo json_encode($token);
				$store = "UPDATE invite 
							SET email = $email,
								token = $token,
								timestamp = time();
							WHERE invite = $invite;";
				$db->query($store);
				exit();
			}
			
			
			$query = "UPDATE invite SET invite_used=1 WHERE invite_id='$invite'";
			if ($db->query($query) == true){
				//success, send user to signup page
				echo json_encode(10200);
				$_SESSION["email"] = $email;
				$_SESSION["invite"] = $invite;
				header('<meta http-equiv="refresh" content="2;signup.html">');
			} else {
				//failed sql update
				echo json_encode(90401);
			}
			
		}
		
		if (array_key_exists('user', $_POST) && array_key_exists('password', $_POST)){
			$user = $_POST['user'];
			$password = $_POST['password'];
			$query = "select user_id FROM invite LIKE '$user'";
			$returned_user = $db->query($query);
			if ($returned_user != $user){
				//error code 1: user not found!
				echo json_encode(10101);
				exit();
			}
			$query = "select user_pw FROM invite where user_id = '$user'";
			$returned_pw = $db->query($query);
			if ($returned_pw != $password){
				//error code 2: password does not match username!
				echo json_encode(10102);
				exit();
			}
			
			else {
				
			}
		}
	?>
	</body>
	</html>