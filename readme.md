Разработка универсальной системы для обработки медицинских документов
=========

Будет разработан Прототип программного комлекса, изучены виды медицинских документов. Разработана база данных для хранения медицинских документов.

Команда запуска: 

    python -m flask run 


Ключи и прочиее переменные окружения прописаны в файле ".env". Этого файла нет в репозитории: он свой для каждого компьютера, где запущено наше приложение.

Для локальной разработки на macos использовалась MySQL. Необходимо указать app.config['SQLALCHEMY_DATABASE_URI'] = '' при локальном запуске на своем устройстве.

Для работы с pdf документами использовались библиотеки python. Необходимо установить их из файла "requirements.txt".

