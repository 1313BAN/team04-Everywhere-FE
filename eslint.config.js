import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import css from '@eslint/css'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier' // 추가

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    ignores: ['*.d.ts', '**/coverage', '**/dist', '**/*.md'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      js,
    },
    rules: js.configs.recommended.rules,
  },

  // Vue 3 추천 + Prettier 설정 적용
  {
    ...pluginVue.configs['flat/recommended'],
    files: ['**/*.vue'],
  },

  // Prettier 설정 추가
  {
    name: 'prettier',
    files: ['**/*.{js,ts,jsx,tsx,vue}'],
    rules: prettier.rules,
  },

  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: ['markdown/recommended'],
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
  },
])
