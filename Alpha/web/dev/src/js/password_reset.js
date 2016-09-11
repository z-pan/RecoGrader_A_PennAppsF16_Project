/**
 * Called when reseting the password. This function will disable the submit button if two password do not match
 * @since [Alpha 0.0.4]
 */
function confirmResetPasswordMatch() {
	$("#repeat-password").blur(function() {
		// Test if the repeated password is the same as new password
		if ($("#repeat-password").val() !== $("#new-password").val()) {
			$("#repeat-password").addClass("error");
			promptUserError("Password doesn't match.");
		} else {
			$("#repeat-password").removeClass("error");
			hideUserFormError();
		}
	});
}

$(document).ready(function() {
	confirmResetPasswordMatch();
});