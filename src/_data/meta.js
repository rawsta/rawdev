module.exports = {
  url: process.env.URL || 'http://localhost:8080',
  siteName: 'Rawsta ',
  siteDescription:
    'Ein weiteres Projekt, um mit etwas neuem zu spielen.',
  siteType: 'Person', // schema
  locale: 'de_DE',
  lang: 'de',
  skipContent: 'Zum Inhalt springen',
  author: {
    name: 'Sebastian Fiele',
    avatar: '/favicon.png',
    email: 'rawsta@rawsta.de',
    website: 'https://www.rawsta.de'
  },
  creator: {
    name: 'Sebastian Fiele',
    email: 'rawsta@rawsta.de',
    website: 'https://www.rawsta.de',
    social: '@rawsta@social.linux.pizza',
    codepen: 'rawsta',
    github: 'rawsta'
  },
  themeColor: '#FF8300', //  Manifest: defines the default theme color for the application
  themeBgColor: '#FBFBFB', // Manifest: defines a placeholder background color for the application page to display before its stylesheet is loaded
  opengraph_default: '/assets/images/template/opengraph-default.jpg', // fallback/default meta image
  opengraph_default_alt:
    'Visible content: Eleventy starter built around the CSS workflow for Cube CSS, Every Layout, Design Tokens and Tailwind for uitility, based on the concepts explained in buildexcellentwebsit.es', // alt text for default meta image
  blog: {
    // RSS feed
    name: 'Kind of raw blog',
    description:
      'Verschiedene Artikel zu Themen, die mich interessieren.',
    // feed links are looped over in the head. You may add more to the array.
    feedLinks: [
      {
        title: 'Atomarer Feed',
        url: '/feed.xml',
        type: 'application/atom+xml'
      }
    ],
    // Tags
    tagSingle: 'Tag',
    tagPlural: 'Tags',
    tagMore: 'Mehr Tags:',
    // pagination
    paginationLabel: 'Blog',
    paginationPage: 'Seite',
    paginationPrevious: 'Vorher',
    paginationNext: 'Nachher',
    paginationNumbers: true
  },
  details: {
    aria: 'section controls',
    expand: 'alle aufklappen',
    collapse: 'alle zuklappen'
  },
  navigation: {
    ariaTop: 'Main',
    ariaBottom: 'Complementary',
    ariaPlatforms: 'Platforms',
    // activate alternative mobile menu with drawer
    drawerNav: true,
    navLabel: 'Menu'
  },
  themeSwitch: {
    title: 'Theme',
    light: 'light',
    dark: 'dark',
    initial: 'select'
  },
  greenweb: {
    // this goes into src/common/greenweb.njk
    providers: {
      // if you want to add more than one, edit the array directly.
      domain: 'netlify.com',
      service: 'cdn'
    },
    credentials: {
      // optional, eg: 	{ domain='my-org.com', doctype = 'webpage', url = 'https://my-org.com/our-climate-record'}
      domain: '',
      doctype: '',
      url: ''
    }
  },
  viewRepo: {
    allow: true,
    infoText: 'Code auf GitHub'
  },
  easteregg: true
};
