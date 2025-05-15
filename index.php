<?php
// Include configuration
require_once 'includes/config.php';

// Simple markdown parser
// Note: For a production environment, consider using a more robust library like Parsedown
function parse_markdown($markdown) {
    // Basic markdown parsing for headers, bold, italic, code, and links
    $html = $markdown;
    
    // Parse headers (## Header -> <h2>Header</h2>)
    $html = preg_replace('/^##### (.*?)$/m', '<h5>$1</h5>', $html);
    $html = preg_replace('/^#### (.*?)$/m', '<h4>$1</h4>', $html);
    $html = preg_replace('/^### (.*?)$/m', '<h3>$1</h3>', $html);
    $html = preg_replace('/^## (.*?)$/m', '<h2>$1</h2>', $html);
    $html = preg_replace('/^# (.*?)$/m', '<h1>$1</h1>', $html);
    
    // Parse code blocks
    $html = preg_replace('/```(.*?)```/s', '<pre><code>$1</code></pre>', $html);
    
    // Parse inline code
    $html = preg_replace('/`(.*?)`/', '<code>$1</code>', $html);
    
    // Parse bold
    $html = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $html);
    
    // Parse italic
    $html = preg_replace('/\*(.*?)\*/', '<em>$1</em>', $html);
    
    // Parse links
    $html = preg_replace('/\[(.*?)\]\((.*?)\)/', '<a href="$2">$1</a>', $html);
    
    // Parse paragraphs (add a paragraph tag for each line that's not already a heading or code block)
    $html = preg_replace('/^(?!<h|<pre|<ul|<ol|<li|<table|<p)(.*?)$/m', '<p>$1</p>', $html);
    
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
$html_content = parge_markdown($markdown_content);

$github_edit_url = get_github_edit_urls($_GET['page'] ?? 'introduction.md');
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