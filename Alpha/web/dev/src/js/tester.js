/**
 * Unit test the data
 * This function will call a help function, with the format of second parameter as: A list of tested data, format as: [{name: ,passed: ,runtime: }, [result1], [result2], ...]. A correct output will be undefined
 * @param {function} func - The function to be tested
 * @param {object} data - The data to be tested. Format follows: [[[input1, input2], output], [[input1, input2], output]], maximum arguments support is FIVE
 * @since Alpha 0.0.102
 * @version Alpha 0.0.103
 */
function testFunction(func, data) {
	var result = [],
		passed = 0;

	// Test the data
	var start = new Date().getTime();
	for (var v = 0; v !== 10000; ++v) {
		for (var i = 0; i !== data.length; ++i) {
			var args = data[i][0],
				output = data[i][1],
				funcOutput;
			if (typeof args == "object") {
				var arg0 = args[0],
					arg1 = args[1],
					arg2 = args[2],
					arg3 = args[3],
					arg4 = args[4];
				funcOutput = func(arg0, arg1, arg2, arg3, arg4);
			} else {
				funcOutput = func(args);
			}
			if (v === 0) {
				if (funcOutput === output) {
					result.push(undefined);
					++passed;
				} else {
					result.push([funcOutput]);
				}
			}
		}
	}

	// Get the function name
	var funcName = func.toString();
	funcName = funcName.substr("function ".length);
	result.unshift({
		name: funcName.substr(0, funcName.indexOf("(")),
		passed: passed + "/" + data.length + " " + parseInt(passed / data.length * 10000) / 100 + "%",
		runtime: (new Date().getTime() - start) / 10000 + "s"
	}
);

	printResult(data, result);
}

/**
 * Print the result on the website
 * @param {object} data - The test data
 * @param {object} result - The returned result by testFunction
 * @since Alpha 0.0.102
 * @version Alpha 0.0.103
 */
function printResult(data, result) {
	// The header
	var html = "<h2>" + result[0]["name"] + "</h2>" +
		"<p>Passed: " + result[0]["passed"]+ "</p>" +
		"<p>Runtime: " +result[0]["runtime"] + "</p>" +
		"<table><tbody><tr><th>No.</th><th>Status</th><th>args</th><th>Expected</th><th>Got</th></tr>";

	for (var i = 1; i !== result.length; ++i) {
		var got;
		if (result[i]) {
			got = result[i][0];
			html += "<tr class='error'><td>Fail</td>";
		} else {
			got = data[i - 1][1];
			html += "<tr><td>Pass</td>";
		}

		// The number of the cases
		html += "<td>" + i + "</td>";

		// args
		html += "<td>" + data[i - 1][0].join(", ") + "</td>";
		// Expected
		html += "<td>" + data[i - 1][1] + " (" + typeof (data[i - 1][1]) + ")</td>";
		// Got
		html += "<td>" + got + " (" + typeof (got) + ")</td></tr>";
	}

	// Finish the table
	html += "</tbody></table>";

	$("body").after(html);
}

/**
 * Initiates the tester
 * @version Alpha 0.0.102
 */
function initTester() {
	testFunction(getShortenedNumber, [
		[[1], "1"],
		[[2], "2"],
		[[0], "0"],
		[[-1], "-1"],
		[[-2999], "-3.0k"],
		[[-1000], "-1.0k"],
		[[-999], "-999"],
		[[-2134566], "-2134.6k"],
		[[-21500], "-21.5k"],
		[[-2111], "-2k"],
		[[213], "213"],
		[[2133], "2.1k"],
		[[222222], "222.2k"],
		[[1000000], "1000.0k"],
		[[999], "999"],
		[[1999], "2.0k"],
		[[21550], "21.6k"],
		[[21549], "21.5k"]
	]);

	testFunction(getHumanReadableTime, [
		[[57600000, 1440000000000], "1970年1月1日"],
		[[1111075200000, 1440000000000], "2005年3月17日"],
		[[1332086400000, 1440000000000], "2012年3月18日"],
		[[1434816000000, 1440000000000], "2015年6月20日"],
		[[1437235200000, 1440000000000], "30天前"],
		[[1439838000000, 1440000000000], "1天前"],
		[[1439913600000, 1440000000000], "1天前"],
		[[1439913954000, 1440000000000], "5分钟后"],
		[[1439914802000, 1440000000000], "20分钟后"],
		[[1439914980000, 1440000000000], "23小时前"],
		[[1439917200000, 1440000000000], "1小时后"],
		[[1439924601000, 1440000000000], "3小时后"],
		[[1439925840000, 1440000000000], "2040年6月1日"],
		[[1439942399000, 1440000000000], "7小时后"],
		[[1439974800000, 1440000000000], "7小时前"],
		[[1439986980000, 1440000000000], "3小时前"],
		[[1439994620000, 1440000000000], "1小时前"],
		[[1439998800000, 1440000000000], "20分钟前"],
		[[1439999700000, 1440000000000], "5分钟前"],
		[[1439999755000, 1440000000000], "23小时后"],
		[[1439999974000, 1440000000000], "刚才"],
		[[1440000000000, 1440000000000], "刚才"],
		[[1440000005000, 1440000000000], "马上"],
		[[1440086400000, 1440000000000], "1天后"],
		[[1440172799000, 1440000000000], "1天后"],
		[[1440443532000, 1440000000000], "5天后"],
		[[1442592000000, 1440000000000], "30天后"]
	]);
}

/**
 * @version Alpha 0.0.101
 */
$(document).ready(function() {
	initTester();
})