
/**
 * Repositions the intro wrapper
 * @since Alpha 0.0.19
 * @version Alpha 0.0.23
 */
function handleInfoWrapper() {
	var height = $(window).height();
	$("#intro").css("height", height + "px");
}

/**
 * Repositions the detail wrapper
 * @since Alpha 0.0.20
 * @version Alpha 0.0.22
 */
function handleDetailWrapper() {
	var height = $(window).height();
	$(".homepage-more-detail").css("height", height + "px");
}

/**
 * Reposition the brief wrapper 
 * @since Alpha 0.0.19
 */
function handleBriefInfoWrapper() {
	var left = $(window).width() / 2 + $("#usr-form-wrapper").width() / 2 + 50;
	$(".intro-wrapper").css("left", left + "px");
}

/**
 * Handles the navigation icon
 * @since Alpha 0.0.23
 */
function handleNavIcon() {
	$(window).scroll(function() {
		var top = $(window).scrollTop(),
			topColor1 = ($("#detail-1").position().top + 0) / 2,
			topColor2 = ($("#detail-2").position().top + $("#detail-1").position().top) / 2,
			topColor3 = ($("#detail-3").position().top + $("#detail-2").position().top) / 2;
		$("#nav-wrapper").prop("class", "orange-bg");
		if (top === 0) {
			$("#top").addClass("hidden");
			$("#next").removeClass("hidden");
		} else {
			$("#top").removeClass("hidden");
			$("#next").removeClass("hidden");
			if (top < $("#detail-1").position().top) {
				$("#next").prop("href", "#detail-1");
				if (top > topColor1) {
					$("#nav-wrapper").prop("class", "green-bg");
				} else {
					$("#nav-wrapper").prop("class", "orange-bg");
				}
			} else if (top < $("#detail-2").position().top) {
				$("#next").prop("href", "#detail-2");
				if (top > topColor2) {
					$("#nav-wrapper").prop("class", "blue-bg");
				} else {
					$("#nav-wrapper").prop("class", "green-bg");
				}
			} else if (top < $("#detail-3").position().top) {
				$("#next").prop("href", "#detail-3");
				if (top > topColor3) {
					$("#nav-wrapper").prop("class", "orange-bg");
				} else {
					$("#nav-wrapper").prop("class", "blue-bg");
				}
			} else {
				$("#next").addClass("hidden");
			}
		}
	});
}

/**
 * Sets delay time on intro (word + sentence)
 * @since Alpha 0.0.22
 */
function setIntroDelay() {
	$(".brief-wrapper").each(function(index) {
		var $this = $(this);
		setTimeout(function() {
			$this.addClass("show");
		}, index * 500);
	});
}

/**
 * Enables the elements to be animated when shown
 * @since Alpha 0.0.21
 */
function enableShowOnScroll() {
	$(".homepage-more-detail p, .homepage-more-detail li").addClass("sc-ani");
}

/**
 * @version Alpha 0.0.20
 */
$(document).ready(function() {
	$(".form-login .switch").click(function() {
		$(".form-signup").removeClass("hidden");
	});
	$(".form-signup .switch").click(function() {
		$(".form-signup").addClass("hidden");
	});
	setIntroDelay();
	enableShowOnScroll();
	handleNavIcon();
	$(window).resize(function() {
		handleInfoWrapper();
		handleDetailWrapper();
	});
	$(window).resize();
})