repository_name() {
	echo $(git config --get remote.origin.url | sed -E "s/.+\///g" | sed -E "s/\.git//g")
}

get_image_name() {
	branch=$(git branch --show-current | gsed -E "s/feature\///g") 
	commit=$(git log -n 1 --pretty=format:"%h")
	repository=$(repository_name)
	userName=$(whoami)

	dockerTag="parkbee/$repository:$branch-$commit-$userName-localbuild"
	
	echo $dockerTag
}

build_and_push() {
	dockerTag=$(get_image_name)

	echo "docker build -t $dockerTag ."
	docker build -t $dockerTag . &&
	docker push $dockerTag
}

release_to_env () {
	env="$1"

	repository="$(repository_name)"
	dockerTag="$(get_image_name)"

	kubectx preprod &&
	kubectl get deployment -n $env $repository-$env -o yaml | gsed -E "/^\s+image:/ s#image.*#image: $dockerTag#g" |  kubectl replace -f -
}


