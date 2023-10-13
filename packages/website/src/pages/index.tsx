import * as React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm } from '../utils/typography';
import {
  ICourse,
  ICourseGroup,
} from '../templates/course-page';

type IAbbrevCourse = Pick<
  ICourse,
  | 'id'
  | 'name'
  | 'squareImage'
  | 'summary'
  | 'visibleInCourseIndex'
>;
type IAbbrevCourseGroup = Pick<
  ICourseGroup,
  | 'id'
  | 'name'
  | 'courseIndexOrder'
  | 'courses'
  | 'currentCourse'
>;
interface IBlogIndexProps {
  data: {
    allMarkdownRemark: {
      edges: {
        node: {
          excerpt: string;
          frontmatter: {
            title: string;
            date: string;
            description: string;
          };
          fields: { slug: string };
        };
      }[];
    };
    site: {
      siteMetadata: {
        title: string;
        courseGroups: IAbbrevCourseGroup[];
        courses: IAbbrevCourse[];
      };
    };
  };
  location: {
    pathname: string;
  };
}

const BlogIndex: React.FunctionComponent<
  IBlogIndexProps
> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;
  const { courseGroups, courses } = data.site.siteMetadata;
  const courseGroupMap: {
    [key: string]: {
      courses: IAbbrevCourse[];
      current: IAbbrevCourse | null;
    };
  } = {};
  const courseMap: Record<string, IAbbrevCourse> = {};
  courses
    .filter((c) => c.visibleInCourseIndex)
    .forEach((c) => {
      courseMap[c.id] = c;
    });
  courseGroups.forEach((cg) => {
    courseGroupMap[cg.id] = {
      current: courseMap[cg.currentCourse]
        ? courseMap[cg.currentCourse]
        : null,
      courses: cg.courses.map((c) => courseMap[c]),
    };
  });
  // const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Courses" />
      <Bio />
      {courseGroups
        .filter(
          (c) => courseGroupMap[c.id].courses.length > 0,
        )
        .sort(
          (a, b) => a.courseIndexOrder - b.courseIndexOrder,
        )
        .map(({ id }) => {
          const { current } = courseGroupMap[id];
          if (!current) return null;
          return (
            <article className="course-summary" key={id}>
              <header>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  <img
                    style={{ float: 'right' }}
                    width={150}
                    src={current.squareImage}
                  />
                  <Link
                    style={{ boxShadow: `none` }}
                    to={`course/${current.id}`}
                  >
                    {current.name}
                  </Link>
                </h3>
              </header>
              <section>
                <p>{current.summary}</p>
              </section>
            </article>
          );
        })}
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        courseGroups {
          id
          name
          courses
          currentCourse
          courseIndexOrder
        }
        courses {
          id
          name
          summary
          squareImage
          facebookImage
          twitterImage
          femCourseUrl
          femCoursePublished
          visibleInCourseIndex
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___order], order: ASC }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            order
          }
        }
      }
    }
  }
`;
