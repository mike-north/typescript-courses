import { Link, graphql } from 'gatsby';
import * as React from 'react';
import Bio from '../components/bio';
import CourseLayout from '../components/course-layout';
import SEO from '../components/seo';
import { rhythm } from '../utils/typography';

export interface ICourse {
  id: string;
  title: string;
  disabled: boolean;
  squareImage: string;
  facebookImage: string;
  twitterImage: string;
  femCourseUrl: string;
  femCoursePublished: boolean;
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
            isExercise: boolean;
            order: number;
            description: string;
          };
          fields: { slug: string; course: string };
        };
      }[];
    };
  };
}

function formatOrder(n: number): string {
  if (n < 10) return `0${n}`;
  return `${n}`;
}

const CoursePageTemplate: React.FunctionComponent<
  ICourseTemplateProps
> = ({ pageContext: course, data }): JSX.Element => {
  if (!course) throw new Error('no course');
  const courses = data.site.siteMetadata.courses;
  const posts = data.allMarkdownRemark.edges;
  let urlBanner: JSX.Element | null = null;
  const { femCoursePublished, femCourseUrl } = course;
  console.log({ femCourseUrl });
  if (femCourseUrl) {
    if (femCoursePublished) {
      urlBanner = (
        <p className="fem-course-banner">
          <img className='fem-logo' src="/fem-logo.png" />
          View the Frontend Masters video course for{' '}
          {course.title}{' '}
          <a href={femCourseUrl} target="_blank">
            here
          </a>
        </p>
      );
    } else {
      urlBanner = (
        <p className="fem-course-banner">
          <img className='fem-logo' src="/fem-logo.png" />
          View the Frontend Masters workshop for{' '}
          {course.title}{' '}
          <a href={femCourseUrl} target="_blank">
            here
          </a>
        </p>
      );
    }
  }
  return (
    <CourseLayout courses={courses} padTop={!!urlBanner}>
      <SEO
        title={course.title}
        description={course.summary}
        twitterImage={course.twitterImage}
        facebookImage={course.facebookImage}
      />
      {urlBanner}
      <header>
        <img
          style={{ float: 'right', margin: 8 }}
          width={175}
          src={course.squareImage}
        />
        <h1
          style={{
            marginTop: rhythm(1),
            marginBottom: 0,
          }}
        >
          {course.title}
        </h1>
      </header>
      <section style={{ marginTop: '10px' }}>
        {course.summary}
      </section>
      {posts
        .filter(
          (p) => p.node.frontmatter.course === course.id,
        )
        .sort(
          (a, b) =>
            a.node.frontmatter.order -
            b.node.frontmatter.order,
        )
        .map(({ node }, idx) => {
          const title =
            node.frontmatter.title || node.fields.slug;
          const { isExercise } = node.frontmatter;
          return (
            <article
              className={
                'course-article' +
                (isExercise ? ' exercise' : '')
              }
              key={node.fields.slug}
            >
              <header>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  <Link
                    style={{ boxShadow: `none` }}
                    to={node.fields.slug}
                  >
                    <span className="course-article__order">
                      {formatOrder(idx + 1)}
                    </span>
                    <span className="course-article__title">
                      {title}
                    </span>
                  </Link>
                </h3>
                <small className="course-article__date">
                  {node.frontmatter.date}
                </small>
              </header>
              <section>
                <p
                  className="course-article__description"
                  dangerouslySetInnerHTML={{
                    __html:
                      node.frontmatter.description ||
                      node.excerpt,
                  }}
                />
              </section>
            </article>
          );
        })}

      <footer>
        <Bio />
      </footer>
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
          squareImage
          facebookImage
          twitterImage
          femCourseUrl
          femCoursePublished
          disabled
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: ASC }
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
            order
            isExercise
            course
            description
          }
        }
      }
    }
  }
`;
