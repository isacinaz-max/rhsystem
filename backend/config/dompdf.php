<?php
return [
    'show_warnings' => false,
    'orientation' => 'portrait',
    'defines' => [
        'font_dir' => storage_path('fonts'),
        'font_cache' => storage_path('fonts'),
        'temp_dir' => sys_get_temp_dir(),
        'chroot' => realpath(base_path()),
        'enable_font_subsetting' => false,
        'enable_remote' => true,
        'dpi' => 96,
        'enable_javascript' => true,
        'enable_html5_parser' => true,
    ],
];
