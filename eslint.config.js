// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Regras que já estavam aqui:
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],

      // --- EXEMPLOS DE CUSTOMIZAÇÃO ---
      // Adicionar regras de estilo pessoal:
      "indent": ["error", 2],       // Forçar indentação de 2 espaços
      "quotes": ["error", "single"], // Forçar aspas simples
      "semi": ["error", "always"],   // Forçar ponto e vírgula

      // Desligar uma regra herdada que você não quer:
      // "@typescript-eslint/explicit-function-return-type": "off",

      // Mudar uma regra herdada de erro para aviso:
      // "@typescript-eslint/no-explicit-any": "warn"
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // Adicionar regras específicas para HTML aqui se necessário
      // Exemplo: Avisar sobre async negado
      // "@angular-eslint/template/no-negated-async": "warn"
    },
  }
);