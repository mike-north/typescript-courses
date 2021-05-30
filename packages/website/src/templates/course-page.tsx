import { Link, graphql } from 'gatsby';
import * as React from 'react';
import Bio from '../components/bio';
import CourseLayout from '../components/course-layout';
import SEO from '../components/seo';
import { rhythm } from '../utils/typography';

export interface ICourse {
  id: string;
  title: string;
  summary: string;
}

interface ICourseTemplateProps {
  pageContext: ICourse;
  data: {
    site: {
      siteMetadata: {
        title: string;
        courses: ICourse[];
      };
    };
    allMarkdownRemark: {
      edges: {
        node: {
          excerpt: string;
          frontmatter: {
            title: string;
            course: string;
            date: string;
            order: number;
            description: string;
          };
          fields: { slug: string; course: string; };
        };
      }[];
    };
  };
}

const CoursePageTemplate: React.FunctionComponent<ICourseTemplateProps> = ({
  pageContext: course,
  data,
}): JSX.Element => {
  if (!course) throw new Error('no course');
  const courses = data.site.siteMetadata.courses;
  const posts = data.allMarkdownRemark.edges;
  return (
    <CourseLayout courses={courses}>
      <SEO title={course.title} description={course.summary} />
      <article>
        <header>
          <h1
            style={{
              marginTop: rhythm(1),
              marginBottom: 0,
            }}
          >
            {course.title}
          </h1>
        </header>
        <section style={{ marginTop: '10px' }}>{course.summary}</section>
        {posts
          .filter((p) => p.node.frontmatter.course === course.id)
          .sort((a, b) => a.node.frontmatter.order - b.node.frontmatter.order)
          .map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug;
            return (
              <article key={node.fields.slug}>
                <header>
                  <h3
                    style={{
                      marginBottom: rhythm(1 / 4),
                    }}
                  >
                    <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                      {title}
                    </Link>
                  </h3>
                  <small>{node.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: node.frontmatter.description || node.excerpt,
                    }}
                  />
                </section>
              </article>
            );
          })}

        <footer>
          <Bio />
        </footer>
      </article>
    </CourseLayout>
  );
};

export default CoursePageTemplate;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        courses {
          id
          title
          summary
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: ASC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            order
            course
            description
          }
        }
      }
    }
  }
`;
