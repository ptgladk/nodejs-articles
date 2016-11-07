$(function() {
    $('.delete-form').submit(function() {
        if (!confirm('Are you sure you want to delete this article?')) {
            return false;
        }
    });
});