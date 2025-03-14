<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$uploadDir = $_SERVER['DOCUMENT_ROOT'] . "/uploads/"; // Абсолютный путь к папке uploads
 // Абсолютный путь к папке uploads
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true); // Создать папку, если её нет
}



if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileName = basename($_FILES['image']['name']);
        $filePath = $uploadDir . $fileName;
        $fileUrl = "http://localhost:8080/uploads/" . $fileName; // URL для отображения

        if (move_uploaded_file($fileTmpPath, $filePath)) {
            echo json_encode(["message" => "Файл загружен", "path" => $fileUrl]);
        } else {
            echo json_encode(["error" => "Ошибка при загрузке файла"]);
        }
    } else {
        echo json_encode(["error" => "Файл не загружен"]);
    }
} else {
    echo json_encode(["error" => "Неправильный метод"]);
}
?>