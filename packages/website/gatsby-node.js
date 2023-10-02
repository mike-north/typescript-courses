const fs = require(`fs`);
const path = require(`path`);
const { groupBy, sortBy } = require(`lodash`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const yaml = require('js-yaml');
const PACKAGE_JSON_PATH = require('pkg-up').sync();

const PROJECT_ROOT_PATH = path.join(PACKAGE_JSON_PATH, '..');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type SiteSiteMetadataCourses implements Node {
      id: String
      name: String
      squareImage: String
      facebookImage: String
      twitterImage: String
      femCourseUrl: String
      femCoursePublished: String
      femWorkshopUrl: String
      femWorkshopPublished: String
      visibleInCoursePage: Boolean
      visibleInCourseIndex: Boolean
      visibleInTopNav: Boolean
      summary: String
    }
  `;
  createTypes(typeDefs);
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const ymlDoc = yaml.load(
    fs.readFileSync(
      path.join(PROJECT_ROOT_PATH, 'content', 'courses.yml'),
      'utf-8',
    ),
  );
  const { courses } = ymlDoc;
  courses.forEach((element) => {
    console.log(`Creating page: ${element.id}`);
    createPage({
      path: `/course/${element.id}`,
      component: require.resolve('./src/templates/course-page.tsx'),
      context: {
        name: element.name,
        id: element.id,
        visibleInCourseIndex: element.visibleInCourseIndex,
        visibleInTopNav: element.visibleInTopNav,
        visibleInCoursePage: element.visibleInCoursePage,
        summary: element.summary,
        squareImage: element.squareImage,
        facebookImage: element.facebookImage,
        twitterImage: element.twitterImage,
        femCourseUrl: element.femCourseUrl,
        femCoursePublished: element.femCoursePublished,
        femWorkshopUrl: element.femWorkshopUrl,
        femWorkshopPublished: element.femWorkshopPublished,
      },
    });
  });

  const blogPost = path.resolve(`./src/templates/blog-post.tsx`);
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___order], order: ASC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                order
                course
                isExercise
              }
            }
          }
        }
      }
    `,
  );

  if (result.errors) {
    throw result.errors;
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges;

  const sorted_posts = groupBy(
    sortBy(posts.map((post) => ({
      path: post.node.fields.slug,
      component: blogPost,
      node: post.node,
      context: {
        slug: post.node.fields.slug,
        title: post.node.frontmatter.title,
        course: post.node.frontmatter.course,
        order: post.node.frontmatter.order,
      },
    })
  ), ['context.course', 'context.order']),
    'context.course',
  )

  Object.keys(sorted_posts).forEach(courseName => {
    const courseArticles = sorted_posts[courseName];
    courseArticles.forEach((postData, index) => {
      const next = index === courseArticles.length - 1 ? null : courseArticles[index + 1].node;
      const previous = index === 0 ? null : courseArticles[index - 1].node;
      const pageArg = {
        ...postData,
        context: {
          ...postData.context,
          previous: previous,
          next: next,
        },
      }
      createPage(pageArg);
    });
  })
};

/**
 *
 * @type {import('gatsby').GatsbyNode<any, any>['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode }) => {

  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const contentPath = createFilePath({ node, getNode }).substr(1);
    const value = `/course/${contentPath}`;
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
