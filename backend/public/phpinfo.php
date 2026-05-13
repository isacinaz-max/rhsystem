<?php
echo json_encode([
    'sapi' => PHP_SAPI,
    'config_file' => php_ini_loaded_file(),
    'config_dir' => PHP_CONFIG_FILE_SCAN_DIR,
    'ext_dir' => ini_get('extension_dir'),
    'inc_path' => ini_get('include_path'),
]);
