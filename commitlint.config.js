module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [0, 'always'],
    'footer-max-line-length': [0, 'always'],
    'header-max-line-length': [2, 'always', 72],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 50],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2, 
      'always', 
      [
        'feat', 
        'fix', 
        'docs', 
        'style', 
        'refactor', 
        'test', 
        'chore',
        'perf',
        'ci',
        'build',
        'revert'
      ]
    ]
  }
};