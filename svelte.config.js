import adapter from "@sveltejs/adapter-static";
import { mdsvex } from "mdsvex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: [".svelte", ".md"],

	kit: {
		adapter: adapter({
			fallback: "200.html"
		}),
		prerender: {
			entries: [
				"/",
				"/blog",
				"/blog/category",
				"/api/posts.json",
				"/api/rss.xml",
				"/api/posts/count",
				"/api/posts/page/1",
				"/blog/category/page/[page]",
				"/blog/category/[category]/page",
				"/blog/category/[category]/page/[page]",
				"/blog/page",
				"/blog/page/[page]"
			]
		}
	},

	preprocess: [
		mdsvex({
			extensions: [".md"],
			rehypePlugins: [
				rehypeSlug,
				rehypeAutolinkHeadings,
			],
		}),
	],
};

export default config; 