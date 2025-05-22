<?php
// Include configuration
require_once 'includes/config.php';
require_once 'vendor/autoload.php';

function parsedown_markdown($markdown) {
    static $parsedown = null;

    if($parsedown === null) {
        $parsedown = new Parsedown();

        $parsedown->setSafeMode(true);
    }

    $html = $parsedown->text($markdown);

    return $html;
}

$page = $_GET['page'] ?? 'introduction.md';

$page = str_replace(['..', '/', '\\'], '', $page);
$page = $config['content_dir'] . '/' . $page;

if(!file_exists($page)) {
    header('HTTP/1.0 404 Not Found');
    echo '<h1>404 - Page Not Found</h1>';
    exit;
}

$markdown_content = file_get_contents($page);
$html_content = parsedown_markdown($markdown_content);

$github_edit_url = "https://github.com/kaiwulf/android-dev.info";
include 'includes/header.php';
?>

<div class="documentation-container">
    <!-- Include sidebar -->
    <?php include 'includes/sidebar.php'; ?>
    
    <main class="content">
        <div class="page-header">
            <h1><?php echo get_page_title(); ?></h1>
            <a href="<?php echo $github_edit_url; ?>" class="edit-on-github" target="_blank">
                Edit on GitHub
            </a>
        </div>
        
        <div class="page-content">
            <?php echo $html_content; ?>
        </div>
    </main>
</div>

<?php
include 'includes/footer.php';
?>