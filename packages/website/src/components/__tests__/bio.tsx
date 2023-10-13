import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { PureBio } from '../bio';

describe('Bio', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <PureBio
          author={{
            name: 'Mike',
            summary: 'A teacher',
          }}
          social={{
            twitter: 'MichaelLNorth',
            linkedin: 'northm',
          }}
          avatar={{
            childImageSharp: {
              fixed: {
                height: 40,
                src: 'http://localhost:8080',
                width: 80,
                srcSet: '',
              },
            },
          }}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
