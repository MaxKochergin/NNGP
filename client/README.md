# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactDom from 'eslint-plugin-react-dom';
import reactX from 'eslint-plugin-react-x';

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

# ННГП Клиентская часть

## Структура маршрутов и навигации

В проекте используется следующая структура маршрутов и навигации:

### Маршруты

Маршруты определены в файле `src/routes/PrivateRoutes.tsx`. Они организованы следующим образом:

- Все защищенные маршруты находятся внутри одного корневого маршрута с универсальным лейаутом
- Используется компонент `RoleBasedRoute` для проверки доступа к маршрутам в зависимости от роли пользователя
- Общие маршруты (например, для тестов и учебных материалов) имеют проверку ролей внутри, а не разделены на отдельные маршруты для каждой роли

```
/
├── candidate/
│   └── profile/
│       ├── basicInfo
│       ├── experience
│       ├── education
│       └── skills
├── tests/
│   ├── available  (для candidate и employee)
│   └── history    (для candidate, employee и hr)
└── learning/
    └── materials  (для candidate и employee)
```

### Навигация

Элементы навигации определены в файле `src/components/layouts/Protected/navigationConfig.ts`. Они фильтруются в зависимости от роли пользователя функцией `getNavigationItems()`.

Для динамической генерации элементов навигации в зависимости от роли пользователя используется функция `getDynamicNavigationItems()`, которая может быть расширена для дополнительной логики.

### Компоненты для работы с ролями

- `RoleBasedRoute` - компонент для проверки доступа к маршрутам в зависимости от роли пользователя
- `UniversalLayout` - универсальный лейаут для всех типов пользователей, который динамически отображает элементы навигации

## Как запустить проект

1. Клонировать репозиторий
2. Установить зависимости: `npm install`
3. Запустить в режиме разработки: `npm run dev`

## Доступные скрипты

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка проекта
- `npm run preview` - предпросмотр собранного проекта
- `npm run lint` - проверка кода линтером
