import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Channel from '../../src/ui/components/Channel';

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Channel
      channel={{
        name: 'recruiting',
        description: 'find a job here',
        id: 'recruit',
        teamId: 'linkedin',
      }}
    />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
