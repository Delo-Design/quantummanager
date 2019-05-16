# Quantum Manager
## Файловый менеджер для Joomla!
### Описание
Бесплатный файловый менеджер для Joomla! с помощью которого Вы сможете загружать, редактировать и вставлять в редактор (а так же и поля) файлы.
Есть возможность переопределить вызовы стандартного файлового менеджера.

### Скриншоты
#### Вызов из поля типа media
|||
| ------------- | ------------- |
| ![Screenshot Quantum Manager 1](https://hika.su/images/screenshots/quantummanager/1.png)  | ![Screenshot Quantum Manager 2](https://hika.su/images/screenshots/quantummanager/2.png)  |
| ![Screenshot Quantum Manager 3](https://hika.su/images/screenshots/quantummanager/3.png)  |  |

#### Вставка в редактор
|||
| ------------- | ------------- |
| ![Screenshot Quantum Manager 6](https://hika.su/images/screenshots/quantummanager/6.png)  | ![Screenshot Quantum Manager 5](https://hika.su/images/screenshots/quantummanager/7.png)  |
| ![Screenshot Quantum Manager 8](https://hika.su/images/screenshots/quantummanager/8.png)  |  |

#### Настройки
|||
| ------------- | ------------- |
| ![Screenshot Quantum Manager 4](https://hika.su/images/screenshots/quantummanager/4.png)  | ![Screenshot Quantum Manager 5](https://hika.su/images/screenshots/quantummanager/5.png)  |


### Возможности
- Загружать файлы
- Менять формат изображениям (jpg, png, webp)
- Добавлять постфикс для имен файлов
- Сохранение оригиналов изображений
- Автоматический ресайз картинок
- Обрезка изображений (используется Cropper.js: https://fengyuanchen.github.io/cropperjs)
- Добавление водяного знака (с процетным его изменением под изображение)
- Ограничение прав на действия в менеджере для разных групп пользователей
- Мультиязычность (на данный момент поддерживается русский и английкий языки)

### Планируемые возможности
- Добавление интеграции с облаками (Я.Диск, Google Drive)
- Редактирование текстовых файлов с помощью Codemirror с деревом файлов, с помощью которого можно переключаться на другие файлы
- Простой аудиопеер для проигрывания аудио

### Архитектура
Менеджер является составным. Каждая часть является автономной, которая не требует других частей. (На данный момент пока еще не доведена автономность, в ближайших релизах будет исправлено).
Все части связаным между собой событиями на javascript, к которым вы можете так же подключаться в своих скриптах, для кастомизации поведения менедежра. (События будут описаны позже)

Части менеджера:
- Загрузка
- Область просмотра файлов и каталогов
- Тулбар
- Cropper.js
- Codemirror (пока не реализовано)
- Дерево каталогов
- Поиск (пока не реализовано)
- Недавно открытые каталоги
- Закрепленные каталоги

Каждая часть это на стороне Joomla! - поле JForm. На фронте части именуются модулями.

Тем самым Вы можете составлять и комбинировать части менеджера как Вам удобно в своих формах, которые используют конструктор JForm.

### Документация
Будет создана позже.

### Лицензия
GPLv3

### Требования
- Joomla >=3.7
- PHP >=5.6
- Библиотека jinterventionimage (https://github.com/Delo-Design/jinterventionimage)

### Разработчик
Компания "Деловой дизайн" https://delo-design.ru

### Поддержка
- [quantum@hika.su](mailto:quantum@hika.su) (email)
- [@tsymbalmitia](tg://resolve?domain=tsymbalmitia) (telegram) 
