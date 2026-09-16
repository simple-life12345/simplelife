# Simple Life — Website v7

This version makes both forms real when deployed on Netlify.

- Customer requests submit on-site, are stored in Netlify Forms, and can trigger an automatic Twilio SMS.
- Helper applications submit on-site and are stored in Netlify Forms.

## Netlify
Keep the code in GitHub, but connect the repository to Netlify and deploy it there. Enable Form detection if needed.

## Twilio environment variables
Add these privately in Netlify:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_FROM_NUMBER
- REQUEST_TO_NUMBER

Do not put these values directly in public GitHub code. Redeploy after adding them.
