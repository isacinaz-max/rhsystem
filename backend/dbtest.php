<?php
try {
    $pdo = new PDO('mysql:host=mysql;dbname=rh_system', 'rh_user', 'rh_password');
    $s = $pdo->query('SELECT DATABASE(), COUNT(*) FROM users');
    $r = $s->fetch(PDO::FETCH_ASSOC);
    echo 'DB: ' . $r['DATABASE()'] . ', Users: ' . $r['COUNT(*)'];
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
