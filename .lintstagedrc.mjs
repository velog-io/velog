export default {
    '*.{md,yml,json}': 'prettier --write',
    '*.{js,ts}': ['eslint --fix']
};
