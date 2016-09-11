
/**
 * Initializes the nav bar on my home settings menu to click to show/hide and navigate to its position if submenu is clicked
 * @since Alpha 0.0.46
 */
function initMyHomeSettingsNavBar() {

	// Click on the main tab
	$("#left-nav nav > ul > li > a").click(function() {
		var $this = $(this);

		// Check if it is not selected
		if (!$this.parent().hasClass("selected")) {
			// Gets the name to be displayed
			var name = $(this).text();

			// Find it in .settings
			$(".settings-wrapper > p.title").each(function() {
				if ($(this).html() === name) {
					// Found, change the appearance
					$("#left-nav nav > ul > li").removeClass("selected");
					$this.parent().addClass("selected");

					// Show the correct settings
					$(".settings-wrapper").removeClass("show");
					$(this).parent().addClass("show");

					// Scroll to the top
					windowScrollToTop();

					$(window).resize();
				}
			});
		}

	});

	// Assign the `href` attribute to each submenu
	$("#left-nav nav > ul > li > ul > li > a").each(function() {
		var name = $(this).html(),
			$this = $(this);

		// Search for this name
		$(".settings-wrapper form p.title").each(function() {
			if ($(this).html() === name) {
				// Found id
				$this.prop("href", "#" + $(this).prop("id")).click(function() {
					// Click should ensure its parent is loaded
					$this.parents("li.has-sub").children("a").click();
				});
			}
		});

	});
}

/**
 * Handles the height of nav so that it will also occupy all the height of window
 * This function measures the height of .content-wrapper
 * Copied to aha.js
 * @since Alpha 0.0.60
 */
function handleHeightNav() {
	$("#left-nav").css({
		// There should only be one article, plus its padding
		height: $(".content-wrapper").eq(0).height() + 100
	});
}

/**
 * @since Alpha 0.0.46
 * @version Alpha 0.0.64
 */
$(document).ready(function() {
	initMyHomeSettingsNavBar();
	$(window).resize(function() {
		handleHeightNav();
	});
})