# ParkBee Developer Scripts

Use at your own risk, I'm not a bash hacker.

Be very careful when using these in production environments.
Try never doign that.

## Port Forwarding

```
// in a terminal tab, start port forwarding
~/.dotscripts/parkbee/port-forwarding.sh &
```

I choose to have a dedicated terminal tab for this, so that I can keep reading standard output.

Later you can kill the process in the same tab by running:

```
kill -TERM -- -$!
```

## Environment variables

Kubernetes port-forwarding can be run in a terminal and you can profit in whereever in your system: Postman, curl, locally running software.

When you run your local service instance, though, you need to make sure the environment variables are set.
I do this by running e.g. Rider from zsh, using Jetbrains Toolbox:

```
.  ~/.dotscripts/parkbee/net-env-test.sh &&
open -na ~/Applications/JetBrains\ Toolbox/Rider.app
```

I initially thought I'd add a bash script per environment, but I found it much easier to modify port-forwarding using vim, sed, etc.
