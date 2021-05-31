import * as React from 'react';
import { useEffect } from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm, scale } from '../utils/typography';

import { setupTwoslashHovers } from 'shiki-twoslash/dist/dom';

interface IPost {
  excerpt: string;
  frontmatter: { title: string; date: string; description: string };
  fields: { slug: string };
  html: string;
}
interface IBlogPostTemplateProps {
  data: {
    markdownRemark: IPost;

    site: {
      siteMetadata: {
        title: string;
      };
    };
  };
  pageContext: {
    previous: IPost;
    next: IPost;
  };
  location: {
    pathname: string;
  };
}

function makeHTMLAdjustments(raw: string): string {
  return raw && raw.replace(
    /<a href='https:\/\/www.typescriptlang/g,
    `<a class='try-code-link' target="_blank" href='https://www.typescriptlang`,
  );
}

const BlogPostTemplate: React.FunctionComponent<IBlogPostTemplateProps> = ({
  data,
  pageContext,
  location,
}) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const { previous, next } = pageContext;

  useEffect(setupTwoslashHovers, []);

  const postHtml = makeHTMLAdjustments(post.html);

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article>
        <header>
          <h1
            style={{
              marginTop: rhythm(1),
              marginBottom: 0,
            }}
          >
            {post.frontmatter.title}
          </h1>
          <p
            style={{
              ...scale(-1 / 5),
              display: `block`,
              marginBottom: rhythm(1),
            }}
          >
            {post.frontmatter.date}
          </p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: postHtml }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <footer>
          <Bio />
        </footer>
      </article>

      <nav>
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
          {console.log({previous})}

            {previous && previous.fields && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {console.log(next)}
            {
              next && next.fields && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;
