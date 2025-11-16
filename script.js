// ضع هنا الـ Sheet ID الخاص بك
const sheetID = "19wd5FIe2HtnWJ0u_VF9S4Rxa6s6tMF2_NXqzZ0X3_1U"; 
const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetID}/export?format=csv`;

const stageSelect = document.getElementById("stage");
const levelSelect = document.getElementById("level");
const levelLabel = document.getElementById("levelLabel");
const searchForm = document.getElementById("searchForm");
const resultsDiv = document.getElementById("results");
const searchBtn = document.getElementById("searchBtn");

let students = [];

// تحميل بيانات Google Sheets عند فتح الصفحة
fetch(sheetURL)
    .then(res => res.text())
    .then(csv => {
        students = csvToArray(csv);
    })
    .catch(err => console.log("Error loading sheet:", err));

// تحويل CSV إلى مصفوفة من الكائنات
function csvToArray(str, delimiter = ",") {
    const lines = str.trim().split("\n");
    const headers = lines[0].split(delimiter);
    return lines.slice(1).map(line => {
        const values = line.split(delimiter);
        let obj = {};
        headers.forEach((header, i) => obj[header.trim()] = values[i].trim());
        return obj;
    });
}

// إظهار الصفوف عند اختيار المرحلة
stageSelect.addEventListener("change", () => {
    if(stageSelect.value === "ثانوي"){
        levelSelect.style.display = "inline-block";
        levelLabel.style.display = "inline-block";
    } else {
        levelSelect.style.display = "none";
        levelLabel.style.display = "none";
        searchForm.style.display = "none";
        resultsDiv.style.display = "none";
    }
});

// إظهار نموذج البحث عند اختيار الصف الأول الثانوي
levelSelect.addEventListener("change", () => {
    if(levelSelect.value === "الأول الثانوي"){
        searchForm.style.display = "block";
        resultsDiv.style.display = "none";
    } else {
        searchForm.style.display = "none";
        resultsDiv.style.display = "none";
    }
});

// البحث عن الطالب (بالاسم واسم الوالدة فقط)
searchBtn.addEventListener("click", () => {
    const name = document.getElementById("studentName").value.trim().toLowerCase();
    const mother = document.getElementById("motherName").value.trim().toLowerCase();

    if(!name || !mother){
        alert("يرجى تعبئة جميع الحقول");
        return;
    }

    const result = students.find(s =>
        s["الاسم"].trim().toLowerCase() === name &&
        s["اسم الوالدة"].trim().toLowerCase() === mother
    );

    if(result){
        const statusClass = result["الحالة"].toLowerCase() === "ناجح" ? "success" : "fail";

        resultsDiv.innerHTML = `
            <p><strong>الاسم:</strong> ${result["الاسم"]}</p>
            <p><strong>الترتيب:</strong> ${result["الترتيب"]}</p>
            <p><strong>النسبة:</strong> ${result["النسبة"]}</p>
            <p><strong>اسم الوالدة:</strong> ${result["اسم الوالدة"]}</p>
            <p><strong>الفصل:</strong> ${result["الفصل"]}</p>
            <p><strong>الحالة:</strong> <span class="${statusClass}">${result["الحالة"]}</span></p>
            <button id="printBtn">طباعة النتيجة</button>
        `;

        document.getElementById("printBtn").addEventListener("click", () => {
            const printContent = resultsDiv.innerHTML;
            const originalContent = document.body.innerHTML;
            document.body.innerHTML = printContent;
            window.print();
            document.body.innerHTML = originalContent;
            window.location.reload();
        });

    } else {
        resultsDiv.innerHTML = "<p>لا توجد نتيجة مطابقة</p>";
    }

    resultsDiv.style.display = "block";
});

