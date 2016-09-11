<html>
	<head></head>
	<body>
		<!--this program deals with authentication of tokens sent by client. 
		It identifies the task(client specified) and checks the existence of
		token and validity of timestamp. 
		If valid, the script returns to client authentication respective values
		and deletes the entire row in table.
		Else the server returns auth failed code to client, either invalid token
		or time elapse. The invalid token situation should take precedence.
		
		for the invite mech currently under construction, the row is deleted, 
		the email is stored in table register. The script then stores another token in
		register, echos it to the client, which then initiates an new task=register.
		The immediate auth naturally passes. Ideally an email about the validity of invite
		should be sent to the email address with the link containing the token 
		to allow the user to restart registration process if interrupted.  
		-->
		<?php
			$task = $_POST['task'];
			$token = $_POST['token'];
			//invite auth mechanism
			
			@ $db = new mysqli('localhost','xyttyxy','1q2w3e4r','crunchfeed');
			switch($task){
				case invite:
				$get_timestamp = "SELECT FROM invite timestamp WHERE token = $token";
				$token_confirm = "SELECT FROM invite token WHERE token = $token";
				if ($token_confirm == $token && (time() - $get_timestamp) <= 86400){
					//success
				}
				else if($token_confirm != $token){
					echo json_encode('wrong token');
					exit();
				}
				else if ((time() - $get_timestamp) > 86400)
				{
					echo json_encode('time elapsed');
					exit();
				}
			}
		?>
	</body>
</html>