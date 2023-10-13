import Typography from 'typography';
import Wordpress2016 from 'typography-theme-wordpress-2016';

Wordpress2016.overrideThemeStyles = () => {
  return {
    h1: {
      fontWeight: 700,
      color: '#111',
    },
    h2: { color: '#111' },
    h3: { color: '#111' },
    h4: { color: '#111' },
    body: {
      color: '#222',
    },
    strong: {
      fontWeight: 900,
      color: '#000',
      backgroundColor: '#ff9',
    },
    'a.gatsby-resp-image-link': {
      boxShadow: `none`,
    },
  };
};

delete Wordpress2016.googleFonts;

const typography = new Typography(Wordpress2016);

// Hot reload typography in development.
// eslint-disable-next-line
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
