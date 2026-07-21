module.exports = (options = {}) => {
  const { prefix = '' } = options;
  const separator = prefix ? '-' : '';
  const targetPrefix = prefix + separator;
  const legacyPrefix = 'ctp';

  return {
    postcssPlugin: 'postcss-prefixer',
    Rule(rule) {
      rule.selectors = rule.selectors.map((selector) => {
        const legacySelectorPattern = new RegExp(`(?<!-)${legacyPrefix}-`, 'g');
        return selector.replace(legacySelectorPattern, targetPrefix);
      });
    },
    AtRule(atRule) {
      if (atRule.name === 'keyframes') {
        const legacyKfPattern = new RegExp(`^${legacyPrefix}-`);
        atRule.params = atRule.params.replace(legacyKfPattern, targetPrefix);
      }
    },
    Declaration(decl) {
      if (/^animation(-name)?$/.test(decl.prop)) {
        const legacyAnimPattern = new RegExp(`(?<=^|[\\s,])${legacyPrefix}-`, 'g');
        decl.value = decl.value.replace(legacyAnimPattern, targetPrefix);
      }
    },
  };
};
module.exports.postcss = true;
