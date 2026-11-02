import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'coverage/**', 'node_modules/**', 'next-env.d.ts']),
  {
    rules: {
      // Project conventions: loose typing at the API boundary, plain <img> for remote/user images
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@next/next/no-img-element': 'off',
      // `onChange && onChange(value)` is the house style for optional callbacks
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true }
      ],
      // inline react-select `components` overrides
      'react/display-name': 'off',
      // React Compiler oriented rules (react-hooks v7) conflict with the ref-based
      // service hooks pattern (services/list, Form setErrors); keep the classic rules only.
      'react-hooks/refs': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/exhaustive-deps': 'off'
    }
  }
])
