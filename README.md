# Инструкция по загрузке на GitHub Pages

## Шаг 1: Запустите скрипт подготовки

Откройте терминал в папке проекта и выполните:

```bash
python web/prepare_github_pages.py
```

Или если у вас Python 3:

```bash
python3 web/prepare_github_pages.py
```

## Шаг 2: Скопируйте файлы в репозиторий

После выполнения скрипта все готовые файлы будут в папке `github-pages/`.

Скопируйте **всё содержимое** папки `github-pages/` в корень вашего GitHub репозитория.

## Шаг 3: Настройте GitHub Pages

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** → **Pages**
3. В разделе **Source** выберите:
   - **Branch**: `main` (или `master`)
   - **Folder**: `/ (root)`
4. Нажмите **Save**

## Шаг 4: Проверьте сайт

Через 1-2 минуты сайт будет доступен по адресу:
- `https://ВАШ_USERNAME.github.io` (если репозиторий называется `ВАШ_USERNAME.github.io`)
- `https://ВАШ_USERNAME.github.io/НАЗВАНИЕ_РЕПОЗИТОРИЯ` (если репозиторий имеет другое название)

## Структура файлов для GitHub Pages

```
github-pages/
├── index.html              ← Главная страница
├── .nojekyll               ← Важно! Отключает Jekyll
├── legal/
│   ├── user-agreement.html
│   ├── offer.html
│   └── privacy.html
└── static/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── img/
        └── mascot.png
```

## Важно!

- Все пути в файлах уже настроены для GitHub Pages
- Файл `.nojekyll` обязателен для корректной работы
- Не используйте папку `docs/` если не настроили её в Settings → Pages
