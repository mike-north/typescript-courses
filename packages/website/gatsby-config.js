const fs = require(`fs`);
const path = require(`path`);

const PACKAGE_JSON_PATH = require('pkg-up').sync();
const PROJECT_ROOT_PATH = path.join(
  PACKAGE_JSON_PATH,
  '..',
);

const yaml = require('js-yaml');

const { courses, course_groups: courseGroups } = yaml.load(
  fs.readFileSync(
    path.join(PROJECT_ROOT_PATH, 'content', 'courses.yml'),
    'utf-8',
  ),
);

module.exports = {
  siteMetadata: {
    title: `Learn TypeScript w/ Mike North`,
    author: {
      name: `Mike North`,
      summary: `, Developer Platform Lead at Stripe, and Frontend Masters Instructor.`,
    },
    description: `Learn TypeScript with Mike North`,
    siteUrl: `https://www.typescript-training.com/`,
    social: {
      twitter: `MichaelLNorth`,
      linkedin: 'northm',
    },
    courses,
    courseGroups
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-autolink-headers`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1000,
            },
          },
          {
            resolve: 'gatsby-remark-custom-blocks',
            options: {
              blocks: {
                danger: {
                  classes: 'danger',
                  title: 'required',
                },
                info: {
                  classes: 'info',
                  title: 'optional',
                },
                warning: {
                  classes: 'warning',
                  title: 'optional',
                },
                question: {
                  classes: 'question',
                  title: 'optional',
                },
                vspace: {
                  classes: 'vspace',
                  title: 'optional',
                }
              },
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: 'gatsby-remark-shiki-twoslash',
            options: {
              theme: 'github-light',
              addTryButton: true
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          {
            resolve: 'gatsby-remark-emojis',
            options: {
              // Deactivate the plugin globally (default: true)
              active: true,
              // Add a custom css class
              class: 'emoji-icon',
              // In order to avoid pattern mismatch you can specify
              // an escape character which will be prepended to the
              // actual pattern (e.g. `#:poop:`).
              // escapeCharacter: '#', // (default: '')
              // Select the size (available size: 16, 24, 32, 64)
              size: 64,
              // Add custom styles
              styles: {
                display: 'inline',
                margin: '0',
                'margin-top': '1px',
                position: 'relative',
                top: '5px',
                width: '25px',
              },
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-PW24ZG5",

        // Include GTM in development.
        //
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,

        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        //
        // Defaults to null
        defaultDataLayer: { platform: "gatsby" },

        // // Specify optional GTM environment details.
        // gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
        // gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
        // dataLayerName: "YOUR_DATA_LAYER_NAME",

        // Name of the event that is triggered
        // on every Gatsby route change.
        //
        // Defaults to gatsby-route-change
        // routeChangeEventName: "YOUR_ROUTE_CHANGE_EVENT_NAME",
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ['G-NPMJTDV8W2'],
      },
    },
    `gatsby-plugin-feed`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `TypeScript Training: Learn TypeScript with Mike North!`,
        short_name: `TS Training`,
        start_url: `/`,
        // background_color: `#ffffff`,
        theme_color: `#3178C6`,
        display: `minimal-ui`,
        icon: `content/assets/ts-logo-512.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
