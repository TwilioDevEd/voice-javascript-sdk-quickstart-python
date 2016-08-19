$Env:TWILIO_ACCOUNT_SID = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
$Env:TWILIO_AUTH_TOKEN = "your_auth_token"
$Env:TWILIO_TWIML_APP_SID = "APXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
$Env:TWILIO_CALLER_ID = "+1XXXYYYZZZZ"

# Uncomment the following if you'd like the environment variables
# to be permanently set on your user account for this machine.

<#

[Environment]::SetEnvironmentVariable("TWILIO_ACCOUNT_SID", $Env:TWILIO_ACCOUNT_SID, "User")
[Environment]::SetEnvironmentVariable("TWILIO_AUTH_TOKEN", $Env:TWILIO_AUTH_TOKEN, "User")
[Environment]::SetEnvironmentVariable("TWILIO_TWIML_APP_SID", $Env:TWILIO_TWIML_APP_SID, "User")
[Environment]::SetEnvironmentVariable("TWILIO_CALLER_ID", $Env:TWILIO_CALLER_ID, "User")

#>