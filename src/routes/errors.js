const HTTPErrors = require("http-errors")

/* Auth related errors */
module.exports.InvalidAuthToken = new HTTPErrors.Unauthorized(
	"This request requires an authenticated user"
)
module.exports.UnauthorizedUserAccess = new HTTPErrors.Unauthorized(
	"The authorized user is not allowed to access this user"
)
module.exports.InvalidCredentials = new HTTPErrors.Unauthorized(
	"Invalid credentials provided: incorrect email or password"
)
module.exports.AccountNotActive = new HTTPErrors.PreconditionFailed(
	"This account is not active. This user most likely needs to activate their account via email, or may have been banned by an administrator."
)

/* User emails related errors */
module.exports.EmailNotFound = new HTTPErrors.NotFound("Email not found")
module.exports.ConflictingEmail = new HTTPErrors.Conflict(
	"A user already exists with this email"
)
module.exports.InvalidActivationToken = new HTTPErrors.Forbidden(
	"The supplied email activation token is invalid or has expired"
)
module.exports.DeleteNotAllowed = new HTTPErrors.PreconditionFailed(
	"Cannot delete the supplied email because users should have at least one email address linked to their account"
)
module.exports.EmailAlreadyActivated = new HTTPErrors.PreconditionFailed(
	"This email is already active and cannot be activated again"
)

/* Entities related errors */
module.exports.EntityTypeNotFound = new HTTPErrors.NotFound(
	"Entity type not found"
)
module.exports.EntityNotFound = new HTTPErrors.NotFound("Entity not found")
module.exports.ConflictingEntity = new HTTPErrors.Conflict(
	"An entity already exists with this ID"
)

/* User related errors */
module.exports.UserNotFound = new HTTPErrors.NotFound("User not found")
module.exports.CollaboratorNotFound = new HTTPErrors.NotFound(
	"Collaborator not found"
)
module.exports.UserMobilePhoneNotFound = new HTTPErrors.NotFound(
	"User mobile phone not found"
)
module.exports.UserForbidden = new HTTPErrors.Forbidden(
	"The currently authorized user is not allowed to perform this operation"
)
module.exports.InvalidResetToken = new HTTPErrors.Forbidden(
	"The supplied password reset token is not valid or has expired"
)
module.exports.InvalidCurrentPassword = new HTTPErrors.Forbidden(
	"The user's current password is incorrect"
)
module.exports.InvalidActivationToken = new HTTPErrors.Forbidden(
	"The supplied account activation token is invalid or has expired"
)
module.exports.InvalidVerificationCode = new HTTPErrors.Forbidden(
	"The supplied verification code is invalid or has expired"
)
module.exports.ConflictingUser = new HTTPErrors.Conflict(
	"A user already exists with this ID or email address"
)
module.exports.ConflictingUserPhoneNumber = new HTTPErrors.Conflict(
	"This phone number has already been activated by another user"
)
module.exports.AccountAlreadyActivated = new HTTPErrors.PreconditionFailed(
	"This account is already active and cannot be activated again"
)
module.exports.MobilePhoneAlreadyActivated = new HTTPErrors.PreconditionFailed(
	"This mobile phone is already active and cannot be activated again"
)
module.exports.AccountAlreadyDeleted = new HTTPErrors.PreconditionFailed(
	"This account is already deleted and cannot be deleted again"
)

/* Workpiece related errors */
module.exports.WorkpieceNotFound = new HTTPErrors.NotFound(
	"Workpiece not found"
)
module.exports.RightSplitNotFound = new HTTPErrors.NotFound(
	"Right split not found"
)
module.exports.WorkpieceFileNotFound = new HTTPErrors.NotFound("File not found")
module.exports.InvalidSplitToken = new HTTPErrors.Forbidden(
	"The supplied split token is not valid or has expired"
)
module.exports.ConflictingRightSplitState = new HTTPErrors.Conflict(
	"The current state of the right split does not allow this kind of operation"
)
module.exports.VoteAlreadySubmited = new HTTPErrors.PreconditionFailed(
	"This right holder's vote has already been submited and cannot be submited again"
)
module.exports.FileTooLarge = new HTTPErrors.PayloadTooLarge(
	"File is to large too be uploaded"
)

/* Address related errors */
module.exports.AddressNotFound = new HTTPErrors.NotFound("Address not found")
module.exports.AddressImmutable = new HTTPErrors.Conflict(
	"Address used in purchase -- cannot be modified or deleted"
)
/* PromoCode errors */
module.exports.PromoCodeNotFound = new HTTPErrors.NotFound(
	"PromoCode not found"
)
module.exports.PromoCodeImmutable = new HTTPErrors.Conflict(
	"PromoCode used in purchase -- cannot be modified or deleted"
)

/* Product errors */
module.exports.ProductNotFound = new HTTPErrors.NotFound("Product not found")
module.exports.ProductImmutable = new HTTPErrors.Conflict(
	"Product used in purchase -- cannot be modified or deleted"
)
/* Purchase errors */
module.exports.PurchaseNotFound = new HTTPErrors.NotFound("Purchase not found")
module.exports.PurchaseImmutable = new HTTPErrors.Conflict(
	"Completed Purchases cannot be modified or deleted"
)
module.exports.BillingAddressRequired = new HTTPErrors.PreconditionFailed(
	"User must have a current billing Address"
)
