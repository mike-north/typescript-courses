import * as React from 'react';
import { Link } from 'gatsby';
import { ICourse } from '../templates/course-page';

import { rhythm } from '../utils/typography';

interface ICourseLayoutProps {
  courses: ICourse[];
}

const CourseLayout: React.FunctionComponent<ICourseLayoutProps> = ({
  courses,
  children,
}) => {
  const header = (
    <ul className="course-tabs">
      {courses.map((c) => (
        <li key={c.id} className="course-tab">
          <Link
            activeClassName="active"
            style={{
              boxShadow: `none`,
              color: `inherit`,
            }}
            to={`/course/${c.id}`}
          >
            {c.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer>© {new Date().getFullYear()}</footer>
    </div>
  );
};

export default CourseLayout;
