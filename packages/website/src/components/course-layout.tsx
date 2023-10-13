import * as React from 'react';
import { Link } from 'gatsby';
import {
  ICourse,
  ICourseGroup,
} from '../templates/course-page';

import { rhythm } from '../utils/typography';

interface ICourseLayoutProps {
  courses: ICourse[];
  courseGroups: ICourseGroup[];
  padTop: boolean;
  children?: React.ReactNode;
}

const CourseLayout: React.FunctionComponent<
  ICourseLayoutProps
> = ({ courses, children, padTop }) => {
  const header = (
    <ul
      className={
        padTop ? 'course-tabs pad-top' : 'course-tabs'
      }
    >
      {courses
        .filter((c) => c.visibleInTopNav)
        .map((c) => (
          <li key={c.id} className="course-tab">
            <Link
              activeClassName="active"
              style={{
                boxShadow: `none`,
                color: `inherit`,
              }}
              to={`/course/${c.id}`}
            >
              {c.name}
            </Link>
          </li>
        ))}
    </ul>
  );

  return (
    <div
      className="course-page"
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(30),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()} All Rights Reserved.
      </footer>
    </div>
  );
};

export default CourseLayout;
