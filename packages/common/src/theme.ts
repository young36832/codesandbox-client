import memoizeOne from 'memoize-one';
import Color from 'color';
import codesandbox from './themes/codesandbox.json';

const colorMethods = [
  'negate', // rgb(0, 100, 255) -> rgb(255, 155, 0)

  'lighten', // hsl(100, 50%, 50%) -> hsl(100, 50%, 75%)
  'darken', // hsl(100, 50%, 50%) -> hsl(100, 50%, 25%)

  'saturate', // hsl(100, 50%, 50%) -> hsl(100, 75%, 50%)
  'desaturate', // hsl(100, 50%, 50%) -> hsl(100, 25%, 50%)
  'greyscale', // #5CBF54 -> #969696

  'whiten', // hwb(100, 50%, 50%) -> hwb(100, 75%, 50%)
  'blacken', // hwb(100, 50%, 50%) -> hwb(100, 50%, 75%)

  'clearer', // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 0.4)
  'opaquer', // rgba(10, 10, 10, 0.8) -> rgba(10, 10, 10, 1.0)

  'rotate', // hsl(60, 20%, 20%) -> hsl(330, 20%, 20%)
];

/**
 * Takes a selector that returns a color string and returns new decorated selector that calls the
 * original function to get the color and then modifies that color, ultimately returning another
 * color string.
 *
 * vy60q8l043
 */
const addModifier = (fn, method, ...modifierArgs) => (...args) =>
  Color(fn(...args))
    [method](...modifierArgs)
    .rgbString();
/**
 * Add useful methods directly to selector function, as well as put an rgbString() call at the end
 * @param selector
 */
export const decorateSelector = (selector: any) => {
  // add member functions to our selector
  colorMethods.forEach(method => {
    selector[method] = memoizeOne((...args) =>
      decorateSelector(addModifier(selector, method, ...args))
    );
  });
  return selector;
};

type NestedColor = { [P in keyof Color.Color]: (val: number) => NestedColor } &
  (() => string);

function createTheme<T>(colors: T): { [P in keyof T]: NestedColor } {
  const transformed = Object.keys(colors)
    .map(c => ({ key: c, value: colors[c] }))
    .map(({ key, value }) => ({ key, value: decorateSelector(() => value) }))
    .reduce((prev, { key, value }) => ({ ...prev, [key]: value }), {}) as any;

  return transformed;
}

const theme = {
  ...createTheme({
    background: '#24282A',
    background2: '#111518',
    background3: '#374140',
    background4: '#141618',
    background5: '#111518', // Less brown version
    primary: '#FFD399',
    primaryText: '#7F694C',
    lightText: '#F2F2F2',
    secondary: '#40A9F3',
    shySecondary: '#66b9f4',
    darkBlue: '#1081D0',
    white: '#E0E0E0',
    gray: '#C0C0C0',
    black: '#74757D',
    green: '#5da700',
    redBackground: '#400000',
    red: '#F27777',
    dangerBackground: '#DC3545',
    sidebar: '#191d1f',
    placeholder: '#B8B9BA',
  }),
  vscodeTheme: codesandbox,

  new: createTheme({
    title: '#EEEEFF',
    description: '#777788',
    bg: '#2B2E41',
  }),
};

export default theme;
