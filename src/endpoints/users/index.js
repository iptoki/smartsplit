const { api, errorResponse } = require("../../app")
const { body } = require("../../autoapi")
const AuthSchema = require("../../schemas/auth")
const UserSchema = require("../../schemas/users")
const EmailSchema = require("../../schemas/emails")
const JWTAuth = require("../../service/JWTAuth")
const UserController = require("./users")
const EmailController = require("./emails")

api.get(
	"/users/{user_id}",
	{
		tags: ["Users"],
		parameters: [UserSchema.id],
		summary: "Get a user's basic profile",
		hooks: { auth: true },
		responses: {
			200: UserSchema.user,
			404: UserSchema.UserNotFoundError,
		},
	},
	UserController.loadUserWithPendingEmails
)

api.get(
	"/users/{user_id}/avatar",
	{
		tags: ["Users"],
		parameters: [UserSchema.id],
		summary: "Get a user's avatar",
		responses: {
			404: UserSchema.UserNotFoundError,
		},
	},
	UserController.loadUser,
	UserController.getUserAvatar
)

api.post(
	"/users/",
	{
		tags: ["Users"],
		summary: "Create a new user",
		requestBody: body({
			allOf: [
				UserSchema.user,
				{
					required: ["email", "password", "locale"],
				},
			],
		}),
		responses: {
			200: UserSchema.user,
			409: UserSchema.ConflictingUserError,
		},
	},
	UserController.createUser
)

api.post(
	"/users/activate",
	{
		tags: ["Users"],
		summary: "Activates a user account",
		requestBody: UserSchema.activateAccountSchema,
		responses: {
			200: AuthSchema.sessionInfo,
			403: UserSchema.InvalidActivationTokenError,
			412: UserSchema.AccountAlreadyActivatedError,
		},
	},
	UserController.activateUserAccount
)

api.patch(
	"/users/{user_id}",
	{
		tags: ["Users"],
		parameters: [UserSchema.id],
		summary: "Updates a user",
		requestBody: UserSchema.user,
		hooks: { auth: true },
		responses: {
			200: UserSchema.user,
			403: UserSchema.UserForbiddenError,
		},
	},
	JWTAuth.requireUser,
	JWTAuth.authorizeUserAccess,
	UserController.loadUser,
	UserController.updateUser
)

api.post(
	"/users/request-password-reset",
	{
		tags: ["Users"],
		summary:
			"Requests a password reset: sends an email with a reset token/link to the user",
		requestBody: UserSchema.requestPasswordReset,
		responses: {
			200: { description: "Password reset email sent successfully" },
			404: UserSchema.UserNotFoundError,
		},
	},
	UserController.resetUserPassword
)

api.post(
	"/users/change-password",
	{
		tags: ["Users"],
		summary:
			"Changes the user's password and returns an new access token. All previous access tokens will be invalidated. Requires either `token` or `currentPassword` to be provided to authorize the password change.",
		requestBody: UserSchema.passwordChange,
		security: [{}],
		hooks: { auth: true },
		responses: {
			200: AuthSchema.sessionInfo,
			403: errorResponse(
				"Failed to confirm password change. If `token` was supplied, an error code of `user_invalid_reset_token` is returned. Otherwise, a valid `currentPassword` needs to be provided, or a `user_invalid_current_password` error will be returned."
			),
		},
	},
	UserController.changeUserPassword
)

api.post(
	"/users/verify-mobile-phone",
	{
		tags: ["Users"],
		summary: "Verify the user's mobile phone",
		requestBody: UserSchema.verifyMobilePhone,
		hooks: { auth: true },
		responses: {
			200: { description: "Mobile phone successfully verified" },
			403: UserSchema.InvalidVerificationCodeError,
			412: UserSchema.MobilePhoneAlreadyActivatedError,
		},
	},
	JWTAuth.requireUser,
	UserController.verifyUserMobilePhone
)

api.delete(
	"/users/{user_id}",
	{
		tags: ["Users"],
		parameters: [UserSchema.id],
		summary: "Delete the user account",
		hooks: { auth: true },
		responses: {
			200: { description: "Account deleted successfully" },
			404: UserSchema.UserNotFoundError,
			412: UserSchema.AccountAlreadyDeletedError,
		},
	},
	JWTAuth.requireUser,
	JWTAuth.authorizeUserAccess,
	UserController.loadUser,
	UserController.deleteUserAccount
)

api.get(
	"/users/{user_id}/emails/",
	{
		tags: ["Emails"],
		parameters: [UserSchema.id],
		summary: "Get all the pending and activated emails of a user",
		hooks: { auth: true },
		responses: {
			200: EmailSchema.emails,
			404: UserSchema.UserNotFoundError,
		},
	},
	JWTAuth.requireUser,
	JWTAuth.authorizeUserAccess,
	UserController.loadUserWithPendingEmails,
	EmailController.getUserEmails
)

api.post(
	"/users/{user_id}/emails/",
	{
		tags: ["Emails"],
		parameters: [UserSchema.id],
		summary: "Link a new email as pending in a user account",
		hooks: { auth: true },
		requestBody: EmailSchema.createEmail,
		responses: {
			200: EmailSchema.emails,
			404: UserSchema.UserNotFoundError,
			409: EmailSchema.ConflictingEmailError,
		},
	},
	JWTAuth.requireUser,
	JWTAuth.authorizeUserAccess,
	UserController.loadUserWithPendingEmails,
	EmailController.createUserEmail
)

api.post(
	"/users/{user_id}/emails/{email}",
	{
		tags: ["Emails"],
		parameters: [UserSchema.id, EmailSchema.email],
		summary: "Activate an email in the user profile",
		hooks: { auth: true },
		requestBody: EmailSchema.activateEmailSchema,
		responses: {
			200: { description: "Email successfully activated" },
			404: EmailSchema.EmailNotFoundError,
			409: EmailSchema.InvalidActivationTokenError,
			412: EmailSchema.EmailAlreadyActivatedError,
		},
	},
	UserController.loadUserWithPendingEmails,
	EmailController.activateUserEmail
)

api.delete(
	"/users/{user_id}/emails/{email}",
	{
		tags: ["Emails"],
		parameters: [UserSchema.id, EmailSchema.email],
		summary: "Delete an email from a user account",
		hooks: { auth: true },
		responses: {
			200: { description: "Email successfully deleted" },
			404: EmailSchema.EmailNotFoundError,
		},
	},
	JWTAuth.requireUser,
	JWTAuth.authorizeUserAccess,
	UserController.loadUserWithPendingEmails,
	EmailController.deleteUserEmail
)
