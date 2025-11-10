import globals from "globals";
import pluginjs from "@eslint/js";
import airbnb from "eslint-plugin-import";

export default [
    { languageOptions: {globals: global.node } },
    pluginJs.configs.recommended,
    {
        plugins: { import: pluginImport },
        rules: {
            ...airbnb.rules,
            'no-console': 'off',
            'no-unused-vars': 'warn',
            'import/no-extraneous-dependencies': 'off',
            'no-underscore-dangle': 'off',
        },
        settings: {
            ...airbnb.settings,
            'import/resolver': {
                node: {
                    extensions: [".js"],
                },
            },
        },
    },
    {
        ignore: ["node_modules/", "eslint.config.js"]
    },
];