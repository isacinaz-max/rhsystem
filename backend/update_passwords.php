<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$users = ['admin@rhsystem.com', 'rh@rhsystem.com', 'gestor@rhsystem.com', 'funcionario@rhsystem.com'];
$hash = password_hash('123456', PASSWORD_BCRYPT);

$pdo = new PDO('mysql:host=mysql;dbname=rh_system', 'rh_user', 'rh_password');
$stmt = $pdo->prepare('UPDATE users SET password = ? WHERE email = ?');
foreach ($users as $email) {
    $stmt->execute([$hash, $email]);
    echo "Updated: $email\n";
}
echo "Hash: $hash\n";
