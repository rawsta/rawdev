export const url = process.env.URL || 'http://localhost:8080';
export const siteName = 'Rawsta.de';
export const siteDescription = 'Playground built with Eleventy and a lot of messing around';
export const siteType = 'Person'; // schema
export const locale = 'de_DE';
export const lang = 'de';
export const skipContent = 'Zum Inhalt springen';
export const author = {
  name: 'Sebastian Fiele', // blog author's name. Must be set.
  avatar: '/icon-512x512.png', // path to the author's avatar. In this case just using a favicon.
  email: 'rawsta@rawsta.de', // email of the author
  website: 'https://www.rawsta.de', // the personal site of the author
  social: 'https://social.pizza.linux/@rawsta'
};
export const creator = {
  name: 'Lene Saile', // creator's (developer) name.
  email: 'hola@lenesaile.com',
  website: 'https://www.lenesaile.com',
  social: 'https://front-end.social/@lene'
};
export const pathToSvgLogo = 'src/assets/svg/misc/logo.svg'; // used for favicon generation
export const themeColor = '#FF8300'; //  Manifest: defines the default theme color for the application
export const themeBgColor = '#FBFBFB'; // Manifest: defines a placeholder background color for the application page to display before its stylesheet is loaded
export const opengraph_default = '/assets/images/template/opengraph-default.jpg'; // fallback/default meta image
export const opengraph_default_alt =
  "An Eleventy website with CUBE CSS, Cube CSS, Every Layout, Design Tokens and Tailwind for utility classes. Mostly a playground for rawsta."; // alt text for default meta image"
export const blog = {
  // RSS feed
  name: 'My WebDev Blog',
  description: 'Some of my ramblings about stuff and sometimes an article or two. Mostly in german.',
  // feed links are looped over in the head. You may add more to the array.
  feedLinks: [
    {
      title: 'Atom Feed',
      url: '/feed.xml',
      type: 'application/atom+xml'
    },
    {
      title: 'JSON Feed',
      url: '/feed.json',
      type: 'application/json'
    }
  ],
  // Tags
  tagSingle: 'Tag',
  tagPlural: 'Tags',
  tagMore: 'Mehr Tags:',
  // pagination
  paginationLabel: 'Blog',
  paginationPage: 'Seite',
  paginationPrevious: 'Vorherige',
  paginationNext: 'Nächste',
  paginationNumbers: true
};
export const details = {
  aria: 'section controls',
  expand: 'Alle aufklappen',
  collapse: 'Alle zuklappen'
};
export const navigation = {
  navLabel: 'Menu',
  ariaTop: 'Main',
  ariaBottom: 'Complementary',
  ariaPlatforms: 'Platforms',
  drawerNav: false
};
export const themeSwitch = {
  title: 'Theme',
  light: 'light',
  dark: 'dark'
};
export const greenweb = {
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
};
export const viewRepo = {
  // this is for the view/edit on github link. The value in the package.json will be pulled in.
  allow: true,
  infoText: 'Code auf GitHub ansehen.'
};
export const easteregg = true;
