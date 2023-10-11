import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import * as renderer from 'react-test-renderer';
import TeamSidebar from '../../src/ui/components/TeamSidebar';

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <Router>
      <TeamSidebar
        team={{
          name: 'LinkedIn',
          id: 'linkedin',
          iconUrl: '',
          channels: [
            {
              name: 'general',
              id: 'g',
              teamId: 'linkedin',
              description: 'general chat for general folks',
            },
          ],
        }}
      />
    </Router>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
