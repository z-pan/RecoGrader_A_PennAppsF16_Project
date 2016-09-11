/**
 * Initiates the nav bar on the left
 */
function initNavBar() {
	
}

/**
 * Handles the height of nav so that it will also occupy all the height of window
 * This function measures the height of `article`
 * @since Alpha 0.0.60
 */
function handleHeightNav() {
	$("#left-nav").css({
		// There should only be one article, plus its padding
		height: $("article").eq(0).height() + 100
	});
}

/**
 * Overwrites the `href` property of `a` in the `nav` that goes to this page
 * @since Alpha 0.0.61
 */
function overwriteHelpcenterNavHrefToThisPage() {
	$("article h1").each(function(index) {

		// Assign `id` to all the h1 elements in this page
		var title = $(this).text(),
			id = "article-h1-" + index;
		$(this).prop("id", id);

		// Find the content that is currently displayed
		$("li.selected li > a").each(function() {
			// Match it to the content
			if ($(this).text() === title) {
				$(this).prop("href", "#" + id);
			}
		});

	});
}

/**
 * @version Alpha 0.0.66
 */
$(document).ready(function() {
	initNavBar();
	overwriteHelpcenterNavHrefToThisPage();

	$(window).resize(function() {
		handleHeightNav();
	});
})