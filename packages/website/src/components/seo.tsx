/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

interface ISEOProps {
  description?: string;
  lang?: string;
  meta?: { name: string; content: string }[];
  title: string;
  facebookImage?: string;
  twitterImage?: string;
}

const SEO: React.FunctionComponent<ISEOProps> = ({
  description,
  lang = 'en',
  meta = [],
  title,
  facebookImage,
  twitterImage,
}) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          social {
            twitter
          }
        }
      }
    }
  `);

  const metaDescription =
    description || site.siteMetadata.description;

  const imageTags: React.DetailedHTMLProps<
    React.MetaHTMLAttributes<HTMLMetaElement>,
    HTMLMetaElement
  >[] = [];
  if (facebookImage)
    imageTags.push({
      property: `og:image`,
      content: facebookImage,
    });
  if (twitterImage)
    imageTags.push({
      property: `twitter:image`,
      content: twitterImage,
    });

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.social.twitter,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        ...imageTags,
      ].concat(meta)}
    />
  );
};

export default SEO;
