export function normalizeApiError(status, data) {
  if (import.meta.env.DEV) {
    // Безопасное логирование: только статус и данные ответа,
    // без паролей и чувствительных данных запроса.
    console.error(`[API Error] Status: ${status}`, data);
  }

  if (data) {
    if (data.message && typeof data.message === 'string') {
      return data.message;
    }
    if (data.error) {
      if (typeof data.error === 'string') return data.error;
      if (typeof data.error === 'object' && data.error.message) return data.error.message;
      if (typeof data.error === 'object') return JSON.stringify(data.error);
    }
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map(err => {
        if (typeof err === 'string') return err;
        if (err.message) return err.message;
        return JSON.stringify(err);
      }).join(', ');
    }
  }

  if (status === 400) return 'Неверный запрос. Пожалуйста, проверьте данные.';
  if (status === 401) return 'Ошибка авторизации. Неверный email или пароль.';
  if (status === 409) return 'Конфликт. Возможно, такой пользователь или данные уже существуют.';
  if (status === 429) return 'Слишком много запросов. Подождите немного.';
  if (status >= 500) return 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.';

  return 'Произошла ошибка. Попробуйте ещё раз.';
}
