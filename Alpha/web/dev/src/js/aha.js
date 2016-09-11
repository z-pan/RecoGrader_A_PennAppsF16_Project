/**
 * Initiates toggling the new idea window when the user clicks on the button ("#add-new-idea")
 * @since Alpha 0.0.71
 */
function initToggleNewIdeaWindow() {
	// Add the click event handler
	$("#add-new-idea").click(function() {
		toggleNewIdeaWindow();
	});

	// Add the click to disable the new idea window
	$("#new-idea .screener").click(function() {
		$("#add-new-idea").click();
	});
}

/**
 * Enables the toggle of more-detailed window of each idea (for all the present and future .idea-wrapper)
 * @since Alpha 0.0.72
 * @version Alpha 0.0.105
 */
function enableIdeaViewMore() {
	$(document).delegate(".idea-wrapper .toggle", "click", function() {
		// Find its parent and toggles its class
		var $ideaWrapper = $(this).parents(".idea-wrapper").toggleClass("detail-view");
		$ideaWrapper.find(".screener").toggleClass("active toggle");

		// Remove the height of detail
		$ideaWrapper.find(".idea .detail").removeAttr("style");

		// More specific actions
		if ($(this).hasClass("more")) {
			// The idea is going fullscreen
			$ideaWrapper.addClass("comment-view")
				// Reset zip status
				.removeClass("zip")
				// Change the height of interaction tabs
				.find(".interaction-tabs").css("height", $ideaWrapper.height() - $ideaWrapper.find(".idea").height());
			$ideaWrapper.find("a.comment-o").addClass("hover");

			// Get the stuff to the correct position
			$("body").css("overflow", "hidden");
			$ideaWrapper.css("top", $(window).scrollTop());

		} else {
			// The idea is going back to normal mode
			$ideaWrapper.removeAttr("style")
				.removeClass("comment-view expansion-view");

			$ideaWrapper.find("a.comment-o, a.expand").removeClass("hover");

			// Re-test the height status
			adjustIdeaHeight($ideaWrapper);

			$("body").css("overflow", "");
		}
	});
}

/**
 * Enables the toggle of comments of each idea
 * @version Alpha 0.0.80
 */
function enableIdeaShowComments() {
	$(document).delegate(".idea-wrapper a.comment-o", "click", function() {
		// Hide the expansion section
		if ($(this).siblings("a.expand").hasClass("hover")) {
			$(this).siblings("a.expand").click();
		}

		// Toggle its own hover class
		$(this).toggleClass("hover")
		// Then toggle its parent class
			.parents(".idea-wrapper").toggleClass("comment-view");
	});
}

/**
 * Enables the toggle of expansions of each idea
 * @since Alpha 0.0.80
 */
function enableIdeaShowExpansions() {
	$(document).delegate(".idea-wrapper a.expand", "click", function() {
		// Hide the comment section
		if ($(this).siblings("a.comment-o").hasClass("hover")) {
			$(this).siblings("a.comment-o").click();
		}

		// Find a suitable height for expansion wrapper

		// Toggle its own hover class
		var $ideaWrapper = $(this).toggleClass("hover").parents(".idea-wrapper");

		if ($ideaWrapper.find(".expansions").height() <= 0) {
			// No height defined, set a new one

			// Find the height of the body of the idea
			var ideaHeight = $ideaWrapper.find(".idea").css("height", "auto").height();
			// Set it back
			$ideaWrapper.find(".idea").css("height", "");

			// Test if its height is less than half of the wrapper
			var wrapperHeight = $ideaWrapper.find(".idea-wrapper-helper").height();
			if (ideaHeight < wrapperHeight * .5) {
				// Set the height of expansions as high as possible
				$ideaWrapper.find(".expansions").height(wrapperHeight - ideaHeight);
			}
		}

		// Toggle its class
		$ideaWrapper.toggleClass("expansion-view");

		if (!$ideaWrapper.hasClass("processed")) {
			// Give the first two division animation
			var $first = $ideaWrapper.find(".expansions-section").eq(0),
				$second = $ideaWrapper.find(".expansions-section").eq(1);

			$first.addClass("anim right-left");

			// Test if the second one exist
			if ($second.length) {
				$second.addClass("anim to-right");

				$ideaWrapper.removeClass("no-paging");
			} else {
				// Does not exist
				$ideaWrapper.addClass("no-paging");
			}
		}
	});

	enableIdeaExpansionSwitchSection();
	enableIdeaExpansionReply();
	enableIdeaExpansionAdd();
}

/**
 * Enables the section(page) switch in idea view
 * @version Alpha 0.0.83
 */
function enableIdeaExpansionSwitchSection() {
	$(document).delegate(".idea-wrapper .expansions > a.nav", "click", function() {
		var $wrapper = $(this).siblings(".expansions-sections-wrapper");

		// Select the right section (by two classes)
		var $right = $wrapper.children(".anim.to-right");
		if (!$right.length) {
			$right = $wrapper.children(".anim.left-right");
		}

		// Select the left section (either the previous one or the last one of the wrapper)
		var $left = $right.prev();
		if (!$left.length) {
			$left = $wrapper.children().last();
		}

		// Remove the comment section
		if ($left.hasClass("comment")) {
			$left.find("a.plus").click();
		}
		if ($right.hasClass("comment")) {
			$right.find("a.plus").click();
		}

		// Clear the animation classes
		$left.removeClass("anim");
		$right.removeClass("anim");

		// Add the animations
		if ($(this).hasClass("angle-left")) {
			// Go to the previous page
			// Clear the class
			$left.prop("class", "expansions-section").removeAttr("style").addClass("anim left-right");

			// Show the left page
			var $leftPrev = $left.prev();
			if (!$leftPrev.length) {
				$leftPrev = $wrapper.children().last();
			}
			$leftPrev.prop("class", "expansions-section").removeAttr("style").addClass("anim to-left");

			// Fadeout the right page
			$right.hide("drop", {direction: "right"});
		} else {
			// Go to the next page
			// Clear the class
			$right.prop("class", "expansions-section").removeAttr("style").addClass("anim right-left");

			// Show the right page
			var $rightNext = $right.next();
			if (!$rightNext.length) {
				$rightNext = $wrapper.children().first();
			}
			$rightNext.prop("class", "expansions-section").removeAttr("style").addClass("anim to-right");

			// Fadeout the left page
			$left.hide("drop", { direction: "left" });
		}
	});
}

/**
 * Enables the reply of existing expansion
 * @version Alpha 0.0.87
 */
function enableIdeaExpansionReply() {
	$(document).delegate(".expansions-section .title a.icon.plus", "click", function() {
		// Find the parent class and change its style
		var $section = $(this).parent().parent().toggleClass("comment");

		// Test if it has comment class
		if ($section.hasClass("comment")) {
			// Simulate a keyup to resize
			$section.find("textarea").keyup();
		} else {
			// Resize the expansions-wrapper
			var scrollTop = $section.children(".expansions-wrapper").css("height", "").scrollTop();

			// Correct the scroll position
			$section.children(".expansions-wrapper").scrollTop(scrollTop - $section.children(".tab-input"));
		}
	});

	enableIdeaExpansionReplyAutoResize();
}

/**
 * Enables adding new expansion
 * @version Alpha 0.0.88
 */
function enableIdeaExpansionAdd() {
	$(document).delegate(".idea-wrapper .expansions > a.plus", "click", function() {
		// Find `.expansions` and add a class on it
		var $expansions = $(this).parents(".expansions").toggleClass("create");
	});
}

/**
 * Enables the resize of the `div` before tab-input
 * @since Alpha 0.0.87
 * @version Alpha 0.0.105
 */
function enableIdeaExpansionReplyAutoResize() {
	$(document).delegate(".expansions-section textarea[max-height]", "keydown", function() {
		// Gets the height
		var height = $(this).parents(".tab-input").outerHeight(true);
		// Find the parent element
		var $section = $(this).parents(".expansions-section");

		// Set the height
		var $wrapper = $section.find(".expansions-wrapper"),
			oldHeight = $wrapper.height(),
			// 42 is the height of `.title`
			newHeight = $section.height() - height - 42;

		// Test if `hewHeight` is new
		if (oldHeight !== newHeight) {
			// Set the new height
			var scrollTop = $wrapper.height(newHeight).scrollTop();

			// Then fix the scroll position
			$wrapper.scrollTop(scrollTop + oldHeight - newHeight);
		}
	});
}

/**
 * Toggles the new idea window
 * @since Alpha 0.0.71
 */
function toggleNewIdeaWindow() {
	$("#new-idea").toggleClass("show");
	$("#new-idea .screener").toggleClass("active");
}

/**
 * Handles the height of nav so that it will also occupy all the height of window
 * This function measures the height of .content-wrapper
 * Copied from myhome.js
 * @since Alpha 0.0.60
 * @version Alpha 0.0.104
 */
function handleHeightNav() {
	$("#left-nav").removeAttr("style").css({
		// There should only be one .content-wrapper, plus its padding
		height: $(".content-wrapper").eq(0).height() + 100
	});
}

/**
 * Loads the ideas from the server
 * @since Alpha 0.0.91
 * @version Alpha 0.0.98
 */
function loadIdeas() {
	// Initialize the variable name in the underscore template, stands for "data"
	_.templateSettings.variable = "d";

	var $ideate = $("#idea-template"),
		$newIdea = _.template($ideate.html());
	loadIdeaTemplate($newIdea);

	// Re-initates those un-processed dropdown menus
	initDropdownMenu();
}

/**
 * Loads the idea from the server
 * @param {object} $newIdea - A DOM object of a template
 * @since Alpha 0.0.98
 */
function loadIdeaTemplate($newIdea) {
	// Now this function is for testing only
	loadIdeaTemplateTest($newIdea);
}

/**
 * Loads the idea from a local test string
 * @param {object} $newIdea - A DOM object of a template
 * @since Alpha 0.0.99.1
 * @version Alpha 0.0.102
 */
function loadIdeaTemplateTest($newIdea) {
	var fixedData = loadIdeaFixMissingKeyValue(ahaTestData);
	loadIdeaAddNewToHtml($newIdea(fixedData));
}

/**
 * Adds new ideas to the page
 * @param {DOM} $newIdeas - The HTML series of .idea-wrapper
 * @since Alpha 0.0.102
 */
function loadIdeaAddNewToHtml($newIdeas) {
	$($newIdeas).filter(".idea-wrapper").each(function() {
		var $this = $(this);

		// Find the .ideas-list-wrapper with the lowest height
		var minHeight = $(document).height(),
			$shortestWrapper;
		$(".ideas-list-wrapper").each(function() {
			if ($(this).height() < minHeight) {
				// The current lowest wrapper
				minHeight = $(this).height();
				$shortestWrapper = $(this);
			}
		});

		// Add current idea to this column
		$this.appendTo($shortestWrapper);

		// Adjust the height
		adjustIdeaHeight($this);
	});

	// Resize the window
	$(window).resize();
}

/**
 * Adjusts given idea and adjust its height dynamically, and add a "view-more" button if needed
 * @param {DOM} $idea - The idea DOM to be adjusted height
 * @since Alpha 0.0.102
 * @version Alpha 0.0.104
 */
function adjustIdeaHeight($idea) {
	if ($idea.height() > 500) {
		// Add the class
		$idea.addClass("zip");

		// Remove the class if clicked
		$idea.find("a.icon.show-more").click(function() {
			animateHeightToAuto($idea.find(".idea .detail"));
			$idea.removeClass("zip");

			setTimeout(function() {
				$(window).resize();
			}, 400);
		});
	}
}

/**
 * Add the missing data to process, since underscore does not allow undefined keys
 * @param {object} data - The data to be processed
 * @since Alpha 0.0.99.1
 */
function loadIdeaFixMissingKeyValue(data) {
	for (var i = 0; i !== data.length; ++i) {

		var valid = true;

		for (var bool = true; bool; bool = false) {
			// Test for user
			if (data[i].user && data[i].user.name && data[i].user.avatar && data[i].user.id) {
				// Do nothing
			} else {
				valid = false;
				break;
			}

			// Test for time
			if (data[i].time && data[i].time.created != undefined) {
				data[i].time.modified = data[i].time.modified || data[i].time.created;

				// Convert the time
				data[i].time.createdReadable = getHumanReadableTime(data[i].time.created);
				data[i].time.modifiedReadable = getHumanReadableTime(data[i].time.modified);
			} else {
				valid = false;
				break;
			}

			// Test for tags
			data[i].tags = data[i].tags || [];

			// Test for content
			if (data[i].content) {
				data[i].content.title = data[i].content.title || "未命名";
				data[i].content.detail = data[i].content.detail || "";

				// feedback
				data[i].content.feedback = data[i].content.feedback || {};
				var values = ["like", "dislike", "watching", "star"];
				for (var j = 0; j !== values.length; ++j) {
					data[i].content.feedback[values[j]] = data[i].content.feedback[values[j]] || 0;
					data[i].content.feedback[values[j]] = getShortenedNumber(data[i].content.feedback[values[j]]);
				}
			} else {
				valid = false;
				break;
			}

			// comments
			data[i].comments = data[i].comments || [];
			for (var k = 0; k !== data[i].comments.length; ++k) {
				var comment = data[i].comments[k];

				// Test for user
				if (comment.user && comment.user.name && comment.user.avatar && comment.user.id) {
					// Do nothing
				} else {
					valid = false;
					break;
				}

				// Convert the time
				if (data[i].comments[k].time && data[i].comments[k].time.created != undefined) {
					data[i].comments[k].time.modified = data[i].comments[k].time.modified || data[i].comments[k].time.created;

					// Convert the time
					data[i].comments[k].time.createdReadable = getHumanReadableTime(data[i].comments[k].time.created);
					data[i].comments[k].time.modifiedReadable = getHumanReadableTime(data[i].comments[k].time.modified);
				} else {
					valid = false;
					break;
				}

				// Test for reply content
				if (comment.content) {
					data[i].comments[k].content.title = data[i].comments[k].content.title || "未命名";
					data[i].comments[k].content.detail = data[i].comments[k].content.detail || "";

					// feedback
					data[i].comments[k].feedback = data[i].comments[k].feedback || {};
					var subValues = ["like"];
					for (var l = 0; l !== subValues.length; ++l) {
						data[i].comments[k].content.feedback[subValues[l]] = data[i].comments[k].content.feedback[subValues[l]] || 0;
						data[i].comments[k].content.feedback[subValues[l]] = getShortenedNumber(data[i].comments[k].content.feedback[subValues[l]]);
					}
				} else {
					valid = false;
					break;
				}
			}

			// expansions
			data[i].expansions = data[i].expansions || [];
			for (var m = 0; m !== data[i].expansions.length; ++m) {
				// Test for field
				if (!data[i].expansions[m].field) {
					data[i].expansions.splice(m, 1);
					--m;
					continue;
				}

				// Test for the comments of this field
				var expansion = data[i].expansions[m].expansion;

				if (expansion) {
					for (var n = 0; n !== expansion.length; ++n) {
						var subExpansion = expansion[n];

						// Test for user
						if (subExpansion.user && subExpansion.user.name && subExpansion.user.avatar && subExpansion.user.id) {
							// Do nothing
						} else {
							valid = false;
							break;
						}

						// Convert the time
						if (data[i].expansions[m].expansion[n].time && data[i].expansions[m].expansion[n].time.created != undefined) {
							data[i].expansions[m].expansion[n].time.modified = data[i].expansions[m].expansion[n].time.modified || data[i].expansions[m].expansion[n].time.created;

							// Convert the time into human-readable
							data[i].expansions[m].expansion[n].time.createdReadable = getHumanReadableTime(data[i].expansions[m].expansion[n].time.created);
							data[i].expansions[m].expansion[n].time.modifiedReadable = getHumanReadableTime(data[i].expansions[m].expansion[n].time.modified);
						} else {
							valid = false;
							break;
						}

						// Test for reply content
						if (subExpansion.content) {
							data[i].expansions[m].expansion[n].content.title = data[i].expansions[m].expansion[n].content.title || "未命名";
							data[i].expansions[m].expansion[n].content.detail = data[i].expansions[m].expansion[n].content.detail || "";

							// feedback
							data[i].expansions[m].expansion[n].content.feedback = data[i].expansions[m].expansion[n].content.feedback || {};
							var subValues = ["like"];
							for (var l = 0; l !== subValues.length; ++l) {
								data[i].expansions[m].expansion[n].content.feedback[subValues[l]] = data[i].expansions[m].expansion[n].content.feedback[subValues[l]] || 0;
								data[i].expansions[m].expansion[n].content.feedback[subValues[l]] = getShortenedNumber(data[i].expansions[m].expansion[n].content.feedback[subValues[l]]);
							}
						} else {
							valid = false;
							break;
						}
					}
				} else {
					// Invalid format
					data[i].expansions.splice(m, 1);
					--m;
					continue;

				}

			}

			// Test for validity
			if (!valid) {
				break;
			}
		}

		if (!valid) {
			// Remove this entry, because this is invalid
			data.splice(i, 1);
			--i;
			continue;
		}

	}

	return data;
}

/**
 * @since Alpha 0.0.64
 * @version Alpha 0.0.71
 */
$(document).ready(function() {
	initToggleNewIdeaWindow();

	enableIdeaViewMore();
	enableIdeaShowComments();
	enableIdeaShowExpansions();

	$(window).resize(function() {
		handleHeightNav();
	});

	loadIdeas();
});
