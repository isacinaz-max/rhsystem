<?php
return [
    'exports' => [
        'chunk_size' => 1000,
        'pre_calculate_formulas' => false,
        'strict_null_comparison' => false,
    ],
    'imports' => [
        'read_only' => true,
        'heading_row' => [
            'formatter' => 'slug',
        ],
        'csv' => [
            'delimiter' => ',',
            'enclosure' => '"',
            'escape_character' => '\\',
            'contiguous' => false,
            'input_encoding' => 'UTF-8',
        ],
        'chunk_size' => 1000,
        'remembar' => [
            'enabled' => true,
            'driver' => 'database',
            'connection' => null,
            'table' => 'imports',
        ],
    ],
    'extension_detector' => [
        'xlsx' => 'Xlsx',
        'xlsm' => 'Xlsx',
        'xltx' => 'Xlsx',
        'xltm' => 'Xlsx',
        'xls' => 'Xls',
        'xlt' => 'Xls',
        'ods' => 'Ods',
        'ots' => 'Ods',
        'slk' => 'Slk',
        'xml' => 'Xml',
        'gnumeric' => 'Gnumeric',
        'htm' => 'Html',
        'html' => 'Html',
        'csv' => 'Csv',
        'tsv' => 'Csv',
        'pdf' => 'Dompdf',
    ],
    'value_binder' => [
        'enabled' => false,
        'default' => Maatwebsite\Excel\DefaultValueBinder::class,
    ],
    'cache' => [
        'driver' => 'memory',
        'settings' => [
            'memoryCacheSize' => '32MB',
            'cacheTime' => 600,
        ],
        'illuminate' => [
            'driver' => 'illuminate',
            'connection' => null,
        ],
    ],
    'transactions' => [
        'enabled' => true,
        'handler' => 'db',
    ],
    'temporary_files' => [
        'local_path' => storage_path('framework/temp'),
        'remote_disk' => null,
        'remote_prefix' => null,
        'force_resync_remote' => null,
    ],
];
