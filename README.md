# @kamdz/dx

**@kamdz/dx** is an opinionated, production-ready boilerplate/starter for TypeScript projects, designed to provide an optimal developer experience (DX). It comes pre-configured with best practices and essential tools for streamlined development, including building, linting, formatting, testing, and CI/CD. Every file and configuration in this project serves as a blueprint for future projects.  


🚀 **Quick start:**

```bash
npx @kamdz/dx
# or
npx @kamdz/dx [path]
```

## ✨ Features

- **TypeScript** for static typing, with **tsup** & **tsx** for builds and development
- **ESLint 9** for code linting and quality checks
- **Prettier** for consistent code formatting
- **Husky** & **lint-staged** for Git hooks to ensure code quality
- **Commitlint** & **Commitizen** for conventional commit messages
- **Semantic Release** for automated versioning and changelogs
- **Jest** for unit testing with coverage
- **GitHub Actions** for CI/CD

## 📜 Available Commands

| Polecenie          | Opis                                                 |
|--------------------|------------------------------------------------------|
| `yarn build`      | Bundle your code to ES Module and CommonJS with **tsup** |
| `yarn cli`        | Run the custom CLI in `bin/cli.ts`                   |
| `yarn commit`     | Use **commitizen** for conventional commits          |
| `yarn dev`        | Start development mode with **tsx**                  |
| `yarn dx`         | Update your project with the latest **@kamdz/dx**    |
| `yarn format`     | Format code with **Prettier**                        |
| `yarn lint`       | Lint and auto-fix issues with **ESLint**             |
| `yarn start`      | Run the project with **tsx**                         |
| `yarn test`       | Run tests with **Jest** with coverage                |
| `yarn type-check` | Type-check your project using **TypeScript**         |

## 🤔 Why?

While monorepos with shared configs (ESLint, Prettier, TypeScript) are helpful, they still involve setting up boilerplate files for every project. **@kamdz/dx** simplifies this by providing a template repository. You can modify rules or tools, and propagate those changes to all your projects with a single command, ensuring a consistent developer experience across them.

## 🔧 Customization

To create your own `@user/dx`, fork this repository, modify whatever you need (except for the `bin` and `src` directories), and update the `name`, `bugs`, `repository`, `author`, `scripts.dx` in `package.json`. Done!

If you enjoy this project, please ⭐️ it!
