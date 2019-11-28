const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: process.env.REGION});
const TABLE = 'rightHolder';


exports.handler = (event, context, callback) => {
    
    let CustomMessage_ChoosePassword_FR = `<style>
        p {
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        }
        
        </style>

        <div id=":x9" class="a3s aXjCH " role="gridcell" tabindex="-1">
        <p>Bonjour ${event.request.userAttributes.given_name},</p>
        <p>Avant d'aller plus loin dans le processus de vote sur l'application Smartsplit, tu dois compléter et confirmer ton compte en choisissant ton mot de passe.</p>
            <button style="background-color: #2da84f; padding: 15px 32px; text-align: center; display: inline-block; font-size: 16px;" ><a style="color: white; text-decoration: none;" href="http://proto.smartsplit.org/forgot-password-verification?confirmation_code=${event.request.codeParameter}&user_name=${event.userName}&email=${event.request.userAttributes.email}"> Choisir mon mot de passe </a></button>
        <p>Merci,</p>
        <p>L'équipe Smartsplit</p>
        </div>`

    let CustomMessage_ChoosePassword_EN = `<style>
        p {
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        }
        
        </style>

        <div id=":x9" class="a3s aXjCH " role="gridcell" tabindex="-1">
        <p>Hello ${event.request.userAttributes.given_name},</p>
        <p>Before proceeding further in the voting process in the Smartsplit application, you need to complete and confirm your account by choosing your password.</p>
            <button style="background-color: #2da84f; padding: 15px 32px; text-align: center; display: inline-block; font-size: 16px;" ><a style="color: white; text-decoration: none;" href="http://proto.smartsplit.org/forgot-password-verification?confirmation_code=${event.request.codeParameter}&user_name=${event.userName}&email=${event.request.userAttributes.email}"> Choose your password </a></button>
        <p>Thanks,</p>
        <p>The Smartsplit team</p>
        </div>`
        
    let CustomMessage_ForgotPassword_FR = `<style>
        p {
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        }
        
        </style>

        <div id=":x9" class="a3s aXjCH " role="gridcell" tabindex="-1">
        <p>Bonjour ${event.request.userAttributes.given_name},</p>
        <p>Cliquez le lien pour réinitialiser votre mot de passe pour l'application Smartsplit.</p>
            <button style="background-color: #2da84f; padding: 15px 32px; text-align: center; display: inline-block; font-size: 16px;" ><a style="color: white; text-decoration: none;" href="http://proto.smartsplit.org/forgot-password-verification?confirmation_code=${event.request.codeParameter}&user_name=${event.userName}&email=${event.request.userAttributes.email}"> Réinitialiser votre mot de passe </a></button>
        <p>Merci,</p>
        <p>L'équipe Smartsplit</p>
        </div>`
        
    let CustomMessage_ForgotPassword_FR_Pochette = `<style>
        p {
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        }
        
        </style>

        <div id=":x9" class="a3s aXjCH " role="gridcell" tabindex="-1">
        <p>Bonjour ${event.request.userAttributes.given_name},</p>
        <p>Cliquez le lien pour réinitialiser votre mot de passe pour l'application Pochette.</p>
            <button style="background-color: #2da84f; padding: 15px 32px; text-align: center; display: inline-block; font-size: 16px;" ><a style="color: white; text-decoration: none;" href="http://dev.pochette.info/forgot-password-verification?confirmation_code=${event.request.codeParameter}&user_name=${event.userName}&email=${event.request.userAttributes.email}"> Réinitialiser votre mot de passe </a></button>
        <p>Merci,</p>
        <p>L'équipe Pochette</p>
        </div>`
    
    
    let CustomMessage_ForgotPassword_EN = `<style>
        p {
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        }
        </style>

        <div id=":x9" class="a3s aXjCH " role="gridcell" tabindex="-1">
        <p>Hello ${event.request.userAttributes.given_name},</p>
        <p>Click the link to reset your password for your Smartsplit account.</p>
            <button style="background-color: #2da84f; padding: 15px 32px; text-align: center; display: inline-block; font-size: 16px;" ><a style="color: white; text-decoration: none;" href="http://proto.smartsplit.org/forgot-password-verification?confirmation_code=${event.request.codeParameter}&user_name=${event.userName}&email=${event.request.userAttributes.email}"> Reset your password </a></button>
        <p>Thanks,</p>
        <p>The Smartsplit team</p>
        </div>`

    let CustomMessage_ForgotPassword_EN_Pochette = `<style>
        p {
        display: block;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        }
        </style>

        <div id=":x9" class="a3s aXjCH " role="gridcell" tabindex="-1">
        <p>Hello ${event.request.userAttributes.given_name},</p>
        <p>Click the link to reset your password for your Pochette account.</p>
            <button style="background-color: #2da84f; padding: 15px 32px; text-align: center; display: inline-block; font-size: 16px;" ><a style="color: white; text-decoration: none;" href="http://dev.pochette.info/forgot-password-verification?confirmation_code=${event.request.codeParameter}&user_name=${event.userName}&email=${event.request.userAttributes.email}"> Reset your password </a></button>
        <p>Thanks,</p>
        <p>The Pochette team</p>
        </div>`

    
      let params = {
        TableName: TABLE,
        Key: {
          'rightHolderId': event.request.userAttributes.username
        }
      };
      // Call DynamoDB to delete the item from the table
      ddb.get(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
            if (data.Attributes.requestSource === 'pochette'){
                
                    if (event.triggerSource === "CustomMessage_ForgotPassword") {
                        event.response.emailSubject = "Confirmer ton compte"
                        event.response.emailMessage = CustomMessage_ForgotPassword_FR_Pochette;
                    } 
                
            } else {
                    
                    if (event.triggerSource === "CustomMessage_ForgotPassword") {
                        event.response.emailSubject = "Confirmer ton compte"
                        event.response.emailMessage = CustomMessage_ForgotPassword_FR;
                    } 
                
            }
            
        }
      });
    
    callback(null, event);
};
