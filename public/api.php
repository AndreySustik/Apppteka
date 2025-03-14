<?php
require_once '../config/db.php';
ini_set('session.gc_maxlifetime', 3600); // Увеличить время жизни сессии
ini_set('session.cookie_lifetime', 3600);
session_start();
error_log("Session ID: " . session_id()); // Записываем ID сессии в лог
error_log("Session Data: " . print_r($_SESSION, true));

// Заголовки CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

// Регистрация пользователя
if ($action == 'register') {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = trim($data['username']);
    $email = trim($data['email']);
    $password = trim($data['password']);

    // Проверка на пустые поля
    if (empty($username) || empty($email) || empty($password)) {
        echo json_encode(["message" => "Все поля должны быть заполнены"]);
        exit;
    }

    // Проверка формата email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["message" => "Некорректный email"]);
        exit;
    }

    // Хеширование пароля (лучше использовать bcrypt)
    $hashedPassword = md5($password); // В учебных целях, но лучше заменить на password_hash()

    // Проверяем, есть ли уже такой email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(["message" => "Email уже используется"]);
        exit;
    }

    // Запись в базу
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $hashedPassword]);
    echo json_encode(["message" => "Регистрация успешна"]);
}

// Авторизация пользователя
if ($action == 'login') {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = trim($data['email']);
    $password = trim($data['password']);

    // Проверка на пустые поля
    if (empty($email) || empty($password)) {
        echo json_encode(["message" => "Все поля должны быть заполнены"]);
        exit;
    }

    // Хеширование введенного пароля для сравнения с БД
    $hashedPassword = md5($password);

    $stmt = $pdo->prepare("SELECT id, username, email, role FROM users WHERE email = ? AND password = ?");
    $stmt->execute([$email, $hashedPassword]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $_SESSION['user_id'] = $user['id'];
        echo json_encode(["user" => $user]);
    } else {
        echo json_encode(["message" => "Неверный email или пароль"]);
    }
}

// Проверка сессии (профиль пользователя)
if ($action == 'profile') {
    if (isset($_SESSION['user_id'])) {
        $stmt = $pdo->prepare("SELECT id, username, email, role FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($user);
    } else {
        echo json_encode(["message" => "Пользователь не авторизован"]);
    }
    exit; // Добавляем exit, чтобы PHP не продолжал выполнение
}

// Обновление профиля пользователя
if ($action == 'updateProfile') {
    error_log("Получен запрос на обновление профиля"); // Логируем начало обработки

    // Проверяем, авторизован ли пользователь
    if (!isset($_SESSION['user_id'])) {
        error_log("Пользователь не авторизован"); // Логируем ошибку авторизации
        echo json_encode(["success" => false, "message" => "Пользователь не авторизован"]);
        exit;
    }

    // Получаем данные из запроса
    $data = json_decode(file_get_contents("php://input"), true);
    error_log("Полученные данные: " . print_r($data, true)); // Логируем данные

    $username = trim($data['username'] ?? '');
    $email = trim($data['email'] ?? '');

    // Проверяем, что данные не пустые
    if (empty($username) || empty($email)) {
        error_log("Ошибка: имя пользователя или email пусты"); // Логируем ошибку
        echo json_encode(["success" => false, "message" => "Имя пользователя и email не могут быть пустыми"]);
        exit;
    }

    // Проверяем формат email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        error_log("Ошибка: некорректный email"); // Логируем ошибку
        echo json_encode(["success" => false, "message" => "Некорректный email"]);
        exit;
    }

    // Проверяем, что email не занят другим пользователем
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->execute([$email, $_SESSION['user_id']]);
    if ($stmt->fetch()) {
        error_log("Ошибка: email уже используется другим пользователем"); // Логируем ошибку
        echo json_encode(["success" => false, "message" => "Email уже используется другим пользователем"]);
        exit;
    }

    // Обновляем данные пользователя в базе данных
    try {
        $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
        $stmt->execute([$username, $email, $_SESSION['user_id']]);
        error_log("Профиль успешно обновлен для пользователя с ID: " . $_SESSION['user_id']); // Логируем успех
        echo json_encode(["success" => true, "message" => "Профиль успешно обновлен"]);
    } catch (Exception $e) {
        error_log("Ошибка при обновлении профиля: " . $e->getMessage()); // Логируем исключение
        echo json_encode(["success" => false, "message" => "Ошибка при обновлении профиля"]);
    }
}

if ($action == 'products') {
    $category = $_GET['category'] ?? '';
    $stmt = $pdo->prepare("SELECT id, name, price, image, category FROM products WHERE category LIKE ?");
    $stmt->execute([$category ?: '%']);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Формируем правильный URL для изображений
    foreach ($products as &$product) {
        if (!empty($product['image'])) {
            $product['image'] = "http://localhost:8080/uploads/" . basename($product['image']);
        }
    }

    echo json_encode($products);
}

if ($action == 'create_order') {
    // Проверяем, авторизован ли пользователь
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false, "message" => "Пользователь не авторизован"]);
        exit;
    }

    // Получаем данные из запроса
    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $_SESSION['user_id']; // Берём user_id из сессии
    $address = trim($data['address'] ?? '');
    $comment = trim($data['comment'] ?? '');
    $total = $data['total'] ?? 0;
    $items = $data['items'] ?? [];

    // Проверяем, что данные не пустые
    if (empty($address) || $total <= 0 || empty($items)) {
        echo json_encode(["success" => false, "message" => "Ошибка: некорректные данные"]);
        exit;
    }

    try {
        // Создаём заказ в `orders`
        $stmt = $pdo->prepare("INSERT INTO orders (user_id, address, comment, total) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user_id, $address, $comment, $total]);
        $order_id = $pdo->lastInsertId();

        // Записываем товары в `order_items`
        $stmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        foreach ($items as $item) {
            $stmt->execute([$order_id, $item['id'], $item['quantity'], $item['price']]);
        }

        echo json_encode(["success" => true, "order_id" => $order_id]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Ошибка при оформлении заказа"]);
    }
}

if ($action == 'get_product') {
    $id = $_GET['id'] ?? 0;
    $stmt = $pdo->prepare("
        SELECT p.id, p.name, p.price, p.image, p.description, COALESCE(AVG(r.rating), 0) as avg_rating
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        WHERE p.id = ?
        GROUP BY p.id
    ");
    $stmt->execute([$id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($product) {
        if (!empty($product['image'])) {
            $product['image'] = "http://localhost:8080/uploads/" . basename($product['image']);
        }
        // Преобразуем avg_rating в число
        $product['avg_rating'] = (float)$product['avg_rating'];
        echo json_encode($product);
    } else {
        echo json_encode(["error" => "Товар не найден"]);
    }
}


if ($action == 'search_product') {
    $name = $_GET['name'] ?? '';
    $stmt = $pdo->prepare("SELECT id FROM products WHERE name LIKE ? LIMIT 1");
    $stmt->execute(["%$name%"]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($product) {
        echo json_encode($product);
    } else {
        echo json_encode(["error" => "Товар не найден"]);
    }
}

if ($action == 'search_suggestions') {
    $query = $_GET['query'] ?? '';

    $stmt = $pdo->prepare("SELECT id, name FROM products WHERE name LIKE ? LIMIT 5");
    $stmt->execute(["%$query%"]);
    $suggestions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($suggestions);
}

if ($action == 'get_reviews') {
    $product_id = $_GET['product_id'] ?? 0;
    $stmt = $pdo->prepare("SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC");
    $stmt->execute([$product_id]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($reviews);
}

if ($action == 'add_review') {
    $data = json_decode(file_get_contents("php://input"), true);
    $product_id = $data['product_id'] ?? 0;
    $user_id = $_SESSION['user_id'] ?? 0;
    $comment = trim($data['comment'] ?? '');
    $rating = $data['rating'] ?? null;

    if (!$user_id || !$product_id || empty($comment)) {
        echo json_encode(["success" => false, "message" => "Ошибка: некорректные данные"]);
        exit;
    }

    // Получаем имя пользователя
    $stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["success" => false, "message" => "Пользователь не найден"]);
        exit;
    }

    // Добавляем отзыв
    $stmt = $pdo->prepare("INSERT INTO reviews (product_id, user_id, username, comment, rating) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$product_id, $user_id, $user['username'], $comment, $rating]);
    echo json_encode(["success" => true, "message" => "Отзыв добавлен"]);
}

if ($action == 'popular_products') {
    // Запрос для получения товаров с самым высоким средним рейтингом
    $stmt = $pdo->prepare("
        SELECT p.id, p.name, p.price, p.image, COALESCE(AVG(r.rating), 0) as avg_rating
        FROM products p
        LEFT JOIN reviews r ON p.id = r.product_id
        GROUP BY p.id
        ORDER BY avg_rating DESC
        LIMIT 10
    ");
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Формируем правильный URL для изображений
    foreach ($products as &$product) {
        if (!empty($product['image'])) {
            $product['image'] = "http://localhost:8080/uploads/" . basename($product['image']);
        }
    }

    echo json_encode($products);
}

// Получение заказов пользователя
if ($action == 'getUserOrders') {
    // Проверяем, авторизован ли пользователь
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(["success" => false, "message" => "Пользователь не авторизован"]);
        exit;
    }

    // Получаем ID пользователя из сессии
    $user_id = $_SESSION['user_id'];

    // Запрос для получения заказов пользователя
    $stmt = $pdo->prepare("
        SELECT o.id, o.address, o.comment, o.total, o.created_at, 
               GROUP_CONCAT(p.name SEPARATOR ', ') as products
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    ");
    $stmt->execute([$user_id]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "orders" => $orders]);
}

if ($action == 'best_sellers') {
    // Запрос для получения 5 самых популярных товаров
    $stmt = $pdo->prepare("
        SELECT p.id, p.name, p.price, p.image, SUM(oi.quantity) as total_quantity
        FROM products p
        JOIN order_items oi ON p.id = oi.product_id
        GROUP BY p.id
        ORDER BY total_quantity DESC
        LIMIT 5
    ");
    $stmt->execute();
    $bestSellers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Формируем правильный URL для изображений
    foreach ($bestSellers as &$product) {
        if (!empty($product['image'])) {
            $product['image'] = "http://localhost:8080/uploads/" . basename($product['image']);
        }
    }

    echo json_encode($bestSellers);
}

if ($action == 'get_users') {
    $stmt = $pdo->prepare("SELECT id, username, email, role FROM users");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
    exit;
}

if ($action == 'change_role') {
    $id = $_GET['id'] ?? 0;
    $role = $_GET['role'] ?? '';

    // Проверяем, что роль допустима (user или admin)
    if (!in_array($role, ['user', 'admin'])) {
        echo json_encode(["success" => false, "message" => "Недопустимая роль"]);
        exit;
    }

    // Обновляем роль пользователя
    $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
    $stmt->execute([$role, $id]);

    echo json_encode(["success" => true, "message" => "Роль пользователя обновлена"]);
    exit;
}

if ($action == 'delete_user') {
    $id = $_GET['id'] ?? 0;

    // Удаляем пользователя
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(["success" => true, "message" => "Пользователь удален"]);
    exit;
}


if ($action == 'get_reviewsss') {
    $stmt = $pdo->prepare("SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC");
    $stmt->execute();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($reviews);
    exit;
}

// Выход
if ($action == 'logout') {
    session_destroy();
    echo json_encode(["message" => "Выход выполнен"]);
}
?>