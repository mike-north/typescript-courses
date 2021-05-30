const fs = require(`fs`);
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const yaml = require('js-yaml');
const PACKAGE_JSON_PATH = require('pkg-up').sync();

const PROJECT_ROOT_PATH = path.join(PACKAGE_JSON_PATH, '..');

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type SiteSiteMetadataCourses implements Node {
      id: String
      title: String
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
  ymlDoc.forEach((element) => {
    console.log(`Creating page: ${element.id}`);
    createPage({
      path: `/course/${element.id}`,
      component: require.resolve('./src/templates/course-page.tsx'),
      context: {
        title: element.title,
        id: element.id,
        summary: element.summary,
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

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        course: post.node.fields.course,
        contentPath: post.node.fields.contentPath,
        previous,
        next,
      },
    });
  });
};

/**
 * 
 * @type {import('gatsby').GatsbyNode<any, any>['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode }) => {
  console.log(`Node created of type "${node.internal.type}"`);

  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const contentPath = createFilePath({ node, getNode }).substr(1)
    const value = `/course/${contentPath}`;
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
