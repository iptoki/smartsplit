const EmailVerification = require("../../models/emailVerification");
const EmailSchema = require("../../schemas/emails");
const { normalizeEmailAddress } = require("../../utils/email");

async function getUserEmails() {
  return this.user.emails
    .map((e) => ({ email: e, status: "active" }))
    .concat(
      this.user.pendingEmails.map((e) => ({
        email: e.email,
        status: "pending",
      }))
    );
}

async function createUserEmail() {
  const email = await this.user.addPendingEmail(this.req.body.email);

  return this.user.emails
    .map((e) => ({ email: e, status: "active" }))
    .concat(
      this.user.pendingEmails.map((e) => ({
        email: e.email,
        status: "pending",
      }))
    );
}

async function activateUserEmail() {
  if (this.user.emails.includes(normalizeEmailAddress(this.req.params.email)))
    throw new EmailSchema.EmailAlreadyActivatedError({
      email: this.req.params.email,
    });

  const email = this.user.pendingEmails.find(
    (item) => item.email === normalizeEmailAddress(this.req.params.email)
  );

  if (!email)
    throw new EmailSchema.EmailNotFoundError({
      user_id: this.user._id,
      email: this.req.params.email,
    });

  if (!(await email.verifyActivationToken(this.req.body.token)))
    throw new EmailSchema.InvalidActivationTokenError();

  await EmailVerification.deleteOne({ _id: email._id });

  this.user.emails.push(email._id);
  await this.user.save();

  this.res.status(204).end();
}

async function deleteUserEmail() {
  if (!(await this.user.removeEmail(this.req.params.email))) {
    if (!(await this.user.removePendingEmail(this.req.params.email))) {
      throw new EmailSchema.EmailNotFoundError({
        user_id: this.user._id,
        email: this.req.params.email,
      });
    }
  }

  this.res.status(204).end();
}

module.exports = {
  getUserEmails,
  createUserEmail,
  activateUserEmail,
  deleteUserEmail,
};
