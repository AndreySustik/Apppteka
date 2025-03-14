-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Хост: db
-- Время создания: Мар 13 2025 г., 21:10
-- Версия сервера: 5.7.44
-- Версия PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `pharmacy`
--

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `address`, `comment`, `total`, `created_at`) VALUES
(1, 1, 'Г.Воронеж ул.Крутая', 'быстрее епта', 900.00, '2025-03-01 21:50:30'),
(2, 11, 'Тутуево', 'Метнулся туды сюды', 2800.00, '2025-03-01 22:01:20'),
(3, 1, 'Биляево д.828', 'Срочность, быстрость', 3497.00, '2025-03-07 10:03:28'),
(4, 1, 'Таматова 42', 'zxc', 800.00, '2025-03-07 10:09:23'),
(5, 11, 'ффывф', 'фвыфвф', 888.00, '2025-03-07 10:28:05'),
(6, 5, 'adsa', 'asdadsda', 1495.00, '2025-03-13 20:13:14'),
(7, 14, 'bitsyvo 83 g5', 'salat', 1930.00, '2025-03-13 21:08:37');

-- --------------------------------------------------------

--
-- Структура таблицы `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 4, 1, 200.00),
(2, 1, 5, 2, 350.00),
(3, 2, 6, 1, 1200.00),
(4, 2, 7, 2, 800.00),
(5, 3, 9, 3, 999.00),
(6, 3, 13, 1, 400.00),
(7, 3, 10, 1, 100.00),
(8, 4, 7, 1, 800.00),
(9, 5, 6, 1, 888.00),
(10, 6, 20, 1, 110.00),
(11, 6, 21, 1, 950.00),
(12, 6, 22, 1, 435.00),
(13, 7, 13, 1, 400.00),
(14, 7, 11, 1, 650.00),
(15, 7, 17, 4, 220.00);

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Без категории',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'no-image.jpg',
  `description` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `category`, `image`, `description`) VALUES
(4, 'Зубная паста', 200.00, 'Гигиена', 'toothpaste.jpg', 'уход за полостью рта в ночное время, отлично подходит для ежедневной вечерней чистки зубов. Рекомендована людям с повышенным образованием налета и камня на зубах, просыпающимся с неприятным запахом изо рта. При наличии различных стоматологических заболеваний. Носящим ортодонтические конструкции. Беременным и кормящим женщинам. Для детей старше 12 лет.'),
(5, 'Шампунь', 350.00, 'Гигиена', 'shampoo.jpg', 'Ежедневный уход, профилактика выпадения волос и их восстановление.'),
(6, 'Против травм', 888.00, 'Животные', 'travma_animal.jpg', 'При различных травмах у животных (вывихи, растяжения, порезы, ожоги, переломы) скорую регенерацию тканей обеспечивают специальные лекарственные препараты. Одним из таких является Травма-гель. Его оптимальный состав благотворно воздействует на скорость восстановительного процесса при заживлении ран различного генеза.'),
(7, 'Крем для лица', 800.00, 'Красота', 'face_cream.jpg', 'Уход за кожей лица - преждевременное старение. Для всех типов кожи при первых признаках старения и выраженных возрастных изменениях.'),
(8, 'Тонометр', 1000.00, 'Медтовары', 'tonometer.jpg', 'Автоматический тонометр на плечо MediTech модель МТ-30 с адаптером (адаптер входит в комплект), со стандартной прямой манжетой на окружность плеча 22-36 см. Прибор рекомендуется в качестве средства контроля артериального давления, частоты сердечных сокращений и для динамических наблюдений за этими параметрами в медицинских учреждениях и в домашних условиях.'),
(9, 'Линзы ACUVUE OASYS', 999.00, 'Линзы', 'linzy.jpg', 'Контактные линзы ACUVUE OASYS® with HYDRACLEAR® PLUS предназначены для дневного или пролонгированного ношения с целью оптической коррекции рефракционной аметропии (близорукости и дальнозоркости) у пациентов, не страдающих хроническими заболеваниями глаз, с возможным наличием астигматизма меньше или равно 1,00 D.'),
(10, 'Мыло', 100.00, 'Гигиена', 'soap.jpg', 'Подходит для всей семьи (для детей от 3 лет)'),
(11, 'Лосьон для тела', 650.00, 'Красота', 'body_lotion.jpg', 'Предназначен для ежедневного ухода.'),
(12, 'Кошачья мята', 300.00, 'Животные', 'cat_myta.jpg', 'При вдыхании запаха котовника питомец возбуждается и проявляет особый интерес к источнику аромата, а при поедании растение оказывает седативный успокаивающий эффект. '),
(13, 'Бинты медицинские', 400.00, 'Медтовары', 'bandages.jpg', 'Профилактика и лечение варикозной болезни и её осложнений, тромбофлебитов, предупреждение травм суставов, связок мышц, посттравматическое восстановление, также бинт помогает зафиксировать в нужном положении пострадавшую конечность.'),
(14, 'Зеленка', 75.00, 'Медтовары', 'zelenka.jpg', 'Зелёнка (раствор бриллиантового зелёного) применяется как антисептическое средство для обработки наружных повреждений, чтобы избежать инфицирования и не допустить нагноения'),
(15, 'Йод 10мл', 65.00, 'Медтовары', 'Yod.jpg', '5-процентный спиртовой раствор йода применяется для дезинфекции кожи вокруг повреждения (рваной, резаной или иной раны)'),
(16, 'Линзы PRECISION1', 799.00, 'Линзы', 'linzy1.jpg', 'Созданы для тех кто хочет попробовать свободу и почувствовать свободу жизни в стиле PRECISION1'),
(17, 'Мыло жидкое 300мл', 220.00, 'Гигиена', 'jm.jpg', 'Уникальное сочетание волшебного аромата оливы и натуральных увлажняющих компонентов.'),
(18, 'Mirrolla Масло', 815.00, 'Красота', 'abrms.jpg', 'Регулярное применение масла помогает улучшить внешний вид кожи, придать ей свежесть и естественное сияние. Масло применяется в уходе за волосами для увлажнения, смягчения и восстановления их структуры. С его помощью можно снизить ломкость, добиться шелковистости и гладкости.'),
(19, 'Пена Gillette', 357.00, 'Гигиена', 'pena.jpg', 'Слегка ароматизированная пена для чувствительной кожи легко распределяется и смывается, создавая ощущение пены для бритья, которым мужчины наслаждались на протяжении нескольких поколений. Благодаря формуле Gillette Comfort Glide.'),
(20, 'Термометр', 110.00, 'Медтовары', 'gradus.jpg', 'Используйте термометр для тела B.Well PRO-05 без ртути электронный в пластиковом футляре для точного измерения температуры. При измерении любым из двух методов прибор исключает погрешность. В моменты плохого самочувствия надежный помощник всегда под рукой! '),
(21, 'Omron x101 ингалятор', 950.00, 'Медтовары', 'ingolytr.jpg', 'Компрессорный ингалятор Omron C101 Essential — это тихий и простой в использовании небулайзер для всей семьи, предназначенный для лечения нижних дыхательных путей. Он обеспечивает эффективную доставку лекарств непосредственно в легкие. Относительно небольшой размер и небольшой вес ингалятора Essential делают его компактным и практичным, что делает его идеальным для путешествий. Он прост в использовании, эффективен и обеспечивает быстрое и надежное лечение. Ингалятор Omron C101 работает в непрерывном режиме, поэтому его может использовать попеременно каждый член семьи.'),
(22, 'масло для ухода', 435.00, 'Красота', 'seni.jpg', 'эффективно разглаживает кожу и повышает ее эластичность, обеспечивает надлежащее увлажнение кожи, снимает раздражения кожи и препятствует их появлению, питает и защищает кожу от сухости, легко наноситься и быстро впитывается, без красителей, консервантов и парабенов.');

-- --------------------------------------------------------

--
-- Структура таблицы `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `reviews`
--

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `username`, `comment`, `rating`, `created_at`) VALUES
(1, 5, 5, '1111', 'Палмалит мой нежный гель', NULL, '2025-03-03 20:33:42'),
(2, 5, 5, '1111', 'жумайсынба', NULL, '2025-03-03 20:44:43'),
(3, 5, 11, '2222', 'лошадиная сила', NULL, '2025-03-03 20:45:22'),
(4, 6, 11, '2222', 'коту понравилось, щас жене дам попробовать', NULL, '2025-03-03 20:45:58'),
(5, 5, 5, '1111', 'круто', 5, '2025-03-05 17:55:28'),
(6, 5, 5, '1111', 'хороший', 3, '2025-03-05 17:58:48'),
(7, 6, 5, '1111', 'не помогло', 3, '2025-03-05 17:59:32'),
(8, 7, 5, '1111', 'хороший', 4, '2025-03-05 18:00:24'),
(9, 8, 5, '1111', 'сломался', 2, '2025-03-05 18:10:35'),
(10, 11, 5, '1111', 'правильное название серная кислота', 1, '2025-03-05 18:11:07'),
(11, 12, 5, '1111', 'кот наблевал а так все нормально', 2, '2025-03-05 18:12:02'),
(12, 9, 11, '44444', 'лучшие линзы', 5, '2025-03-07 16:32:06'),
(13, 9, 14, '3333', 'good', 4, '2025-03-13 21:06:15'),
(14, 22, 14, '3333', 'very well', 5, '2025-03-13 21:06:42'),
(15, 21, 14, '3333', 'very bad', 2, '2025-03-13 21:07:12');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin', 'admin@example.com', '0192023a7bbd73250516f069df18b500', 'admin', '2025-02-20 18:33:47'),
(5, '11111111', '1111@gmail.com', '698d51a19d8a121ce581499d7b701668', 'user', '2025-02-20 19:32:07'),
(11, '44444', '22222@gmail.com', 'bcbe3365e6ac95ea2c0343a2395834dd', 'user', '2025-02-27 20:54:10'),
(14, '3333', '333@mail.ru', '310dcbbf4cce62f762a2aaa148d556bd', 'user', '2025-03-13 21:05:26');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT для таблицы `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
