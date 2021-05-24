module.exports = {
  pathPrefix: '/ts-fundamentals-v3',
  siteMetadata: {
    title: `TypeScript Fundamentals v3`,
    author: {
      name: `Mike North`,
      summary: `Senior Staff Engineer @ LinkedIn`,
    },
    description: `A starter blog demonstrating gatsby-remark-shiki-twoslash.`,
    siteUrl: `https://gatsby-starter-blog-demo.netlify.com/`,
    social: {
      twitter: `MichaelLNorth`,
    },
    courses: [
      {
        id: 'typescript-fundamentals-v3',
        title: 'TypeScript Fundamentals v3',
        summary: `By adding static types to the JavaScript programming language, TypeScript delivers a rich and productive code authoring and review experience, while catching entire categories of bugs at compile time instead of runtime. In this workshop, you'll learn everything you need to know in order to confidently and successfully use TypeScript to build a modern JavaScript app.`,
      },
      {
        id: 'intermediate-typescript',
        title: 'Intermediate TypeScript',
        summary: ` It's relatively easy to get started with TypeScript, but the learning curve becomes much steeper once things become more complex and abstract. This workshop teaches you how to leverage TypeScript's strengths to provide clarity in the face of complexity, while protecting your codebase and team from it's weaknesses.`,
      },
    ],
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
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
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
              theme: 'min-light',
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     //trackingId: `ADD YOUR TRACKING ID HERE`,
    //   },
    // },
    `gatsby-plugin-feed`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `content/assets/gatsby-icon.png`,
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
