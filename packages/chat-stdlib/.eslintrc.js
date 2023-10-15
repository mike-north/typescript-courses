module.exports = {
    "env": {
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        },
        {
            "files": "tests/**/*.ts",
            "env": { "node": true, "jest": true }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "project": true,
        "tsconfigRootDir": __dirname
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "prefer-const": "error",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-unused-params": "off"
    }
}
