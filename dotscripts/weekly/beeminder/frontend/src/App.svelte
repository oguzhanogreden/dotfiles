<script lang="ts">
	let beeminderApiToken: string;
	let user: User = {type: 'anonymous'};
	
	type UserType = 'beeminder' | 'anonymous'
	type User = BeeminderUser | AnonymousUser

	type BeeminderUser = {
		type: 'beeminder';
		username: string,
	} 
	
	type AnonymousUser = {
		type: 'anonymous',
	}

	function getUserDetails() {
		user = {
			'type': 'beeminder',
			'username': 'oguzhanogreden'
		} as BeeminderUser
	}
	
</script>

<main>
	<button on:click={getUserDetails}>Login!</button>
	
	{#if (user.type === 'beeminder')}
		<p>Hi, {user.username}</p>
	{:else}
		<p>Enter your API token!</p>
	{/if}
	
	<p>Hm</p>
	
</main>

<style>

</style>