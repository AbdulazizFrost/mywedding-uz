# MyWedding.uz — Backend

Node.js + Express API для сервиса свадебных приглашений.

> Статус: Шаг 1 — базовая структура и окружение. Бизнес-логика,
> авторизация, оплата и работа с БД (таблицы) будут добавлены на
> следующих шагах.

## Стек

- Node.js (ES Modules)
- Express.js
- PostgreSQL (клиент `pg`, подключение подготовлено, таблиц пока нет)

## Установка

```bash
cd backend
npm install
cp .env.example .env
```

Заполните `.env` своими значениями (например, `DATABASE_URL` для
локальной PostgreSQL). На Шаге 1 без `DATABASE_URL` сервер всё равно
запустится — подключение к БД просто не будет установлено.

## Запуск

```bash
npm run dev    # с автоперезапуском (node --watch)
# или
npm start
```

Сервер по умолчанию поднимется на `http://localhost:5000`.

## Проверка

```bash
curl http://localhost:5000/api/health
```

Ожидаемый ответ:

```json
{ "status": "ok", "service": "mywedding-api" }
```

## Структура проекта

```
backend/
├── src/
│   ├── config/         # env, database, storage
│   ├── modules/        # auth, users, templates, orders, payments,
│   │                    invitations, media, public (пока пустые)
│   ├── middlewares/     # requestLogger, errorHandler
│   ├── db/              # migrations, seeds, models (пусто)
│   ├── utils/
│   ├── app.js
│   └── server.js
├── tests/
├── .env.example
└── package.json
```
