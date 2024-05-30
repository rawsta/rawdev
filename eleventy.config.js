/**
 *  Most adjustments must be made in:
 *  - `./config/collections/index.js`
 *  - `./config/filters/index.js`
 *  - `./config/plugins/index.js`
 *  - `./config/shortcodes/index.js`
 *  - `./config/transforms/index.js`
 */

// Register dotenv for process.env.* variables to pickup
require( 'dotenv' ).config()

/**
 * Hint VS Code for eleventyConfig autocompletion.
 * @link: https://gist.github.com/xdesro/69583b25d281d055cd12b144381123bf
 *
 *  @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 */

// module import filters
const {
  toISOString,
  formatDate,
  toAbsoluteUrl,
  stripHtml,
  minifyCss,
  minifyJs,
  splitlines,
  shuffleArray
} = require( './config/filters/index.js' );

// module import shortcodes
const {
  imageShortcode,
  includeRaw,
  liteYoutube
} = require( './config/shortcodes/index.js' );

// module import collections
const {
  getAllPosts,
  onlyMarkdown,
  tagList
} = require( './config/collections/index.js' );

// module import events
const {svgToJpeg} = require( './config/events/index.js' );


// Plugins
const {EleventyRenderPlugin} = require( '@11ty/eleventy' );
const pluginRss = require( '@11ty/eleventy-plugin-rss' );
const inclusiveLangPlugin = require( '@11ty/eleventy-plugin-inclusive-language' );
const bundlerPlugin = require( '@11ty/eleventy-plugin-bundle' );
const syntaxHighlight = require( '@11ty/eleventy-plugin-syntaxhighlight' );
const pluginTOC  = require( 'eleventy-plugin-toc');

const markdownLib = require( './config/plugins/markdown.js' );
const {slugifyString} = require( './config/utils/index.js' );
const yaml = require( 'js-yaml' );


module.exports = eleventyConfig => {
  // 	--- [ CUSTOM WATCH TARGETS ] ---
  eleventyConfig.addWatchTarget( './src/assets' );
  eleventyConfig.addWatchTarget( './utils/*.js' );


  // --- [ LAYOUT ALIASES ] ---
  eleventyConfig.addLayoutAlias( 'base', 'base.njk' );
  eleventyConfig.addLayoutAlias( 'home', 'home.njk' );
  eleventyConfig.addLayoutAlias( 'page', 'page.njk' );
  eleventyConfig.addLayoutAlias( 'blog', 'blog.njk' );
  eleventyConfig.addLayoutAlias( 'post', 'post.njk' );
  eleventyConfig.addLayoutAlias( 'tags', 'tags.njk' );


  // 	--- [  CUSTOM FILTERS ] ---
  eleventyConfig.addFilter( 'toIsoString', toISOString );
  eleventyConfig.addFilter( 'formatDate', formatDate );
  eleventyConfig.addFilter( 'toAbsoluteUrl', toAbsoluteUrl );
  eleventyConfig.addFilter( 'stripHtml', stripHtml );
  eleventyConfig.addFilter( 'slugify', slugifyString );
  eleventyConfig.addFilter( 'splitlines', splitlines );
  eleventyConfig.addFilter( 'shuffle', shuffleArray );

  eleventyConfig.addFilter( 'cssmin', minifyCss );
  eleventyConfig.addNunjucksAsyncFilter( 'jsmin', minifyJs );

  eleventyConfig.addFilter( 'toJson', JSON.stringify );
  eleventyConfig.addFilter( 'fromJson', JSON.parse );

  eleventyConfig.addFilter( 'keys', Object.keys );
  eleventyConfig.addFilter( 'values', Object.values );
  eleventyConfig.addFilter( 'entries', Object.entries );


  // 	--- [ CUSTOM SHORTCODES ] ---
  eleventyConfig.addNunjucksAsyncShortcode( 'eleventyImage', imageShortcode );
  eleventyConfig.addShortcode( 'youtube', liteYoutube );
  eleventyConfig.addShortcode( 'include_raw', includeRaw );
  eleventyConfig.addShortcode( 'year', () => `${new Date().getFullYear()}` );


  // 	--- [ CUSTOM TRANSFORMS ] ---
  eleventyConfig.addPlugin(require( './config/transforms/html-config.js' ) );


  // 	--- [ CUSTOM TEMPLATE LANGUAGES ] ---
  eleventyConfig.addPlugin(require( './config/template-languages/css-config.js' ) );
  eleventyConfig.addPlugin(require( './config/template-languages/js-config.js' ) );


  // 	--- [ CUSTOM COLLECTIONS ] ---
  eleventyConfig.addCollection( 'posts', getAllPosts );
  eleventyConfig.addCollection( 'onlyMarkdown', onlyMarkdown );
  eleventyConfig.addCollection( 'tagList', tagList );


  // 	--- [ EVENTS ] ---
  if ( process.env.ELEVENTY_RUN_MODE === 'serve' ) {
    // this only runs in development, on your machine, so og images get installed fonts.
    eleventyConfig.on( 'eleventy.after', svgToJpeg );
  }


  // 	--- [ PLUGINS ] ---
  eleventyConfig.addPlugin( EleventyRenderPlugin );
  //eleventyConfig.addPlugin( syntaxHighlight );
  eleventyConfig.addPlugin( syntaxHighlight, {
    alwaysWrapLineHighlights: true,
  });
  eleventyConfig.addPlugin( pluginRss );
  eleventyConfig.addPlugin( pluginTOC );
  eleventyConfig.addPlugin( inclusiveLangPlugin );
  eleventyConfig.addPlugin( bundlerPlugin );
  eleventyConfig.setLibrary( 'md', markdownLib );

  // Add support for YAML data files with .yaml extension
  eleventyConfig.addDataExtension( 'yaml', contents => yaml.load( contents ) );


  // 	--- [ PASSTHROUGH FILE COPY ] ---
  // same path
  ['src/assets/fonts/', 'src/assets/images/template', 'src/assets/og-images'].forEach(
    path => eleventyConfig.addPassthroughCopy( path )
  );

  // to root
  eleventyConfig.addPassthroughCopy( {
    'src/assets/images/favicon/*': '/'
  });


  // 	--- [ GENERAL CONFIG ] ---
  return {
    // Pre-process *.md, *.html and global data files with Nunjucks
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',

    // If the site deploys to a subdirectory, change `pathPrefix`, for example with with GitHub pages
    pathPrefix: '/',

    dir: {
      output: 'dist',
      input: 'src',
      includes: '_includes',
      layouts: '_layouts'
    }
  };
};
