const HTTPErrors = require('http-errors')

/* Auth related errors */
module.exports.InvalidCredentials = new HTTPErrors.Unauthorized("Invalid credentials provided: incorrect email or password")
module.exports.AccountNotActive = new HTTPErrors.PreconditionFailed("This account is not active. This user most likely needs to activate their account via email, or may have been banned by an administrator.")

/* User emails related errors */
module.exports.EmailNotFound = new HTTPErrors.NotFound("Email not found")
module.exports.ConflictingEmail = new HTTPErrors.Conflict("A user already exists with this email")
module.exports.InvalidActivationToken = new HTTPErrors.Forbidden("The supplied email activation token is invalid or has expired")
module.exports.DeleteNotAllowed = new HTTPErrors.PreconditionFailed("Cannot delete the supplied email because users should have at least one email address linked to their account")
module.exports.EmailAlreadyActivated = new HTTPErrors.PreconditionFailed("This email is already active and cannot be activated again")

/* List related errors */
module.exports.ListNotFound = new HTTPErrors.NotFound("List not found")
module.exports.ListEntityNotFound = new HTTPErrors.NotFound("Entity not found")
module.exports.ConflictingListEntity = new HTTPErrors.Conflict("An entity already exists with this ID")

/* User related errors */
module.exports.UserNotFound = new HTTPErrors.NotFound("User not found")
module.exports.UserForbidden = new HTTPErrors.Forbidden("The currently authorized user is not allowed to perform this operation")
module.exports.InvalidResetToken = new HTTPErrors.Forbidden("The supplied password reset token is not valid or has expired")
module.exports.InvalidCurrentPassword = new HTTPErrors.Forbidden("The user's current password is incorrect")
module.exports.InvalidActivationToken = new HTTPErrors.Forbidden("The supplied account activation token is invalid or has expired")
module.exports.InvalidVerificationCode = new HTTPErrors.Forbidden("The supplied verification code is invalid or has expired")
module.exports.ConflictingUser = new HTTPErrors.Conflict("A user already exists with this ID or email address")
module.exports.AccountAlreadyActivated = new HTTPErrors.PreconditionFailed("This account is already active and cannot be activated again")
module.exports.MobilePhoneAlreadyActivated = new HTTPErrors.PreconditionFailed("This mobile phone is already active and cannot be activated again")
module.exports.AccountAlreadyDeleted = new HTTPErrors.PreconditionFailed("This account is already deleted and cannot be deleted again")

/* Workpiece related errors */
module.exports.WorkpieceNotFound = new HTTPErrors.NotFound("Workpiece not found")
module.exports.RightSplitNotFound = new HTTPErrors.NotFound("Right split not found")
module.exports.FileNotFound = new HTTPErrors.NotFound("File not found")
module.exports.InvalidSplitToken = new HTTPErrors.Forbidden("The supplied split token is not valid or has expired")
module.exports.ConflictingRightSplitState = new HTTPErrors.Conflict("The current state of the right split does not allow this kind of operation")
module.exports.VoteAlreadySubmited = new HTTPErrors.PreconditionFailed("This right holder's vote has already been submited and cannot be submited again")
