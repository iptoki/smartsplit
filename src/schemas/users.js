const { api, error } = require("../app")
const User = require("../models/user")

module.exports = {
	id: api.param("user_id", {
		in: "path",
		name: "user_id",
		description: "The ID of the user, or the special value \"session\" to use the currently authenticated user",
		example: "session"
	}),
	
	user: api.schemaFromModel("user", User),
	
	activateAccountSchema: api.schema("user_activate_account", {
		type: "object",
		required: ["token"],
		properties: {
			token: {
				type: "string",
				format: "jwt"
			}
		}
	}),
	
	requestPasswordReset: api.schema("user_password_reset", {
		type: "object",
		required: ["email"],
		properties: {
			email: {
				type: "string",
				format: "email",
				example: "valaire@smartsplit.org"
			}
		}
	}),
	
	passwordChange: api.schema("user_change_password", {
		type: "object",
		required: ["password"],
		properties: {
			token: {
				type: "string",
				format: "jwt"
			},
			
			currentPassword: {
				type: "string",
				format: "password"
			},
			
			password: {
				type: "string",
				format: "password"
			},
		}
	}),

	verifyMobilePhone: api.schema("user_verify_mobile_phone", {
		type: "object",
		required: ["verificationCode"],
		properties: {
			verificationCode: {
				type: "number",
				example: "159837"
			}
		}
	}),
	
	UserNotFoundError:
		error("user_not_found", 404, "User not found"),
	
	UserForbidden:
		error("user_forbidden", 403, "The currently authorized user is not allowed to access this user"),
	
	InvalidResetToken:
		error("user_invalid_reset_token", 403, "The supplied password reset token is not valid or has expired"),
	
	InvalidCurrentPassword:
		error("user_invalid_current_password", 403, "The user's current password is incorrect"),
	
	InvalidActivationTokenError:
		error("user_invalid_activation_token", 403, "The supplied account activation token is invalid or has expired"),
	
	InvalidVerificationCodeError:
		error("user_invalid_verification_code", 403, "The supplied verification code is invalid or has expired"),
	
	ConflictingUserError:
		error("user_conflict",  409, "A user already exists with this ID or email address"),

	AccountAlreadyActivatedError:
		error("user_account_already_active", 412, "This account is already active and cannot be activated again"),

	MobilePhoneAlreadyActivatedError:
		error("user_mobile_phone_already_active", 412, "This mobile phone is already active and cannot be activated again"),

}
