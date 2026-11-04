'use strict';

// Plugins do ESLint (eslint, @eslint/eslintrc, eslint-plugin-react/import/jsx-a11y) ainda fazem
// `require('minimatch')` esperando a API da v3, onde o próprio módulo é a função de match.
// A v11 anexa a mesma API (Minimatch, filter, makeRe, match, defaults, braceExpand...) à função
// `minimatch`, então basta reexportá-la. Na v3, `\` em padrões virava separador no Windows;
// `windowsPathsNoEscape` mantém esse comportamento.
const path = require('path');
const { minimatch } = require('minimatch-v11');

module.exports = minimatch.defaults({ windowsPathsNoEscape: path.sep === '\\' });
