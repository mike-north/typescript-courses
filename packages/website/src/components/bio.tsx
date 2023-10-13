import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Image, { FixedObject } from 'gatsby-image';

import { rhythm } from '../utils/typography';

interface IPureBioProps {
  author: {
    name: string;
    summary: string;
  };
  social: {
    twitter: string;
    linkedin: string;
  };
  avatar: {
    childImageSharp: {
      fixed: FixedObject;
    };
  };
}

const PureBio: React.FunctionComponent<IPureBioProps> = ({
  author,
  social,
  avatar,
}) => {
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
    >
      <Image
        fixed={avatar.childImageSharp.fixed}
        alt={author.name}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <p
        style={{
          flex: 1,
        }}
      >
        Written by <strong>{author.name}</strong>{' '}
        {author.summary}
        {` `}
        <a
          href={`https://linkedin.com/in/${social.linkedin}`}
        >
          You should connect with him on LinkedIn
        </a>
        &nbsp;or&nbsp;
        <a href={`https://twitter.com/${social.twitter}`}>
          follow him on Twitter
        </a>
      </p>
    </div>
  );
};

const Bio = (): JSX.Element => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(
        absolutePath: { regex: "/profile-pic.jpg/" }
      ) {
        childImageSharp {
          fixed(width: 125, height: 125) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
            linkedin
          }
        }
      }
    }
  `);

  const { author, social } = data.site.siteMetadata;
  return (
    <PureBio
      author={author}
      social={social}
      avatar={data.avatar}
    />
  );
};

export default Bio;
export { PureBio, IPureBioProps };
