<?php

$config = [
    'site_name' => 'Android Dev Info',
    'site_description' => 'A community driven guide for android development',
    'base_url' => 'http://localhost/docs',
    'github_repo' => 'https://github.com/kaiwulf/android-dev',
    'github_branch' => 'master',
    'content_dir' => 'content',

    'nav_items' => [
        'Getting Started' => [
            'Introduction' => 'introduction.md'
        ],
        'Views' => 'Jetpack Compose',
        'ModelView' => 'ModelView',
        'MVVM' => 'MVVM'
    ],
    'excluded_files' => ['README.md', '.gitigore', 'index.md']
];

function get_github_edit_url($file_path) {
    global $config;
    return $config['github_repo'] . '/edit/' . $config['github_branch'] . '/' . $config['content_dir'] . '/' . $file_path;
}

function is_current_page($path) {
    $current_page = $_GET['page'] ?? 'introduction.md';
    return $path === $current_page;
}

function get_page_title() {
    global $config;
    $current_page = $_GET['page'] ?? 'introduction.md';

    foreach($config['nav_items'] as $section => $pages) {
        foreach($pages as $title => $path) {
            if($path === $current_page) {
                return $title;
            }
        }
    }
}

function scan_directory($dir, $base_path = '') {
    global $config;

    $items = [];
    $files = scandir($dir);

    foreach ($files as $file) {
        if($file[0] === '.' || in_array($file, $config['excluded_files'])) {
            continue;
        }

        $path = $dir . '/' . $file;
        $relative_path = $base_path ? $base_path . '/' . $file : $file;

        if(is_dir($path)) {
            $sub_items = scan_directory($path, $relative_path);
            if(!empty($sub_items)) {
                $items[$file] = $sub_items;
            } elseif (pathinfo($file, PATHINFO_EXTENSION) === 'md') {
                $items[] = $relative_path;
            }
        }
    }
    return $items;
}

function format_title($name) {
    $name = preg_replace('/\.md$/', '', $name);
    $name = str_replace(['-', '_'], ' ', $name);
    return ucwords($name);
}



?>