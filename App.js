const reverseStr = (str) => str.split("").reverse().join("");
const isPalindrome = (str) => str === reverseStr(str);

function leapYear(year) {
  if (year % 400 === 0) {
    return true;
  }

  if (year % 100 === 0) {
    return false;
  }

  if (year % 4 === 0) return true;
  return false;
}

function dateToStr(date) {
  const dateStr = { day: "", month: "", year: "" };

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
  const ddmmyyyy = date.day + date.month + date.year;
  const mmddyyyy = date.month + date.day + date.year;
  const yyyymmdd = date.year + date.month + date.day;
  const yymmdd = date.year.slice(-2) + date.month + date.day;
  const ddmmyy = date.day + date.month + date.year.slice(-2);
  const mmddyy = date.month + date.day + date.year.slice(-2);
  return [ddmmyyyy, mmddyyyy, yyyymmdd, yymmdd, ddmmyy, mmddyy];
}

function isPalindromeAllFormats(date) {
  date = dateToStr(date);
  let dateFormatIndicator;
  let isPalindromeFlag = 0;

  const dateAllFormats = allFormats(date);
  for (let i = 0; i < dateAllFormats.length; i++) {
    if (isPalindrome(dateAllFormats[i])) {
      dateFormatIndicator = i + 1;
      isPalindromeFlag = 1;
      break;
    }
  }
  if (!isPalindromeFlag) {
    dateFormatIndicator = dateAllFormats.length - 1;
    isPalindromeFlag = 0;
  }
  return [isPalindromeFlag, dateFormatIndicator];
}

function getNextDate(date) {
  let day = date.day + 1;
  let month = date.month;
  let year = date.year;

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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
    year: year
  };
}

function getPrevDate(date) {
  let day = date.day - 1;
  let month = date.month;
  let year = date.year;

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
    year: year
  };
}

function getNearestPalindromeDate(prevDate, nextDate) {
  let counter = 0;

  while (1) {
    counter++;
    let [flag, index] = isPalindromeAllFormats(prevDate);
    // console.log(flag);
    if (flag) {
      return [counter, prevDate, index];
    }
    [flag, index] = isPalindromeAllFormats(nextDate);
    if (flag) {
      return [counter, nextDate, index];
    }
    nextDate = getNextDate(nextDate);
    prevDate = getPrevDate(prevDate);
  }
}

function printDate(index, nearDate) {
  nearDate = dateToStr(nearDate);
  switch (index) {
    case 1:
      return [
        "dd-mm-yyyy",
        `${nearDate.day}-${nearDate.month}-${nearDate.year}`
      ];
    case 2:
      return [
        "mm-dd-yyyy",
        `${nearDate.month}-${nearDate.day}-${nearDate.year}`
      ];
    case 3:
      return [
        "yyyy-mm-dd",
        `${nearDate.year}-${nearDate.month}-${nearDate.day}`
      ];
    case 4:
      return [
        "yy-mm-dd",
        `${nearDate.year.slice(-2)}-${nearDate.month}-${nearDate.day}`
      ];
    case 5:
      return [
        "dd-mm-yy",
        `${nearDate.day}-${nearDate.month}-${nearDate.year.slice(-2)}`
      ];
    case 6:
      return [
        "mm-dd-yy",
        `${nearDate.month.slice(-2)}-${nearDate.day}-${nearDate.year}`
      ];
    default:
      return "";
  }
}
const dateInput = document.querySelector("#date-input");
const submitBtn = document.querySelector("#submit-btn");
const output = document.querySelector("#output");

function checkBirthday() {
  let bdayStr = dateInput.value;

  if (bdayStr !== "") {
    const listOfDate = bdayStr.split("-");

    const date = {
      day: Number(listOfDate[2]),
      month: Number(listOfDate[1]),
      year: Number(listOfDate[0])
    };
    const prevDate = getPrevDate(date);
    const nextDate = getNextDate(date);

    const is_Palindrome = isPalindromeAllFormats(date);
    if (is_Palindrome[0]) {
      output.innerText = "Yay! your birthday is a palindrome!! 🥳🥳";
    } else {
      const [ctr, nearDate, index] = getNearestPalindromeDate(
        prevDate,
        nextDate
      );
      const [result1, result2] = printDate(index, nearDate);
      output.innerText = `The next palindrome date is ${result2} (${result1}). You missed it by ${ctr} days! 😔`;
    }
  }
}
function clickHandler() {
  if (dateInput.value === "") {
    output.innerText = "Please choose a date";
  } else {
    output.innerHTML = `<img id="image" src="/img/loading.gif">`;
    setTimeout(checkBirthday, 1500);
  }
}

submitBtn.addEventListener("click", clickHandler);
