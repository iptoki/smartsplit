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
module.exports.RightSplitVoteNotFound = new HTTPErrors.NotFound(
	"At least one of the user's vote is missing"
)
module.exports.VoteAlreadySubmited = new HTTPErrors.PreconditionFailed(
	"This right holder's vote has already been submited and cannot be submited again"
)
module.exports.FileTooLarge = new HTTPErrors.PayloadTooLarge(
	"File is to large too be uploaded"
)

/* Address related errors */
module.exports.AddressNotFound = new HTTPErrors.NotFound("Address not found")

/* Promo errors */
module.exports.PromoNotFound = new HTTPErrors.NotFound(
	"Promo not found"
)

/* Product errors */
module.exports.ProductNotFound = new HTTPErrors.NotFound("Product not found")
module.exports.ConflictingProductCode = new HTTPErrors.Conflict(
	"A product already exists with this code"
)

/* Purchase errors */
module.exports.WebhookSignatureVerificationFailed = new HTTPErrors.BadRequest(
	"Webhook signature verification failed"
)
module.exports.PurchaseNotFound = new HTTPErrors.NotFound("Purchase not found")
module.exports.PurchaseImmutable = new HTTPErrors.Conflict(
	"Completed Purchases cannot be modified or deleted"
)
module.exports.BillingAddressNotFound = new HTTPErrors.NotFound(
	"Billing address not found"
)
module.exports.ProductAlreadyPurchasedForWorkpiece = new HTTPErrors.PreconditionFailed(
	"The productCode of the product you provided has already been purchased for this workpiece"
)
module.exports.StripeCustomerCreateError = new HTTPErrors.PreconditionFailed(
	"Error creating a stripe customer id"
)
module.exports.StripePaymentIntentFailed = new HTTPErrors.PreconditionFailed(
	"Error creating a payment Intent"
)

/* Generic errors */
module.exports.BadRequest = new HTTPErrors.BadRequest()
module.exports.Unauthorized = new HTTPErrors.Unauthorized()
module.exports.Forbidden = new HTTPErrors.Forbidden()
module.exports.NotFound = new HTTPErrors.NotFound()
module.exports.MethodNotAllowed = new HTTPErrors.MethodNotAllowed()
module.exports.NotAcceptable = new HTTPErrors.NotAcceptable()
module.exports.ProxyAuthenticationRequired = new HTTPErrors.ProxyAuthenticationRequired()
module.exports.RequestTimeout = new HTTPErrors.RequestTimeout()
module.exports.Conflict = new HTTPErrors.Conflict()
module.exports.Gone = new HTTPErrors.Gone()
module.exports.LengthRequired = new HTTPErrors.LengthRequired()
module.exports.PreconditionFailed = new HTTPErrors.PreconditionFailed()
module.exports.PayloadTooLarge = new HTTPErrors.PayloadTooLarge()
module.exports.URITooLong = new HTTPErrors.URITooLong()
module.exports.UnsupportedMediaType = new HTTPErrors.UnsupportedMediaType()
module.exports.RangeNotSatisfiable = new HTTPErrors.RangeNotSatisfiable()
module.exports.ExpectationFailed = new HTTPErrors.ExpectationFailed()
module.exports.ImATeapot = new HTTPErrors.ImATeapot()
module.exports.MisdirectedRequest = new HTTPErrors.MisdirectedRequest()
module.exports.UnprocessableEntity = new HTTPErrors.UnprocessableEntity()
module.exports.Locked = new HTTPErrors.Locked()
module.exports.FailedDependency = new HTTPErrors.FailedDependency()
module.exports.UnorderedCollection = new HTTPErrors.UnorderedCollection()
module.exports.UpgradeRequired = new HTTPErrors.UpgradeRequired()
module.exports.PreconditionRequired = new HTTPErrors.PreconditionRequired()
module.exports.TooManyRequests = new HTTPErrors.TooManyRequests()
module.exports.RequestHeaderFieldsTooLarge = new HTTPErrors.RequestHeaderFieldsTooLarge()
module.exports.UnavailableForLegalReasons = new HTTPErrors.UnavailableForLegalReasons()
module.exports.InternalServerError = new HTTPErrors.InternalServerError()
module.exports.NotImplemented = new HTTPErrors.NotImplemented()
module.exports.BadGateway = new HTTPErrors.BadGateway()
module.exports.ServiceUnavailable = new HTTPErrors.ServiceUnavailable()
module.exports.GatewayTimeout = new HTTPErrors.GatewayTimeout()
module.exports.HTTPVersionNotSupported = new HTTPErrors.HTTPVersionNotSupported()
module.exports.VariantAlsoNegotiates = new HTTPErrors.VariantAlsoNegotiates()
module.exports.InsufficientStorage = new HTTPErrors.InsufficientStorage()
module.exports.LoopDetected = new HTTPErrors.LoopDetected()
module.exports.BandwidthLimitExceeded = new HTTPErrors.BandwidthLimitExceeded()
module.exports.NotExtended = new HTTPErrors.NotExtended()
module.exports.NetworkAuthenticationRequired = new HTTPErrors.NetworkAuthenticationRequired()
