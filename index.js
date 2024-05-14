const buttons = document.querySelectorAll(".button"),
  input = document.querySelector(".input"),
  output = document.querySelector(".output"),
  save = document.querySelector(".save"),
  reminder = document.querySelector(".reminder");

var cal = "",
  outputCal = "",
  isCalculating = false;

buttons.forEach(function (current) {
  current.addEventListener("click", function () {
    calculate(current.dataset.value);
  });
});

// 저장된 값을 로드하고 화면에 표시하는 함수
function loadReminders() {
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  const reminderDiv = document.querySelector(".reminder");
  reminderDiv.innerHTML = ""; // 기존 목록을 클리어
  const basicP = document.createElement("p");
  basicP.classList.add("p-title");
  basicP.textContent = "저장된 계산식";
  reminderDiv.appendChild(basicP);
  reminders.forEach((item, index) => {
    const reminderElement = document.createElement("div");
    reminderElement.textContent = commaAdd(item.value, "add");
    reminderElement.classList.add("reminder-span");
    // 제거 버튼 추가
    const removeSpan = document.createElement("span");
    removeSpan.classList.add("remove");
    removeSpan.textContent = "x";
    removeSpan.addEventListener("click", function () {
      removeReminder(index);
    });
    reminderElement.appendChild(removeSpan);
    reminderDiv.appendChild(reminderElement);
  });
}

// 목록을 제거하는 함수
function removeReminder(index) {
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  reminders.splice(index, 1); // 해당 인덱스의 항목을 제거
  localStorage.setItem("reminders", JSON.stringify(reminders)); // 업데이트된 배열을 다시 저장
  loadReminders(); // 변경사항을 화면에 반영
}

// 저장 버튼 이벤트 리스너
save.addEventListener("click", function (e) {
  e.preventDefault();
  if (!cal && !outputCal) return;

  // localStorage에 저장
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  reminders.push({ id: Date.now(), value: cal + "=" + outputCal }); // 날짜를 고유 식별자로 사용
  localStorage.setItem("reminders", JSON.stringify(reminders));

  outputCal = commaAdd(outputCal, "remove");
  cal = outputCal;

  // 화면에 표시
  output.innerHTML = commaAdd(outputCal, "add");
  input.innerHTML = commaAdd(cal, "add");

  // 저장된 목록을 다시 로드
  loadReminders();
});

// 페이지 로드 시 저장된 목록을 로드
document.addEventListener("DOMContentLoaded", loadReminders);

document.addEventListener("keydown", function (e) {
  // 허용된 키 값 목록
  const allowedKeys = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "-",
    "*",
    "/",
    "=",
    "Enter",
    "Backspace",
    "Escape",
  ];
  const key =
    e.key === "Enter"
      ? "="
      : e.key === "Backspace"
      ? "C"
      : e.key === "Escape"
      ? "AC"
      : e.key;

  if (key === "C" || key === "AC") {
    calculate(key);
  }

  // 허용된 키인지 확인
  if (allowedKeys.includes(key)) {
    // 해당하는 버튼 찾기
    const button = Array.from(buttons).find(
      (button) => button.dataset.value === key
    );
    if (button) {
      calculate(button.dataset.value);
    }
  }
});

function commaAdd(val, action) {
  if (action === "add") {
    return val?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  } else if (action === "remove") {
    return val?.replace(/,/g, "");
  } else {
    return val;
  }
}

function calculate(value) {
  //   console.log(cal);
  //   console.log(outputCal);
  //   console.log(value);
  if (value == "=") {
    try {
      outputCal = eval(cal);
    } catch (e) {
      outputCal = "Error";
    }
  } else if (value == "AC") {
    cal = "";
    outputCal = null;
  } else if (value == "C") {
    cal = cal.substring(0, cal.length - 1);
  } else {
    if (
      /\+|-|\/|\*/.test(value) &&
      /\+|-|\/|\*$/.test(cal.slice(cal.length - 1))
    ) {
      cal = cal.slice(0, -1) + value;
    } else {
      cal += value;
    }
  }

  if (isCalculating && outputCal !== null) {
    isCalculating = false;
    try {
      const result = eval(cal);
      if (Number.isInteger(result)) {
        // 결과가 정수일 경우 소수점 없이 출력
        outputCal = result.toLocaleString(); // 쉼표 추가
      } else {
        // 결과가 소수일 경우 소수점 두 자리까지 출력 후 쉼표 추가
        outputCal = parseFloat(result.toFixed(2)).toLocaleString();
      }
    } catch (e) {
      outputCal = "";
    }
  } else {
    outputCal = "";
  }

  if (/\+|-|\/|\*/.test(cal)) {
    input.classList.add("small");
    isCalculating = true;
  } else {
    input.classList.remove("small");
  }

  output.innerHTML = commaAdd(outputCal, "add");
  input.innerHTML = commaAdd(cal, "add");
}
