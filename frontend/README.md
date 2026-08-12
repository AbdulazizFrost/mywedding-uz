# MyWedding.uz — Frontend

React + Vite + Tailwind CSS.

> Статус: Шаг 1 — базовая структура и роутинг с placeholder-страницами.
> Редактор, работа с API заказов/оплаты и реальные шаблоны будут
> добавлены на следующих шагах.

## Стек

- React 19
- Vite
- Tailwind CSS v4 (через `@tailwindcss/vite`)
- React Router

## Установка

```bash
cd frontend
npm install
cp .env.example .env
```

## Запуск

```bash
npm run dev
```

По умолчанию приложение поднимется на `http://localhost:5173`.

## Маршруты (Шаг 1 — placeholder-страницы)

- `/` — Главная
- `/catalog` — Каталог шаблонов
- `/login` — Вход
- `/register` — Регистрация
- `/dashboard` — Личный кабинет

## Структура проекта

```
frontend/
├── src/
│   ├── pages/
│   │   ├── public/        # Home, Catalog, Login, Register
│   │   └── dashboard/      # Dashboard
│   ├── components/          # Navbar и другие переиспользуемые компоненты
│   ├── features/             # (пусто, для следующих шагов)
│   ├── api/                   # apiClient.js — базовый fetch-клиент
│   ├── hooks/                  # (пусто, для следующих шагов)
│   ├── router/                  # AppRouter.jsx
│   ├── styles/                   # index.css (Tailwind)
│   ├── App.jsx
│   └── main.jsx
├── public/
└── package.json
