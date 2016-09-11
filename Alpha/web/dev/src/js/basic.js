/**
 * The JavaScript file for universal class setup
 */

/**
 * The map that will be gathered from the server, will initialize only once
 */
var serverMap = [];

/**************************************************************************
 * Network functions
 **************************************************************************/

/**************************************************************************
 * Local functions
 **************************************************************************/

/**
 * Enables submit button
 * @since Alpha 0.0.6
 */
function enableSubmitButton() {
	$("button.submit").prop("disabled", false);
}

/**
 * Disables submit button
 * @param {string} info - The error info
 * @since Alpha 0.0.6
 */
function disableSubmitButton(info) {
	$(".submit-wrapper button").prop("disabled", true);
}

/**
 * Displays an error info on the user form. This function will also disable the submit button
 * @param {string} info - The error info
 * @since Alpha 0.0.6
 */
function promptUserError(info) {
	info = info || "发生错误";

	$("#usr-warn-wrapper").addClass("show");
	$("#usr-warn").text(info);

	// Autohide itself
	clearTimeout(promptUserError.timeout);
	promptUserError.timeout = setTimeout(function() {
		hideUserFormError();
	}, 5000);

	disableSubmitButton();
}

/**
 * Hides the user form error info, and tries to reenable the submit button
 * @since Alpha 0.0.6
 */
function hideUserFormError() {
	$("#usr-warn-wrapper").removeClass("show");

	if ($("input.error").length === 0 && $("input.invalid").length === 0) {
		enableSubmitButton();
	}
}

/**
 * The advanced function of parsing a string into a number
 * This function will also return NaN if the string to be parsed contains any non-numeric characters
 * @param {string} str - The string number to be parsed
 * @returns {number} The parsed number, or NaN if invalid
 */
function myParseInt(str) {
	var num = parseInt(str);

	if (isNaN(num)) {
		return NaN;
	} else {
		if (num.toString() === str) {
			return num;
		} else {
			return NaN;
		}
	}
}

/**
 * Initializes the universal items on the website (i.e. header, footer and form)
 * For the details about .delegate and .on, see each sub-functions
 * @since Alpha 0.0.11
 * @version Alpha 0.0.97
 */
function initUniversalItems() {
	initServerConnection();

	initHeader();
	initLoadingBubble();
	initWarningBubble();
	initLawBottom();
	initNavbar();
	initForm();
	initTextarea();
}

/**
 * Communicates with the server to pull the latest info
 * @since Alpha 0.0.67
 */
function initServerConnection() {
	initServerMap();
}

/**
 * Initiates the server map, this includes some latest trends
 * @since Alpha 0.0.67
 */
function initServerMap() {
	serverMap = {
		studyField: ["test1", "test2", "test3", "test4", "test5"]
	};
}

/**
 * Adds a loading bubble on the screen
 * @since Alpha 0.0.97;
 */
function initLoadingBubble() {
	$("header").after("<div id=\"loader\"><div class=\"loader-wrapper\"><svg><circle cx=\"25\" cy=\"25\" r=\"20\" fill=\"none\" stroke-width=\"5\" stroke-miterlimit=\"10\"/></svg></div></div>");
}

/**
 * Adds a warning bubble after header
 * @since Alpha 0.0.85
 */
function initWarningBubble() {
	$("header").after("<div id=\"usr-warn-wrapper\"><p class=\"icon text warning\" id=\"usr-warn\"></p><a class=\"icon text times\"></a></div>");

	enableDismissWarningBubble();
}

/**
 * Enables dismissing the warning bubble
 * @since Alpha 0.0.85
 */
function enableDismissWarningBubble() {
	$("#usr-warn-wrapper a.icon.times").click(function() {
		$("#usr-warn-wrapper").removeClass("show");
	});
}

/**
 * Initializes the header
 */
function initHeader() {

}

/**
 * Initializes the law-bottom displayed in the bottom of the website about legal stuffs
 */
function initLawBottom() {

}

/**
 * Initializes the navbar so that it will change its appearance on scroll
 * @since Alpha 0.0.46.7
 * @version Alpha 0.0.109
 */
function initNavbar() {
	$(document).scroll(function() {
		if ($("#left-nav").length) {
			var top = $(window).scrollTop();

			if (top > $("#left-nav nav").position().top + $("header").height()) {
				$("#left-nav ul").addClass("top");
			} else {
				$("#left-nav ul").removeClass("top");
			}
		}
	});
}

/**
 * Initializes the universal items in the form
 * All the functions below will wipe out all the data inside the designated classes
 * @since Alpha 0.0.11
 * @version Alpha 0.0.98.6
 */
function initForm() {
	delegateFormElements();
	refreshFormElements();
}

/**
 * Delegates the form elements for present and future
 * This function should be only called once per visit
 * @since Alpha 0.0.98.6
 */
function delegateFormElements() {
	initRadioRevealsHiddenQuestions();

	initInputChangeAppearanceOnHover();
	initInputLockScroll();

	allowUncheckCheckedRadioButton();
	initFormDescriptionOnFocus();
	validateFormOnBlur();
}

/**
 * Refreshes all the current form on this page
 * This function call be called whenever necessary
 * @since Alpha 0.0.98.6
 */
function refreshFormElements() {
	initCaptcha();
	initDateWrapper();

	initPresetSelectorGroup();
	initDropdownMenu();

	initSubmitButton();

	initInputChangeAppearanceBeforeCertainElements();
	initInputReadonlyNotTabbable();
}

/**
 * Allows the user to uncheck the checked radio button on right click
 * @since Alpha 0.0.40
 * @version Alpha 0.0.90
 */
function allowUncheckCheckedRadioButton() {
	$(document).delegate("input[type=radio] + label", "click", function(e) {
		if ($(this).prev().is(":checked")) {
			$(this).prev().prop("checked", false);
			return false;
		}
	});
}

/**
 * Initiates preset selector group
 * To match a preset selector group, it must match .selector-group.empty, and specify attribute:
 *	1. `selector-type` to match the type of its children input type
 *	2. `selectors` to match the label value, separated by "|"
 *		Each selector can be attached with attributes in the form of 
 *		`selector{attr1:key1,attr2:key2}`
 *	3. `name` to use as a form element
 * After the processing, these attributes will be removed
 * The value starts at 0, incremented by 1 for its next element
 * @since Alpha 0.0.38
 */
function initPresetSelectorGroup() {
	$(".selector-group.empty").each(function() {
		var type = $(this).attr("selector-type"),
			selectors = $(this).attr("selectors").split("|"),
			name = $(this).attr("name"),
			html = "";

		// Process those elements
		for (var i = 0; i !== selectors.length; ++i) {
			var selector = selectors[i];
			// Find if any attr need to be added
			var results = selector.match(/\{.*\}/),
				additionalAttrs = "";

			if (results && results[0]) {
				results = results[0];

				// Process `selector`
				selector = selector.replace(results, "");
				// Trim the results
				results = results.substr(1, results.length - 2).split(",");

				for (var j = 0; j !== results.length; ++j) {
					var result = results[j],
						attr = result.split(":")[0],
						val = result.split(":")[1];

					additionalAttrs += attr + "='" + val + "'";
				}
			}

			var id = name + "-" + i;
			html += "<input id=\"" + id +
				"\" type=\"" + type +
				"\" name=\"" + name + "\" " +
				"value=\"" + i + "\" " +
				additionalAttrs +
				">" +
				"<label for=\"" + id + "\">" + selector + "</label> ";
		}

		// Add a summary box for checkbox
		html += "<span class=\"summary noselect\"></span>";

		// Remove unnecessary attributes
		$(this).html(html).removeAttr("selector-type selectors name").removeClass("empty")
			// Add the class
			.addClass(type);
	});
}

/**
 * Initiates the revelation of questions that will only be shown when specific radio button is pressed
 * To achieve this, add `showon` attribute to the parent class of `input`, then specify `show` attribute on the label to the radio button, or `hide` attribute 
 * @since Alpha 0.0.37
 * @version Alpha 0.0.97.1
 */
function initRadioRevealsHiddenQuestions() {
	$(document).delegate("input[type='radio'] + label", "click", function() {
		var show = $(this).prev().attr("show"),
			hide = $(this).prev().attr("hide");

		if (show) {
			$("form [showon=" + show + "]").attr("qualified", "");
		}

		if (hide) {
			// Hide those elements, and also clear the field of children input
			$("form [showon=" + hide + "]").removeAttr("qualified").children("input").val("");
		}
	});
}

/**
 * Initiates the functionality of dropdown menus
 * ALL THE FUNCTIONS HERE ARE NOT SUPPOSED TO USE $.delegate
 * @since Alpha 0.0.31
 * @version Alpha 0.0.98.9
 */
function initDropdownMenu() {
	initRadioDropdownMenu();
	initCheckboxDropdownMenu();
	initCheckboxSwitch();

	initPresetDropdownMenu();
	initDropdownMenuShowMatchedOnEnter();
	initDropdownMenuTransferValueToInputOnClick();
	enableDropdownAutoSelectOnlyMatched();
	//	initDropdownMenuChangePrevLabel();

	markProcessedDropmenu();
}

/**
 * Initiates the basic function of dropdown menu composed of radio buttons
 * Should any change happen here, please check initCheckboxDropdownMenu to maintain consistency
 * @since Alpha 0.0.98.1
 */
function initRadioDropdownMenu() {
	$(".selector-group.radio").mouseenter(function() {
		// Test if this class has been processed
		if (!$(this).hasClass("processed")) {

			var $this = $(this),
				overflowInterval,
				hasContents = false;

			$(this).hover(function() {
				// Mouseenter
				$(this).addClass("hover");

				// Change the prompt class
				$(this).prev().addClass("active");

				animateHeightToAuto($(this));

				overflowInterval = setTimeout(function() {
					$this.css("overflow-y", "auto");
				}, 400);
			}, function() {
				// Mouseleave
				$(this).removeClass("hover");

				// Check for the class change for previous label
				if (!hasContents && !$(this).children("input:checked").length) {
					// Nothing is selected
					$(this).prev().removeClass("active");
				}

				// Overflow scrollbar control
				clearTimeout(overflowInterval);
				$this.css("overflow-y", "");

				// Return to the previous height, and keep the z-index
				$(this).height("").css("z-index", "7");
				// Until the animation is finished
				setTimeout(function() {
					$this.css("z-index", "");
				}, 400);
			});

			// All the click on input will cause the dropmenu to shrink
			$(this).children("label").click(function() {
				// Update the contents info
				hasContents = !$(this).prev().is(":checked");

				$(this).mouseleave();
			});

			$(this).addClass("processed");

			// Simulate a hover
			$(this).mouseenter();
		}
	})

		// Add class of previous label
		.prev().addClass("selector");
}

/**
 * Initiates the basic function of dropdown menu composed of checkboxes
 * Should any change happen here, please check iniRadioDropdownMenu to maintani consistency
 * @since Alpha 0.0.98.5
 */
function initCheckboxDropdownMenu() {
	$(".selector-group.checkbox").mouseenter(function() {
		// Test if this class has been processed
		if (!$(this).hasClass("processed")) {

			var $this = $(this),
				overflowInterval,
				hasContents = false;

			$(this).hover(function() {
				// Mouseenter
				$(this).addClass("hover");

				// Change the prompt class
				$(this).prev().addClass("active");

				animateHeightToAuto($(this));

				overflowInterval = setTimeout(function() {
					$this.css("overflow-y", "auto");
				}, 400);
			}, function() {
				// Mouseleave
				$(this).removeClass("hover");

				// Check for the class change for previous label
				if (!hasContents && !$(this).children("input:checked").length) {
					// Nothing is selected
					$(this).prev().removeClass("active");
				}

				// Overflow scrollbar control
				clearTimeout(overflowInterval);
				$this.css("overflow-y", "");

				// Return to the previous height, and keep the z-index
				$(this).height("").css("z-index", "7");
				// Until the animation is finished
				setTimeout(function() {
					$this.css("z-index", "");
				}, 400);
			});

			// All the click on input should change the value of the summary
			$(this).children("label").click(function() {
				// Update the contents info
				hasContents = !$(this).prev().is(":checked");

				// Change the summary
				var summary = $(this).siblings(".summary").text(),
					entry = $(this).text(),
					splitter = "、";

				var lists;
				// Validify `lists`
				if (summary) {
					lists = summary.split(splitter);
				} else {
					lists = [];
				}
				var index = lists.indexOf(entry);


				if (index === -1) {
					// And it to the new entry
					lists.push(entry);
					summary = lists.join(splitter);
				} else {
					// Find it and remove it
					lists.splice(index, 1);
					summary = lists.join(splitter);
				}

				// Add it to the summary
				$(this).siblings(".summary").text(summary);
			});

			$(this).addClass("processed");

			// Simulate a hover
			$(this).mouseenter();

		}
	})

		// Add class of previous label
		.prev().addClass("selector");
}

/**
 * Initiates a light-weight class application on the labels before input[checkbox].switch, and help in supplementing missing id & for
 * @since Alpha 0.0.98.9
 */
function initCheckboxSwitch() {
	var $switch = $("input[type=checkbox].switch");

	$switch.each(function() {
		// Add an id on it
		var id = $(this).prop("id") || $(this).prop("name");
		$(this).prop("id", id);

		// Add a for attr on the elements before it
		$(this).next().attr("for", id);
	});
}

/**
 * Makes all .input-dropmenu so that they won't get processed again when new elements are added
 * @since Alpha 0.0.96
 */
function markProcessedDropmenu() {
	$(".input-dropmenu").addClass("processed");
}

/**
 * Changes the class of label before dropdown menu
 * @version 0.0.46.4
 */
function initDropdownMenuChangePrevLabel() {
	$(".input-dropmenu label.prompt").addClass("active");
}

/**
 * Initiates those dropmenus whose values have been preset in the `dropdown` attribute of .input-dropmenu
 * @version 0.0.96
 */
function initPresetDropdownMenu() {
	var map = {
		city: ["北京", "安徽·合肥", "安徽·安庆", "安徽·蚌埠", "安徽·亳州", "安徽·巢湖", "安徽·池州", "安徽·滁州", "安徽·阜阳", "安徽·淮北", "安徽·淮南", "安徽·黄山", "安徽·六安", "安徽·马鞍山", "安徽·铜陵", "安徽·芜湖", "安徽·宿州", "安徽·宣城", "重庆", "福建·福州", "福建·龙岩", "福建·南平", "福建·宁德", "福建·莆田", "福建·泉州", "福建·三明", "福建·厦门", "福建·漳州", "甘肃·兰州", "甘肃·白银", "甘肃·定西", "甘肃·甘南", "甘肃·嘉峪关", "甘肃·金昌", "甘肃·酒泉", "甘肃·临夏", "甘肃·陇南", "甘肃·平凉", "甘肃·庆阳", "甘肃·天水", "甘肃·武威", "甘肃·张掖", "广东·广州", "广东·潮州", "广东·东莞", "广东·佛山", "广东·河源", "广东·惠州", "广东·江门", "广东·揭阳", "广东·茂名", "广东·梅州", "广东·清远", "广东·汕头", "广东·汕尾", "广东·韶关", "广东·深圳", "广东·阳江", "广东·云浮", "广东·湛江", "广东·肇庆", "广东·中山", "广东·珠海", "广西·南宁", "广西·百色", "广西·北海", "广西·崇左", "广西·防城港", "广西·贵港", "广西·桂林", "广西·河池", "广西·贺州", "广西·来宾", "广西·柳州", "广西·钦州", "广西·梧州", "广西·玉林", "贵州·贵阳", "贵州·安顺", "贵州·毕节", "贵州·六盘水", "贵州·黔东南", "贵州·黔南", "贵州·黔西南", "贵州·铜仁", "贵州·遵义", "海南·海口", "海南·白沙", "海南·保亭", "海南·昌江", "海南·澄迈", "海南·儋州", "海南·定安", "海南·东方", "海南·乐东", "海南·临高", "海南·陵水", "海南·南沙", "海南·琼海", "海南·琼中", "海南·三亚", "海南·屯昌", "海南·万宁", "海南·文昌", "海南·五指山", "海南·西沙", "海南·中沙", "海南·儋州", "河北·石家庄", "河北·保定", "河北·沧州", "河北·承德", "河北·邯郸", "河北·衡水", "河北·廊坊", "河北·秦皇岛", "河北·唐山", "河北·邢台", "河北·张家口", "河南·郑州", "河南·安阳", "河南·鹤壁", "河南·济源", "河南·焦作", "河南·开封", "河南·洛阳", "河南·漯河", "河南·南阳", "河南·平顶山", "河南·濮阳", "河南·三门峡", "河南·商丘", "河南·新乡", "河南·信阳", "河南·许昌", "河南·周口", "河南·驻马店", "黑龙江·哈尔滨", "黑龙江·大庆", "黑龙江·大兴安岭", "黑龙江·鹤岗", "黑龙江·黑河", "黑龙江·鸡西", "黑龙江·佳木斯", "黑龙江·牡丹江", "黑龙江·七台河", "黑龙江·齐齐哈尔", "黑龙江·双鸭山", "黑龙江·绥化", "黑龙江·伊春", "湖北·武汉", "湖北·鄂州", "湖北·恩施", "湖北·黄冈", "湖北·黄石", "湖北·荆门", "湖北·荆州", "湖北·潜江", "湖北·神农架", "湖北·十堰", "湖北·随州", "湖北·天门", "湖北·仙桃", "湖北·咸宁", "湖北·襄樊", "湖北·孝感", "湖北·宜昌", "湖南·长沙", "湖南·常德", "湖南·郴州", "湖南·衡阳", "湖南·怀化", "湖南·娄底", "湖南·邵阳", "湖南·湘潭", "湖南·湘西", "湖南·益阳", "湖南·永州", "湖南·岳阳", "湖南·张家界", "湖南·株洲", "吉林·长春", "吉林·白城", "吉林·白山", "吉林·吉林", "吉林·辽源", "吉林·四平", "吉林·松原", "吉林·通化", "吉林·延边", "江苏·南京", "江苏·常州", "江苏·淮安", "江苏·连云港", "江苏·南通", "江苏·苏州", "江苏·泰州", "江苏·无锡", "江苏·宿迁", "江苏·徐州", "江苏·盐城", "江苏·扬州", "江苏·镇江", "江西·南昌", "江西·抚州", "江西·赣州", "江西·吉安", "江西·景德镇", "江西·九江", "江西·萍乡", "江西·上饶", "江西·新余", "江西·宜春", "江西·鹰潭", "辽宁·沈阳", "辽宁·鞍山", "辽宁·本溪", "辽宁·朝阳", "辽宁·大连", "辽宁·丹东", "辽宁·抚顺", "辽宁·阜新", "辽宁·葫芦岛", "辽宁·锦州", "辽宁·辽阳", "辽宁·盘锦", "辽宁·铁岭", "辽宁·营口", "内蒙古·呼和浩特", "内蒙古·阿拉善", "内蒙古·巴彦淖尔", "内蒙古·包头", "内蒙古·赤峰", "内蒙古·鄂尔多斯", "内蒙古·呼伦贝尔", "内蒙古·通辽", "内蒙古·乌海", "内蒙古·乌兰察布", "内蒙古·锡林郭勒", "内蒙古·兴安", "宁夏·银川", "宁夏·固原", "宁夏·石嘴山", "宁夏·吴忠", "宁夏·中卫", "青海·西宁", "青海·果洛", "青海·海北", "青海·海东", "青海·海南", "青海·海西", "青海·黄南", "青海·玉树", "山东·济南", "山东·滨州", "山东·德州", "山东·东营", "山东·菏泽", "山东·济宁", "山东·莱芜", "山东·聊城", "山东·临沂", "山东·青岛", "山东·日照", "山东·泰安", "山东·威海", "山东·潍坊", "山东·烟台", "山东·枣庄", "山东·淄博", "山西·太原", "山西·大同", "山西·晋城", "山西·晋中", "山西·临汾", "山西·吕梁", "山西·朔州", "山西·忻州", "山西·阳泉", "山西·运城", "山西·长治", "陕西·西安", "陕西·安康", "陕西·宝鸡", "陕西·汉中", "陕西·商洛", "陕西·铜川", "陕西·渭南", "陕西·咸阳", "陕西·延安", "陕西·榆林", "上海", "四川·成都", "四川·阿坝", "四川·巴中", "四川·达州", "四川·德阳", "四川·甘孜", "四川·广安", "四川·广元", "四川·乐山", "四川·凉山", "四川·泸州", "四川·眉山", "四川·绵阳", "四川·南充", "四川·内江", "四川·攀枝花", "四川·遂宁", "四川·雅安", "四川·宜宾", "四川·资阳", "四川·自贡", "天津", "西藏·拉萨", "西藏·阿里", "西藏·昌都", "西藏·林芝", "西藏·那曲", "西藏·日喀则", "西藏·山南", "新疆·乌鲁木齐", "新疆·阿克苏", "新疆·阿勒泰", "新疆·巴音郭楞", "新疆·博尔塔拉", "新疆·昌吉", "新疆·哈密", "新疆·哈萨克", "新疆·和田", "新疆·喀什", "新疆·柯尔克孜", "新疆·克拉玛依", "新疆·克孜勒苏", "新疆·库尔勒", "新疆·石河子", "新疆·塔城", "新疆·吐鲁番", "新疆·伊犁", "云南·昆明", "云南·保山", "云南·楚雄", "云南·大理", "云南·德宏", "云南·迪庆", "云南·红河", "云南·丽江", "云南·临沧", "云南·怒江", "云南·普洱", "云南·曲靖", "云南·文山", "云南·西双版纳", "云南·玉溪", "云南·昭通", "浙江·杭州", "浙江·湖州", "浙江·嘉兴", "浙江·金华", "浙江·丽水", "浙江·宁波", "浙江·衢州", "浙江·绍兴", "浙江·台州", "浙江·温州", "浙江·舟山", "香港", "澳门", "台湾"],
		occupation: ["安保消防", "餐饮服务", "畜牧业、渔业", "法律", "飞机和船舶技术", "购销仓储", "行政办公", "机械制造维护", "教学", "金融业务", "经济业务", "矿物勘测开采", "农业技术", "其他专业技术", "企事业单位或其它组织负责人", "水利设施管理", "体育", "卫生专业技术", "文学艺术", "消耗品生产", "新闻出版、文化", "信息技术", "野生动植物保护", "医疗卫生", "邮政电信业务", "娱乐场所服务", "运输服务", "种植业、林业", "宗教", "军人", "学生", "待业", "其它"]
	};

	$(".input-dropmenu:not(.processed)").each(function() {
		// Test if this one has a placeholder
		var placeholder = $(this).attr("placeholder");
		placeholder = placeholder || "";

		// Add an input box after each element
		$(this).removeAttr("placeholder").append("<input type=\"text\" placeholder=\"" + placeholder + "\"/>");
	});

	// Attach events to the input box
	$(".input-dropmenu:not(.processed) input").each(function() {

		// Add the dropdown menu when it's focused
		$(this).focus(function() {

			// Test if this input is yet to be processed
			if (!$(this).hasClass("processed")) {
				// Find the correct list from its parent element
				var dropdown = $(this).parent().attr("dropdown"),
					list = map[dropdown] || serverMap[dropdown];

				if (list) {
					// Add to this
					var html = "<div class=\"input-dropmenu-selectors\">";

					// Add each element
					for (var i = 0; i !== list.length; ++i) {
						// Add a timestamp to make sure it is unique
						var id = dropdown + "-" + new Date().getTime() + i;

						html += "<input id=\"" + id +
							"\" type=\"radio\" " +
							"name=\"" + dropdown + "\" " +
							"value=\"" + i + "\">" +
							"<label for=\"" + id + "\">" + list[i] + "</label> ";
					}

					html += "</div><p class=\"prompt\">支持关键词搜索和拼音首字母</p>";

					// Add the html after
					$(this).removeClass("dropdown").after(html);

					// Class .processed will be added in initDropdownMenuShowMatchedOnEnter()
				}
			}

		});

	});
}

/**
 * Initiates showing the matched results on entering on those dropmenus
 * This function initializes all the possible results only once on focus of `input` in each wrapper
 * @since Alpha 0.0.31
 * @version Alpha 0.0.96
 */
function initDropdownMenuShowMatchedOnEnter() {
	$(".input-dropmenu:not(.processed) input").each(function() {

		// Triggers the event on focus
		$(this).focus(function() {

			// Test if this input is yet to be processed
			if (!$(this).hasClass("processed")) {
				// Yet to processed

				// Finds all the possible results
				var results = [],
					$labels = $(this).parent().find("label:not(.prompt)");

				$labels.each(function() {
					results.push(getDropmenuValidMatchedResults($(this).html()));
				});

				// Link it to the input elem
				$(this).on("keyup", function(e) {
					if (e.keyCode === 27) {
						// esc pressed
						$(this).blur();
					}

					$labels.removeAttr("hidden");

					// Replace all the "|", and go uppercase
					var value = $(this).val().replace(/\|/g, "").toUpperCase(),
						found = false;

					if (value) {
						// The input is not empty
						for (var i = 0; i !== results.length; ++i) {
							if (results[i].indexOf(value) !== -1) {
								// Matched, go to search for the next one
								found = true;
								continue;
							}
							$labels.eq(i).attr("hidden", "");
						}

						if (!found) {
							// Tell the user no result found
							$labels.eq(0).parent().addClass("no-result");
						} else {
							$labels.eq(0).parent().removeClass("no-result");
						}
					} else {
						$labels.eq(0).parent().removeClass("no-result");
					}
				});

				// Add processed class
				$(this).addClass("processed");
			}

		});
	});
}

/**
 * Enables the input box to select the result if there is only one matched result in the search dropdown menu when it loses focus
 * @since Alpha 0.0.96
 */
function enableDropdownAutoSelectOnlyMatched() {
	$(".input-dropmenu:not(.processed) input").each(function() {

		// Triggers the event on focus
		$(this).blur(function() {
			// Find the matched labels
			var $matched = $(this).siblings(".input-dropmenu-selectors").children("input:not(:checked) + label:not([hidden])");

			if ($matched.length === 1) {
				// Simluate a click
				$matched.click();
			}
		});
	});

}

/**
 * Initiates transfering the value of the labels clicked to the input
 * @since Alpha 0.0.34
 * @version Alpha 0.0.96
 */
function initDropdownMenuTransferValueToInputOnClick() {
	$(".input-dropmenu:not(.processed)").each(function() {
		var $this = $(this);

		$(this).delegate("label:not(.prompt)", "click", function() {
			// Test if the label is checked
			if (!$(this).prev().is(":checked")) {
				// Not checked, add to the input
				$this.children("input").val($(this).text());
				// Something must be put there
				$this.children("label.prompt").addClass("active");
			} else {
				$this.children("input").val("");
				// The input box is clear now
				$this.children("label.prompt").removeClass("active");
			}
		});
	});
}

/**
 * Changes the class of previous element (assumed p.prompt) of input class in ul.form-list on focus and blur
 * @since Alpha 0.0.46
 * @version Alpha 0.0.98.8
 */
function initInputChangeAppearanceOnHover() {
	$(document).delegate("form ul.form-list input:not([readonly]), form ul.form-list textarea", "focus", function() {
		$(this).prev().addClass("active");
	})
		.delegate("form ul.form-list input:not([readonly]), form ul.form-list textarea", "blur", function() {
			if (!$(this).val().length) {
				$(this).prev().removeClass("active");
			}
		});
}

/**
 * Lock the scroll of the window to scroll only the input menu
 * @since Alpha 0.0.98.8
 */
function initInputLockScroll() {
	$(document).delegate(".input-dropmenu, .input-dropmenu-selectors", "mousewheel", function(e) {
		var e0 = e.originalEvent,
			delta = e0.wheelDelta || -e0.detail;

		this.scrollTop += (delta < 0 ? 1 : -1) * 30;
		e.preventDefault();
	});
}

/**
 * Changes the appearance of labels of some input or other divs by adding .active to them
 * @version Alpha 0.0.46.7
 */
function initInputChangeAppearanceBeforeCertainElements() {
	$("form ul.form-list input[readonly]").prev().addClass("active");
}

/**
 * Makes those readonly input box not tabbable (cannot be selected by tab)
 * @since Alpha 0.0.46.2
 */
function initInputReadonlyNotTabbable() {
	$("input[readonly]").prop("tabindex", "-1");
}

/**
 * Returns a group of strings that are considered to be matched to the given string passed in
 * @param {string} str - The string to get the matched results
 * @returns {string} - A list of matched results separated by "|"
 * @since Alpha 0.0.33
 */
function getDropmenuValidMatchedResults(str) {
	/*Iterator*/
	var i;
	// Include the result itself
	var result = [str];
	// Get Chinese characters capitals
	var elem = getChineseCharacterCapitals(str);

	for (i = 0; i !== elem.length; ++i) {
		if (elem[i].length) {
			result.push(elem[i]);
		}
	}

	return result.join("|");
}

/**
 * Adds a submit button inside .submit-wrapper.empty with text 提交
 * @since Alpha 0.0.30
 * @version Alpha 0.0.34
 */
function initSubmitButton() {
	$("form .submit-wrapper.empty")
		.removeClass("empty")
		.html("<button class=\"icon text float-up text bordered round long-span submit\" disabled>提交</button>");
}

/**
 * Shows the hidden div of the form
 */
function showFormHiddenDiv() {
	animateHeightToAuto("form .hidden-div");
}

/**
 * Initializes the captcha. 
 * This function will found all the .captcha on the current page and add captcha info on it
 * @since Alpha 0.0.11
 */
function initCaptcha() {
	$("form .captcha")
		.addClass("split-span-wrapper")
		.html("<div class=\"left-span\"><input type=\"text\" name=\"captcha\" placeholder=\"验证码\" /></div><div class=\"right-span\"><div class=\"captcha-pic\"><img alt=\"验证码\" /></div></div>");

	$(".captcha-pic").click(refreshCaptcha);
}

/**
 * Shows captcha and refreshes it to get a pic
 * @since Alpha 0.0.11
 */
function showCaptcha() {
	$(".captcha-wrapper, .captcha").addClass("show");
	refreshCaptcha();
}

/**
 * Gets a new captcha from server
 */
function refreshCaptcha() {

}

/**
 * Initializes the date-wrapper
 * @returns {} 
 */
function initDateWrapper() {
	$("form .date-wrapper").append("<input class=\"half-span center year\" type=\"number\" placeholder=\"年\" /><label>/</label><input class=\"quarter-span center month\" type=\"number\" placeholder=\"月\" /><label>/</label><input class=\"quarter-span center day\" type=\"number\" placeholder=\"日\" />");
}

/**
 * Initializes the form description on all the present and future elements on some preset types of input boxes
 * This function only cares the input boxes under form
 * @since Alpha 0.0.113
 * @Alpha Alpha 0.0.114
 */
function initFormDescriptionOnFocus() {
	$(document).delegate("form input", "focus", function() {
		if (!$(this).next("p.prompt").length) {
			var prompt = "";

			if ($(this).is("[name=userid]")) {
				prompt = "你的ID，注册成功后将不可更改。只可以使用大小写字母、数字、下划线（_）、圆点（.）和横线（-）";
			} else if ($(this).is("[type=password]")) {
				// Password, there are two cases

				if ($(this).is("[id=repeat-password]")) {
					// Repeat the password
					prompt = "重复之前输过的密码";
				} else {
					// Tell the user the format of the password
					prompt = "密码长度为8-32位，可以使用下列字符的任意组合：<br/>" +
						"- 大小写字母，区分大小写<br/>" +
						"- 阿拉伯数字<br/>" +
						"- 这些符号：~ ` ! @ # $ % ^ & * ( ) - _ = + { } [ ] | \\ : ; \" ' < > , . ? /";
				}
			} else if ($(this).is("[name=email]") || $(this).is("[type=email]")) {
				prompt = "输入合法的邮箱";
			} else if ($(this).is("[limit=tel]")) {
				prompt = "输入合法的中国手机号码";
			}

			if (prompt) {
				$(this).after("<p class='prompt'>" + prompt + "</p>");
			}
		}
	})
}

/**
 * Puts an error info on the element passed in
 * This function will automatically remove .valid and disable the submit button
 * @param {object} $elem - The DOM element to set error
 * @version Alpha 0.0.110
 */
function setInputElemError($elem) {
	$elem.removeClass("valid").addClass("error");
	disableSubmitButton();
}

/**
 * Puts a valid info on the element passed in 
 * This function will automatically remove .error
 * @param {object} $elem - The DOM element to set valid
 * @version Alpha 0.0.110
 */
function setInputElemValid($elem) {
	$elem.removeClass("error").addClass("valid");
	validateForm($elem);
}

/**
 * Resets the class on the element passed in 
 * This function will remove any error or valid class
 * @param {object} $elem - The DOM element to reset
 * @version Alpha 0.0.110
 */
function setInputElemClean($elem) {
	$elem.removeClass("error valid");
	validateForm($elem);
}

/**
 * Manually validates all the form in which $elem is in 
 * This function will contact server for 
 * @param {object} $elem - The children of the form element to validate
 * @since Alpha 0.0.111
 * @version Alpha 0.0.112
 */
function validateForm($elem) {
	// Assume form does not nest form
	var $form = $elem.parents("form");
	validateDateFormat($form.children(".date-wrapper input"));
	validateEmailFormat($form.children("input[name=email], input[type=email]"));
	validateMobileFormat($form.children("input[type=tel]"));
	validatePasswordFormat($form.children("input[type=password]"));
	validateUserIDFormat($form.children("input[name=userid]"));
	validateYearFormat($form.children("input[limit=year-after], input[limit=year-before]"));
}

/**
 * Validates the format of UserID under this form
 * [name=userid]
 * @param {object} $input - The input field to be inspected (DOM)
 * @since Alpha 0.0.112
 * @version Alpha 0.0.113
 */
function validateUserIDFormat($input) {
	$input.each(function() {
		var val = $input.val();

		if (val) {
			// Only do the job where there is something there
			var regex = /[\w\.-]+/;

			// Validate the result
			if (regex.test(val)) {
				// A valid result, reset this field
				setInputElemClean($(this));
			} else {
				// Invalid result
				setInputElemError($(this));
			}
		}
	});
}

/**
 * Validates the format of the password under this form
 * [name=password]
 * @param {object} $input - The input field to be inspected
 * @since Alpha 0.0.112
 * @version Alpha 0.0.113
 */
function validatePasswordFormat($input) {
	$input.each(function() {
		var val = $input.val();

		if (val) {
			// Only do the job where there is something there
			var regex = /[\w\.\/\?\\\|\+\^\*\[\]\{\}\(\)~`!@#$%&-=;:'"<>]{8,32}/;

			// Validate the result
			if (regex.test(val)) {
				// A valid result, set correct on it
				setInputElemValid($(this));
			} else {
				// Invalid result
				setInputElemError($(this));

				// Test for length
				if (val.length < 8) {
					promptUserError("密码长度太短");
				} else if (val.length > 32) {
					promptUserError("密码长度太长");
				}
			}
		}
	});
}

/**
 * Validates the format of the email under this form
 * @param {object} $input - The input field to be inspected
 * @since Alpha 0.0.112
 * @version Alpha 0.0.113
 */
function validateEmailFormat($input) {
	$input.each(function() {
		var val = $input.val();

		if (val) {
			// Only do the job where there is something there
			var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

			// Validate the result
			if (regex.test(val)) {
				// A valid result, waiting for further inspection
				setInputElemClean($(this));
			} else {
				// Invalid result
				setInputElemError($(this));
			}
		}
	});
}

/**
 * Validates the format of the mobile number under this form
 * @param {object} $input - The input field to be inspected
 * @since Alpha 0.0.112
 * @version Alpha 0.0.113
 */
function validateMobileFormat($input) {
	$input.each(function() {
		var val = $input.val();

		if (val) {
			// Only do the job where there is something there
			var regex = /[0-9]{11}/;

			// Validate the result
			if (regex.test(val)) {
				// A valid result, waiting for further inspection
				setInputElemClean($(this));
			} else {
				// Invalid result
				setInputElemError($(this));
			}
		}
	});
}

/**
 * Validates the format of date under this form
 * @param {object} $input - The input field to be inspected
 * @since Alpha 0.0.112
 * @version Alpha 0.0.113
 */
function validateDateFormat($input) {
	$input.each(function() {
		var year = $input.parent().children(".year").val(),
			month = $input.parent().children(".month").val(),
			day = $input.parent().children(".day").val();

		// Test if all the inputs have been filled
		if (year && month && day) {
			// Test the validity of the numbers
			year = myParseInt(year);
			month = myParseInt(month);
			day = myParseInt(day);

			if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
				var date = new Date(year, month - 1, day);
				if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
					setInputElemValid($(this).parent().children("input"));
					return;
				}
			}

			// Else: wrong format of the date
			promptUserError("日期格式错误");
			setInputElemError($(this).parent().children("input"));
		}
	});
}

/**
 * Validates the format of year under this form
 * This function should inspects input[limit=year-after] and input[limit=year-before]
 * @param {object} $input - The input field to be inspected
 * @since Alpha 0.0.112
 */
function validateYearFormat($input) {
	$input.each(function() {
		// Test the limit type of input
		var val = parseInt($(this).val()),
			thisYear = new Date().getFullYear(),
			flag;

		if ($input.is("[limit=year-after]")) {
			// Test if the value is the year after this year (including this year)
			flag = val >= thisYear;
		} else if ($input.is("[limit=year-before]")) {
			// Test if the value is the year before this year (including this year)
			flag = val <= thisYear;
		}

		// Test the condition
		if (flag) {
			// Valid year
			// Assign the validated year, and set as valid
			setInputElemValid($(this).val(thisYear));
		} else {
			setInputElemError($(this));
		}
	});
}

/**
 * Validates the UserID to contact the server
 * @param {String} id - The ID to be verified
 */
function validateUserIDUnique(id) {

}

/**
 * Validates the email to see if this is unique on the server
 * @param {String} email - The email to be validated
 * @returns {} 
 */
function validateEmailUnique(email) {

}

/**
 * Validates the mobile number to see if this is unique on the server
 * @param {String} number - The number to be validated
 * @returns {} 
 */
function validateMobileUnique(number) {

}

/**
 * Validates any object in the form when the user exits the input
 * @version Alpha 0.0.109
 */
function validateFormOnBlur() {
	validateFormUserIDOnBlur();
	validateFormPasswordOnBlur();
	validateFormEmailOnBlur();
	validateFormMobileOnBlur();
	validateFormDateOnBlur();
	validateFormYearOnBlur();
}

/**
 * Validates the validity and uniqueness of UserID
 * @since Alpha 0.0.113
 */
function validateFormUserIDOnBlur() {
	$(document).delegate("input[name=userid]", "blur", function() {
		validateUserIDFormat($(this));
	});
}

/**
 * Validates the password on client side
 * @since Alpha 0.0.113
 */
function validateFormPasswordOnBlur() {
	$(document).delegate("input[type=password]", "blur", function() {
		validatePasswordFormat($(this));
	});
}

/**
 * Validates the form of the email
 * @since Alpha 0.0.113
 */
function validateFormEmailOnBlur() {
	$(document).delegate("input[name=email], input[type=email]", "blur", function() {
		validateEmailFormat($(this));
	});
}

/**
 * Validates the form of mobile number
 * @since Alpha 0.0.113
 */
function validateFormMobileOnBlur() {
	$(document).delegate("input[limit=tel]", "blur", function() {
		validateMobileFormat($(this));
	});
}

/**
 * Validates the date when the user exits the input
 * This function handles the DOMs that are currently existed
 * @since Alpha 0.0.11
 * @version Alpha 0.0.113
 */
function validateFormDateOnBlur() {
	$(document).delegate(".date-wrapper input", "blur", function() {
		validateDateFormat($(this));
	});
}

/**
 * Validates the year of the form 
 * @since Alpha 0.0.113
 */
function validateFormYearOnBlur() {
	$(document).delegate("input[limit=year-after], input[limit=year-before]", "blur", function() {
		validateYearFormat($(this));
	});
}

/**
 * Initiates the basic setup for all the present and the future textareas
 * @since Alpha 0.0.77
 */
function initTextarea() {
	initTextareaAutoResize();
}

/**
 * Initiates the resize textarea on keyup, for those `textarea` with attribute "max-height"
 * @since Alpha 0.0.77
 */
function initTextareaAutoResize() {
	$(document).delegate("textarea[max-height]", "keyup", function() {
		$(this).height(0);
		var height;

		// Determine the height
		if (this.scrollHeight < $(this).attr("max-height")) {
			height = this.scrollHeight;
			$(this).css("overflow-y", "hidden");
		} else {
			// Reach the limit
			height = $(this).attr("max-height");
			$(this).css("overflow-y", "");
		}

		$(this).height(height);
	});
}


/**
 * Handles the position of footer
 * If insufficient contents is displayed, move it to the bottom
 * @since Alpha 0.0.13
 * @version Alpha 0.0.101
 */
function handlePositionLawBottom() {
	if ($("footer").length) {
		// Clear the style of footer anyway
		$("footer").removeAttr("style");

		if ($(window).height() > $("footer").position().top + $("footer").height()) {
			// footer does not reach the end of the page
			$("footer").css({
				position: "absolute",
				bottom: "0"
			});
		}
	}
}

/**
 * Scroll the window to the top smoothly
 * @since Alpha 0.0.80
 */
function windowScrollToTop() {
	$("html, body").animate({
		scrollTop: 0
	}, 400);
}

/**
 * Animates a DOM from its current height to auto
 * @param {string} element - The DOM element
 * @since Alpha 0.0.12
 * @version Alpha 0.0.91
 */
function animateHeightToAuto(element) {
	$(element).each(function() {
		var curHeight = $(this).height(),
			autoHeight = $(this).css("height", "auto").height();

		$(this).height(curHeight).animate({ height: autoHeight }, 0);
	});
}

/**
 * Enables the animations on this webpage, can be disabled without compromising the stability of the websites
 * @since Alpha 0.0.109
 */
function enableAnimations() {
	enableSmoothScroll();
	enableRippleEffect();
	enableAutohideHeader();
}

/**
 * Enables smooth scroll on the page when a link to a bookmark is clicked
 * This function delegates all the future `a` to enable smooth scroll
 * @since Alpha 0.0.20
 * @version Alpha 0.0.61
 */
function enableSmoothScroll() {
	$(document).delegate("a[href*=#]:not([href=#])", "click", function() {
		if (location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") &&
			location.hostname === this.hostname) {
			var target = $(this.hash);

			target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");

			if (target.length) {
				$("html, body").animate({
					scrollTop: target.offset().top
				}, 400);
				return false;
			}
		}
	});
}

/**
 * Enables ripple effects for all the `a` at the present and the future
 * @since Alpha 0.0.76
 * @version Alpha 0.0.90
 */
function enableRippleEffect() {
	$(document).delegate("a:not(.no-ripple), input[type=checkbox] + label, input[type=radio] + label", "click", function(e) {
		var d;
		// Find if any ripple effect is in it
		if ($(this).find(".ink").length === 0) {
			$(this).prepend("<span class='ink'></span>");
		}

		// Select the only one ripple effect
		var $ink = $(this).find(".ink");
		$ink.removeClass("ripple-animate");

		if (!$ink.height() && !$ink.width()) {
			d = Math.max($(this).outerWidth(), $(this).outerHeight());
			$ink.css({
				height: d,
				width: d
			});
		}

		// Animate the stuffs
		var x = e.pageX - $(this).offset().left - $ink.width() / 2;
		var y = e.pageY - $(this).offset().top - $ink.height() / 2;

		$ink.css({ top: y + "px", left: x + "px" }).addClass("ripple-animate");
	});
}

/**
 * Enables hiding the header when the user scrolls down, but re-show when (s)he scrolls up
 * This function applies to header and .header-elem (change it in basic.css)
 * @since Alpha 0.0.109
 */
function enableAutohideHeader() {
	// Store the previous scroll
	var prevScroll = 0;

	$(window).scroll(function() {
		var scrollTop = $(window).scrollTop();

		if (scrollTop > $("header").height()) {
			// Only do this when the header is out of the window
			if (prevScroll > scrollTop) {
				// Scrolled up
				$("body").removeClass("hide-header");
			} else {
				// Scrolled down
				$("body").addClass("hide-header");
			}

			prevScroll = scrollTop;
		} else {
			// Just remove the class
			$("body").removeClass("hide-header");
		}

	});
}

/**
 * Ready function for all the html documents
 * @since Alpha 0.0.2
 * @version Alpha 0.0.109
 * @author Anoxic
 */
$(document).ready(function() {
	// Add favicon
	$("head").append('<link rel="shortcut icon" href="img/favicon.ico"/>');

	// Initialize the lib's
	$(window).resize(function() {
		handlePositionLawBottom();
	});

	// Call it to do everything about resizing the window
	$(window).resize();

	// Validate date
	initUniversalItems();

	// Enable animation
	enableAnimations();
});


/************** Utility functions ******************/

/**
 * Converts the data string to a human readable format
 * @param {number} time - The milliseconds since epoch
 * @param {number} (Optional) now - The timestamp to be compared with. The default value is now
 * @returns {string} A human readble format
 * @since Alpha 0.0.101
 * @version Alpha 0.0.106
 * @author Xavier
 */
function getHumanReadableTime(time, now) {
	now = now || new Date().getTime();
	var cTime = now;
	var d = new Date(time);
	var dif = time - cTime;
	dif = dif / 1000;
	if (dif <= 0) {
		dif = -dif;
		if (dif < 60) {
			return "刚才";
		}
		if (dif >= 60 && dif < 3600) {
			return String(Math.floor(dif / 60)) + "分钟前";
		}
		if (dif >= 3600 && dif < 3600 * 24) {
			return String(Math.floor(dif / 3600)) + "小时前";
		}
		if (dif >= 3600 * 24 && dif <= 3600 * 24 * 30) {
			return String(Math.floor(dif / (3600 * 24))) + "天前";
		} else {
			return String(d.getFullYear()) + "年" + String(d.getMonth() + 1) + "月" + String(d.getDate()) + "日";
		}

	}
	if (dif > 0) {
		if (dif < 60) {
			return "马上";
		}
		if (dif >= 60 && dif < 3600) {
			return String(Math.floor(dif / 60)) + "分钟后";
		}
		if (dif >= 3600 && dif < 3600 * 24) {
			return String(Math.floor(dif / 3600)) + "小时后";
		}
		if (dif >= 3600 * 24 && dif <= 3600 * 24 * 30) {
			return String(Math.floor(dif / (3600 * 24))) + "天后";
		} else {
			return String(d.getFullYear()) + "年" + String(d.getMonth() + 1) + "月" + String(d.getDate()) + "日";
		}

	}

}

/**
 * Gets a shortened version of number representation
 * E.g. 3 -> 3, 12345 -> 12.3K, etc
 * @param {number} num - The number to be shortened
 * @returns {string} - A shortened string
 * @since Alpha 0.0.101
 * @version Alpha 0.0.106
 * @author Xavier
 */
function getShortenedNumber(num) {
	if (num < 1000 && num > -1000) {
		return String(num);
	}
	if (num >= 1000) {
		var v = Math.floor(num / 1000) + Math.round((num % 1000) / 100) / 10;
		if ((v % 1) == 0)
			return String(v) + ".0k";
		else
			return String(v) + "k";
	}
	if (num <= -1000) {
		var v = Math.ceil(num / 1000) + Math.round((num % 1000) / 100) / 10;
		if ((v % 1) == 0)
			return String(v) + ".0k";
		else
			return String(v) + "k";
	}
}

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

/**
 * Helper function for prevent default events
 * @since Alpha 0.0.104
 */
function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault)
		e.preventDefault();
	e.returnValue = false;
}

/**
 * Helper function for preventing keys to scroll
 * @since Alpha 0.0.104
 */
function preventDefaultForScrollKeys(e) {
	if (keys[e.keyCode]) {
		preventDefault(e);
		return false;
	}
}

/**
 * Disables scroll for a while
 * @since Alpha 0.0.104
 */
function disableScroll() {
	if (window.addEventListener) // older FF
		window.addEventListener("DOMMouseScroll", preventDefault, false);
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	window.ontouchmove = preventDefault; // mobile
	document.onkeydown = preventDefaultForScrollKeys;
}

/**
 * Enables scroll for a while
 * @since Alpha 0.0.104
 */
function enableScroll() {
	if (window.removeEventListener)
		window.removeEventListener("DOMMouseScroll", preventDefault, false);
	window.onmousewheel = document.onmousewheel = null;
	window.onwheel = null;
	window.ontouchmove = null;
	document.onkeydown = null;
}

/**
 * Returns the first letter of Pinyin, with support for characters with multiple pronunciations
 * This function will truncates characters that are not Chinese characters
 * @param {string} str - The string to be processed
 * @param {boolean} (Optional) serachMultiple - if search for multiple pronunciations are enabled
 * @since Alpha 0.0.32
 */
function getChineseCharacterCapitals(str, searchMultiple) {
	/* Itarator */
	var i, j, k;
	var arrResult = [],
		retArr = [""];

	// Finds all the possible pronunciations of each character
	for (i = 0; i !== str.length; ++i) {
		// Gets the unicode of this character
		var unicode = str.charCodeAt(i),
			result;

		// Tests if this character is a Chinese character
		if (unicode > 40869 || unicode < 19968) {
			// This chacter is not a Chinese character
			continue;
		}

		// Tests if this character has multiple pronunciations
		if (searchMultiple) {
			result = chineseCharacterPYMultplePronunciations[unicode] ? chineseCharacterPYMultplePronunciations[unicode] : (chineseCharacterPYCapitals.charAt(unicode - 19968));
		} else {
			result = chineseCharacterPYCapitals.charAt(unicode - 19968);
		}

		arrResult.push(result);
	}

	// Process the character results
	for (i = 0; i !== arrResult.length; ++i) {
		var elem = arrResult[i],
			len = elem.length;

		if (len === 1) {
			// Only one possible pronunciation
			for (j = 0; j !== retArr.length; ++j) {
				retArr[j] += elem;
			}
		} else {
			// Copy the pronunciations 
			var tmpArr = retArr.slice(0); // Copy `retArr`
			retArr = [];

			for (j = 0; j !== len; ++j) {
				// Copy another `retArr`
				var tmp = tmpArr.slice(0);

				// Adds this chacter to the end of each element of this array
				for (k = 0; k !== tmp.length; ++k) {
					tmp[k] += elem.charAt(j);
				}

				// Concatenates the copied string
				retArr = retArr.concat(tmp);
			}
		}
	}
	return retArr;
}

var chineseCharacterPYCapitals = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";
/**
 * 375 characters
 * @link http://www.51window.net/page/pinyin
 */
var chineseCharacterPYMultplePronunciations = { "19969": "DZ", "19975": "WM", "19988": "QJ", "20048": "YL", "20056": "SC", "20060": "NM", "20094": "QG", "20127": "QJ", "20167": "QC", "20193": "YG", "20250": "KH", "20256": "ZC", "20282": "SC", "20285": "QJG", "20291": "TD", "20314": "YD", "20340": "NE", "20375": "TD", "20389": "YJ", "20391": "CZ", "20415": "PB", "20446": "YS", "20447": "SQ", "20504": "TC", "20608": "KG", "20854": "QJ", "20857": "ZC", "20911": "PF", "20985": "AW", "21032": "PB", "21048": "XQ", "21049": "SC", "21089": "YS", "21119": "JC", "21242": "SB", "21273": "SC", "21305": "YP", "21306": "QO", "21330": "ZC", "21333": "SDC", "21345": "QK", "21378": "CA", "21397": "SC", "21414": "XS", "21442": "SC", "21477": "JG", "21480": "TD", "21484": "ZS", "21494": "YX", "21505": "YX", "21512": "HG", "21523": "XH", "21537": "PB", "21542": "PF", "21549": "KH", "21571": "E", "21574": "DA", "21588": "TD", "21589": "O", "21618": "ZC", "21621": "KHA", "21632": "ZJ", "21654": "KG", "21679": "LKG", "21683": "KH", "21710": "A", "21719": "YH", "21734": "WOE", "21769": "A", "21780": "WN", "21804": "XH", "21834": "A", "21899": "ZD", "21903": "RN", "21908": "WO", "21939": "ZC", "21956": "SA", "21964": "YA", "21970": "TD", "22003": "A", "22031": "JG", "22040": "XS", "22060": "ZC", "22066": "ZC", "22079": "MH", "22129": "XJ", "22179": "XA", "22237": "NJ", "22244": "TD", "22280": "JQ", "22300": "YH", "22313": "XW", "22331": "YQ", "22343": "YJ", "22351": "PH", "22395": "DC", "22412": "TD", "22484": "PB", "22500": "PB", "22534": "ZD", "22549": "DH", "22561": "PB", "22612": "TD", "22771": "KQ", "22831": "HB", "22841": "JG", "22855": "QJ", "22865": "XQ", "23013": "ML", "23081": "WM", "23487": "SX", "23558": "QJ", "23561": "YW", "23586": "YW", "23614": "YW", "23615": "SN", "23631": "PB", "23646": "ZS", "23663": "ZT", "23673": "YG", "23762": "TD", "23769": "ZS", "23780": "QJ", "23884": "QK", "24055": "XH", "24113": "DC", "24162": "ZC", "24191": "GA", "24273": "QJ", "24324": "NL", "24377": "TD", "24378": "QJ", "24439": "PF", "24554": "ZS", "24683": "TD", "24694": "WE", "24733": "LK", "24925": "TN", "25094": "ZG", "25100": "XQ", "25103": "XH", "25153": "PB", "25170": "PB", "25179": "KG", "25203": "PB", "25240": "ZS", "25282": "FB", "25303": "NA", "25324": "KG", "25341": "ZY", "25373": "WZ", "25375": "XJ", "25384": "A", "25457": "A", "25528": "SD", "25530": "SC", "25552": "TD", "25774": "ZC", "25874": "ZC", "26044": "YW", "26080": "WM", "26292": "PB", "26333": "PB", "26355": "ZY", "26366": "CZ", "26397": "ZC", "26399": "QJ", "26415": "ZS", "26451": "SB", "26526": "ZC", "26552": "JG", "26561": "TD", "26588": "JG", "26597": "CZ", "26629": "ZS", "26638": "YL", "26646": "XQ", "26653": "KG", "26657": "XJ", "26727": "HG", "26894": "ZC", "26937": "ZS", "26946": "ZC", "26999": "KJ", "27099": "KJ", "27449": "YQ", "27481": "XS", "27542": "ZS", "27663": "ZS", "27748": "TS", "27784": "SC", "27788": "ZD", "27795": "TD", "27812": "O", "27850": "PB", "27852": "MB", "27895": "SL", "27898": "PL", "27973": "QJ", "27981": "KH", "27986": "HX", "27994": "XJ", "28044": "YC", "28065": "WG", "28177": "SM", "28267": "QJ", "28291": "KH", "28337": "ZQ", "28463": "TL", "28548": "DC", "28601": "TD", "28689": "PB", "28805": "JG", "28820": "QG", "28846": "PB", "28952": "TD", "28975": "ZC", "29100": "A", "29325": "QJ", "29575": "SL", "29602": "FB", "30010": "TD", "30044": "CX", "30058": "PF", "30091": "YSP", "30111": "YN", "30229": "XJ", "30427": "SC", "30465": "SX", "30631": "YQ", "30655": "QJ", "30684": "QJG", "30707": "SD", "30729": "XH", "30796": "LG", "30917": "PB", "31074": "NM", "31085": "JZ", "31109": "SC", "31181": "ZC", "31192": "MLB", "31293": "JQ", "31400": "YX", "31584": "YJ", "31896": "ZN", "31909": "ZY", "31995": "XJ", "32321": "PF", "32327": "ZY", "32418": "HG", "32420": "XQ", "32421": "HG", "32438": "LG", "32473": "GJ", "32488": "TD", "32521": "QJ", "32527": "PB", "32562": "ZSQ", "32564": "JZ", "32735": "ZD", "32793": "PB", "33071": "PF", "33098": "XL", "33100": "YA", "33152": "PB", "33261": "CX", "33324": "BP", "33333": "TD", "33406": "YA", "33426": "WM", "33432": "PB", "33445": "JG", "33486": "ZN", "33493": "TS", "33507": "QJ", "33540": "QJ", "33544": "ZC", "33564": "XQ", "33617": "YT", "33632": "QJ", "33636": "XH", "33637": "YX", "33694": "WG", "33705": "PF", "33728": "YW", "33882": "SR", "34067": "WM", "34074": "YW", "34121": "QJ", "34255": "ZC", "34259": "XL", "34425": "JH", "34430": "XH", "34485": "KH", "34503": "YS", "34532": "HG", "34552": "XS", "34558": "YE", "34593": "ZL", "34660": "YQ", "34892": "XH", "34928": "SC", "34999": "QJ", "35048": "PB", "35059": "SC", "35098": "ZC", "35203": "TQ", "35265": "JX", "35299": "JX", "35782": "SZ", "35828": "YS", "35830": "E", "35843": "TD", "35895": "YG", "35977": "MH", "36158": "JG", "36228": "QJ", "36426": "XQ", "36466": "DC", "36710": "JC", "36711": "ZYG", "36767": "PB", "36866": "SK", "36951": "YW", "37034": "YX", "37063": "XH", "37218": "ZC", "37325": "ZC", "38063": "PB", "38079": "TD", "38085": "QY", "38107": "DC", "38116": "TD", "38123": "YD", "38224": "HG", "38241": "XTC", "38271": "ZC", "38415": "YE", "38426": "KH", "38461": "YD", "38463": "AE", "38466": "PB", "38477": "XJ", "38518": "YT", "38551": "WK", "38585": "ZC", "38704": "XS", "38739": "LJ", "38761": "GJ", "38808": "SQ", "39048": "JG", "39049": "XJ", "39052": "HG", "39076": "CZ", "39271": "XT", "39534": "TD", "39552": "TD", "39584": "PB", "39647": "SB", "39730": "LG", "39748": "TPB", "40109": "ZQ", "40479": "ND", "40516": "HG", "40536": "HG", "40583": "QJ", "40765": "YQ", "40784": "QJ", "40840": "YK", "40863": "QJG" };