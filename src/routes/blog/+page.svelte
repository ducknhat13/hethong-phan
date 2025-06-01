<!-- This file renders the main blog index page -->
<script>
	import PostsList from '$lib/components/PostsList.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import { siteDescription } from '$lib/config'

	let { data } = $props();
	const { posts, total } = data
</script>

<svelte:head>
	<title>Blog</title>
	<meta data-key="description" name="description" content={siteDescription} />
</svelte:head>

<div class="compressed-content">
	<h1>Blog</h1>

	{#if posts && posts.length}
		<PostsList {posts} />
		<Pagination currentPage={1} totalPosts={total} />
	{:else}
		<p>Chưa có bài viết nào.</p>
	{/if}
</div>

<style>
	.compressed-content {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
</style>