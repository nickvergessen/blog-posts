import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

export default function (eleventyConfig) {
	eleventyConfig.addGlobalData('site', {
		title: 'nickvergessen',
		blog_url: 'https://www.schilljs.com',
	});

	eleventyConfig.addPlugin(syntaxHighlight);

	eleventyConfig.addFilter('relative_url', (url) => (url.startsWith('/') ? url : '/' + url));
	eleventyConfig.addFilter('excerpt', (html) => html.split('<!--more-->')[0]);

	eleventyConfig.setLiquidOptions({ timezoneOffset: 0 });
	eleventyConfig.addPassthroughCopy('assets');
	eleventyConfig.ignores.add('.idea/**');

	return {
		dir: { layouts: '_layouts' },
	};
}
