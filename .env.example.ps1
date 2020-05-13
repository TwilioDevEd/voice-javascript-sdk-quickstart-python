$Env:TWILIO_ACCOUNT_SID = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
$Env:TWILIO_TWIML_APP_SID = "APXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
$Env:TWILIO_CALLER_ID = "+1XXXYYYZZZZ"
$Env:API_KEY = "SKXXXXXXXXXXXX"
$Env:API_SECRET = "XXXXXXXXXXXXXX"

# Uncomment the following if you'd like the environment variables
# to be permanently set on your user account for this machine.

<#

[Environment]::SetEnvironmentVariable("TWILIO_ACCOUNT_SID", $Env:TWILIO_ACCOUNT_SID, "User")
[Environment]::SetEnvironmentVariable("TWILIO_TWIML_APP_SID", $Env:TWILIO_TWIML_APP_SID, "User")
[Environment]::SetEnvironmentVariable("TWILIO_CALLER_ID", $Env:TWILIO_CALLER_ID, "User")
[Environment]::SetEnvironmentVariable("API_KEY", $Env:API_KEY, "User")
[Environment]::SetEnvironmentVariable("API_SECRET", $Env:API_SECRET, "User")

#>