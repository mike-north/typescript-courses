import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import githubIcon from '../../content/assets/GitHub-Mark-32px.png';

export interface EditOnGitHubLinkProps {
  chapter: string;
}

const REPO = 'mike-north/ts-fundamentals-v3';

const EditOnGitHubLink: React.FunctionComponent<
  EditOnGitHubLinkProps
> = ({ chapter }): JSX.Element => {
  const url = `https://github.com/${REPO}/edit/main/packages/website/content/blog/${chapter
    .replace('/course', '')
    .substr(1)}index.md`;
  return (
    <a href={url} rel="noopener noreferrer" target="_blank">
      <div className="edit-on-github-link">
        <img src={githubIcon} alt="GitHub" />
        Edit on GitHub
      </div>
    </a>
  );
};
export default EditOnGitHubLink;
