import path from 'path';
// @ts-ignore
import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

// named exports detectors
import propTypes from 'prop-types';
import reactIs from 'react-is';

// treat as externals not relative and not absolute paths
const external = id => !id.startsWith('.') && !path.isAbsolute(id);

const input = './src/index.ts';
const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  '@krowdy-ui/core/Button': 'krowdy-ui.Button',
  '@krowdy-ui/core/Icon': 'krowdy-ui.Icon',
  '@krowdy-ui/core/IconButton': 'krowdy-ui.IconButton',
  '@krowdy-ui/core/InputAdornment': 'krowdy-ui.InputAdornment',
  '@krowdy-ui/core/TextField': 'krowdy-ui.TextField',
  '@krowdy-ui/core/Dialog': 'krowdy-ui.Dialog',
  '@krowdy-ui/core/DialogActions': 'krowdy-ui.DialogActions',
  '@krowdy-ui/core/DialogContent': 'krowdy-ui.DialogContent',
  '@krowdy-ui/core/Toolbar': 'krowdy-ui.Toolbar',
  '@krowdy-ui/core/Typography': 'krowdy-ui.Typography',
  '@krowdy-ui/core/Popover': 'krowdy-ui.Popover',
  '@krowdy-ui/core/Paper': 'krowdy-ui.Paper',
  '@krowdy-ui/core/Tab': 'krowdy-ui.Tab',
  '@krowdy-ui/core/Tabs': 'krowdy-ui.Tabs',
  '@krowdy-ui/core/SvgIcon': 'krowdy-ui.SvgIcon',
  '@krowdy-ui/core/CircularProgress': 'krowdy-ui.CircularProgress',
  '@krowdy-ui/core/Grid': 'krowdy-ui.Grid',
  '@krowdy-ui/core/styles': 'krowdy-ui',
};

const extensions = ['.ts', '.tsx', '.js'];

const getBabelOptions = ({ useESModules }) => ({
  exclude: /node_modules/,
  runtimeHelpers: true,
  extensions,
  plugins: [['@babel/plugin-transform-runtime', { useESModules }]],
});

const commonjsOptions = {
  include: /node_modules/,
  namedExports: {
    'prop-types': Object.keys(propTypes),
    'react-is': Object.keys(reactIs),
  },
};

const onwarn = warning => {
  // ignore imported types
  if (warning.code === 'NON_EXISTENT_EXPORT') {
    return;
  }
  throw Error(String(warning));
};

export default [
  {
    input,
    external,
    onwarn,
    output: {
      file: 'build/dist/krowdy-ui-pickers.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [nodeResolve({ extensions }), babel(getBabelOptions({ useESModules: false }))],
  },

  {
    input: {
      index: './src/index',
      DatePicker: './src/DatePicker',
      TimePicker: './src/TimePicker',
      DateTimePicker: './src/DateTimePicker',
      Calendar: './src/views/Calendar/Calendar',
      Day: './src/views/Calendar/Day',
      ClockView: './src/views/Clock/ClockView',
      Clock: './src/views/Clock/Clock',
      Picker: './src/Picker/Picker',
    },
    external,
    onwarn,
    output: {
      dir: 'build/esm',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [nodeResolve({ extensions }), babel(getBabelOptions({ useESModules: true }))],
  },

  {
    input,
    external,
    onwarn,
    output: {
      file: 'build/dist/krowdy-ui-pickers.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({ extensions }),
      babel(getBabelOptions({ useESModules: true })),
      sizeSnapshot(),
    ],
  },

  {
    input,
    external: Object.keys(globals),
    onwarn,
    output: {
      globals,
      format: 'umd',
      name: pkg.name,
      file: 'build/dist/krowdy-ui-pickers.umd.js',
    },
    plugins: [
      nodeResolve({ extensions }),
      babel(getBabelOptions({ useESModules: true })),
      commonjs(commonjsOptions),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      sizeSnapshot(),
      {
        transform(code, id) {
          if (id.includes('@krowdy-ui/core')) {
            throw Error('add @krowdy-ui/core imports to globals');
          }
        },
      },
    ],
  },

  {
    input,
    external: Object.keys(globals),
    onwarn,
    output: {
      globals,
      format: 'umd',
      name: pkg.name,
      file: 'build/dist/krowdy-ui-pickers.umd.min.js',
    },
    plugins: [
      nodeResolve({ extensions }),
      babel(getBabelOptions({ useESModules: true })),
      commonjs(commonjsOptions),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      sizeSnapshot(),
      terser(),
    ],
  },
];
