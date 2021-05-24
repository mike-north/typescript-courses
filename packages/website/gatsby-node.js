const fs = require(`fs`);
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const yaml = require('js-yaml');
const PACKAGE_JSON_PATH = require('pkg-up').sync();

const PROJECT_ROOT_PATH = path.join(PACKAGE_JSON_PATH, '..');

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
        name: element.name,
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
          sort: { fields: [frontmatter___date], order: DESC }
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
        previous,
        next,
      },
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  console.log(`Node created of type "${node.internal.type}"`);

  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
