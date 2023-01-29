module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', //新增功能
        'fix', //缺陷修复
        'perf', //优化相关
        'style', //格式
        'docs', //文档
        'test', //测试
        'refactor', //功能重构
        'build', //版本构建
        'chore', //构建过程或辅助工具的变动。
        'revert', //回滚到上一个版本
      ],
    ],
  },
}
