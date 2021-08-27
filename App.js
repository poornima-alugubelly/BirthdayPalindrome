function reverseStr(str) {
	return str.split("").reverse().join("");
}

function isPalindrome(str) {
	if (str === reverseStr(str)) {
		return true;
	}
	return false;
}

function leapYear(year) {
	if (year % 400 === 0) {
		return true;
	}

	if (year % 100 === 0) {
		return false;
	}

	if (year % 4 == 0) return true;
	return false;
}

function dateToStr(date) {
	var dateStr = { day: "", month: "", year: "" };

	if (date.day < 10) {
		dateStr.day = "0" + date.day;
	} else {
		dateStr.day = date.day.toString();
	}

	if (date.month < 10) {
		dateStr.month = "0" + date.month;
	} else {
		dateStr.month = date.month.toString();
	}

	dateStr.year = date.year.toString();

	return dateStr;
}

function allFormats(date) {
	var ddmmyyyy = date.day + date.month + date.year;
	var mmddyyyy = date.month + date.day + date.year;
	var yyyymmdd = date.year + date.month + date.day;
	var yymmdd = date.year.slice(-2) + date.month + date.day;
	var ddmmyy = date.day + date.month + date.year.slice(-2);
	var mmddyy = date.month + date.day + date.year.slice(-2);
	return [ddmmyyyy, mmddyyyy, yyyymmdd, yymmdd, ddmmyy, mmddyy];
}

function isPalindromeAllFormats(date) {
	date = dateToStr(date);
	var dateAllFormats = allFormats(date);
	for (var i = 0; i < dateAllFormats.length; i++) {
		if (isPalindrome(dateAllFormats[i])) {
			return [1, i + 1];
		}
	}
	return [0, i];
}

function getNextDate(date) {
	var day = date.day + 1;
	var month = date.month;
	var year = date.year;

	var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if (month === 2) {
		if (leapYear(year)) {
			if (day > 29) {
				day = 1;
				month++;
			}
		} else {
			if (day > 28) {
				day = 1;
				month++;
			}
		}
	} else {
		if (day > daysInMonth[month - 1]) {
			day = 1;
			month++;
		}
	}

	if (month > 12) {
		month = 1;
		year++;
	}

	return {
		day: day,
		month: month,
		year: year,
	};
}

function getPrevDate(date) {
	var day = date.day - 1;
	var month = date.month;
	var year = date.year;

	var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if (month === 3) {
		if (leapYear(year)) {
			if (day === 0) {
				day = 29;
				month--;
			}
		} else {
			if (day === 0) {
				day = 28;
				month--;
			}
		}
	} else {
		if (day === 0 && month === 1) {
			day = 31;
			month = 12;
			year--;
		} else {
			if (day === 0) {
				month--;
				day = daysInMonth[month - 1];
			}
		}
	}

	return {
		day: day,
		month: month,
		year: year,
	};
}

function getNearestPalindromeDate(date) {
	var counter = 0;
	var prevDate = getPrevDate(date);
	var nextDate = getNextDate(date);

	while (1) {
		counter++;
		var [flag, index] = isPalindromeAllFormats(prevDate);
		// console.log(flag);
		if (flag) {
			return [counter, prevDate, index];
		}
		var [flag, index] = isPalindromeAllFormats(nextDate);
		if (flag) {
			return [counter, nextDate, index];
		}
		nextDate = getNextDate(nextDate);
		prevDate = getPrevDate(prevDate);
	}
}

function printDate(index, nextDate) {
	nextDate = dateToStr(nextDate);
	if (index === 1) {
		return ["dd-mm-yyyy", `${nextDate.day}-${nextDate.month}-${nextDate.year}`];
	}
	if (index === 2) {
		return ["mm-dd-yyyy", `${nextDate.month}-${nextDate.day}-${nextDate.year}`];
	}
	if (index === 3) {
		return ["yyyy-mm-dd", `${nextDate.year}-${nextDate.month}-${nextDate.day}`];
	}
	if (index === 4) {
		return [
			"yy-mm-dd",
			`${nextDate.year.slice(-2)}-${nextDate.month}-${nextDate.day}`,
		];
	}
	if (index === 5) {
		return [
			"dd-mm-yy",
			`${nextDate.day}-${nextDate.month}-${nextDate.year.slice(-2)}`,
		];
	}
	if (index === 6) {
		return [
			"mm-dd-yy",
			`${nextDate.month.slice(-2)}-${nextDate.day}-${nextDate.year}`,
		];
	}
}
var dateInput = document.querySelector("#date-input");
var submitBtn = document.querySelector("#submit-btn");
var output = document.querySelector("#output");

function checkBirthday() {
	var bdayStr = dateInput.value;

	if (bdayStr !== "") {
		var listOfDate = bdayStr.split("-");

		var date = {
			day: Number(listOfDate[2]),
			month: Number(listOfDate[1]),
			year: Number(listOfDate[0]),
		};

		var is_Palindrome = isPalindromeAllFormats(date);
		if (is_Palindrome[0]) {
			output.innerText = "Yay! your birthday is a palindrome!! 🥳🥳";
		} else {
			[ctr, nextDate, index] = getNearestPalindromeDate(date);
			[result1, result2] = printDate(index, nextDate);
			output.innerText = `The next palindrome date is ${result2} (${result1}). You missed it by ${ctr} days! 😔`;
		}
	}
}
function clickHandler() {
	if (dateInput.value == "") {
		output.innerText = "Please choose a date";
	} else {
		output.innerHTML = `<img id="image" src="/img/loading.gif">`;
		setTimeout(checkBirthday, 1500);
	}
}

submitBtn.addEventListener("click", clickHandler);
