all: build-site

build-site:
	npx @11ty/eleventy

serve:
	npx @11ty/eleventy --serve
