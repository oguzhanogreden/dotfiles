# Pipelines

This folder contains bash scripts related to build and release pipelines of ParkBee.

## Preprod Quick Release

(Thanks to @LozanoMatheus for his help with shell scripting!)

### Context

When working on a feature branch, getting the code to a preprod environment takes too long.

This is because of a few suboptimal things in our build pipelines:

1. Docker build layers are not cached:
	- Pipeline spends time fetching base Docker images
1. “Non-essential [in preprod context] tasks”:
	- When working on a feature, Helm charts rarely change
1.  Build pipelines run tests for feature branches 
	- If you’re doing TDD, this is unnecessary
1. Comforts of Azure DevOps are not necessary in preprod

### Solution

We can use a few shell scripts to:
- build and push the Docker image locally (using cached layers)
- edit Kubernetes deployment to release the image to a preprod environment

#### Dependencies

- GNU sed, this is different than the sed version that’s shipped with macOS. So please install GNU sed.
- Set up ParkBee development machine (git, kubectx, kubectl)

### Usage

The scripts below can be used in the following workflow.

Do your work, this may look roughly like this:

```
cd ~/owner-portal-api
gcb feature/FEATURE-123
# stage your changes
gcmsg "A useful feature."
```

Then run the commands:

```
build_and_push && release_to_env test2
```

If everything goes well, your standard output should look roughly like:

```
# ...
FETURE-123-4af289e-oguzhanogreden-localbuild: digest: sha256:2ddb76376ae9a7ccd683e0d35f409175f67eeebdd843a0ac3d31bf00473541a0 size: 1787
Switched to context "preprod".
deployment.apps/owner-portal-api-uat replaced
```

This indicates the release was successful. Kubernetes will now check the health of your new pods, and start directing traffic based on the usual rules.

### Next steps

- Create a commit hook that can repeat this in the background after each commit
