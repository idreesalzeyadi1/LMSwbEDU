/* =============================================
   EDUACADEMY — script.js
   Teachers Firestore se fetch hote hain
   ============================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAN2slfT95-HBcd6agX-KjqMWnNBIw8GNU",
  authDomain:        "eduacademy-c3c75.firebaseapp.com",
  projectId:         "eduacademy-c3c75",
  storageBucket:     "eduacademy-c3c75.firebasestorage.app",
  messagingSenderId: "224117270680",
  appId:             "1:224117270680:web:60f1b950cf2af3705cc8ed"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* =============================================
   AVATAR COLORS — subject ke hisaab se
   ============================================= */
const avatarColors = {
  "Mathematics": { bg: "#EEEDFE", text: "#3C3489" },
  "Physics":     { bg: "#EEEDFE", text: "#3C3489" },
  "English":     { bg: "#E1F5EE", text: "#085041" },
  "Chemistry":   { bg: "#E1F5EE", text: "#085041" },
  "Biology":     { bg: "#EEEDFE", text: "#3C3489" },
  "Urdu":        { bg: "#FAEEDA", text: "#633806" },
  "default":     { bg: "#F3F3F3", text: "#333333" }
};

function getAvatarColor(subject) {
  return avatarColors[subject] || avatarColors["default"];
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

/* =============================================
   TEACHERS ARRAY — Firestore se fill hoga
   ============================================= */
let teachers = [];
let currentTeacherId = null;

/* =============================================
   FIRESTORE SE TEACHERS FETCH KARO
   ============================================= */
async function fetchTeachers() {
  try {
    const snapshot = await getDocs(collection(db, "teachers"));
    teachers = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const colors = getAvatarColor(data.subject);

      teachers.push({
        id:          doc.id,
        initials:    data.initials    || getInitials(data.name),
        name:        data.name        || "Unknown",
        subject:     data.subject     || "",
        grades:      data.grades      || [],
        type:        data.type        || [],
        experience:  data.experience  || 0,
        students:    data.students    || 0,
        fee:         data.fee         || "Rs.0",
        rating:      data.rating      ? String(data.rating) : "4.5",
        stars:       data.stars       || "★★★★☆",
        status:      data.status      || "online",
        bio:         data.bio         || "",
        review:      data.review      || "",
        avatarColor: data.avatarColor || colors.bg,
        avatarText:  data.avatarText  || colors.text,
      });
    });

    return teachers;
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return [];
  }
}

/* =============================================
   PAGE LOAD
   ============================================= */
document.addEventListener("DOMContentLoaded", async function () {
  const grid = document.getElementById("teachersGrid");
  if (grid) grid.innerHTML = `<p style="text-align:center;color:#999;padding:2rem;grid-column:1/-1;">Teachers loading...</p>`;

  await fetchTeachers();
  renderTeachers(teachers);

  if (document.getElementById("teacherList")) {
    renderTeachersList();
  }

  const searchInput = document.getElementById("heroSearch");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") doSearch();
    });
  }
});

/* =============================================
   TEACHER CARDS RENDER — index.html
   ============================================= */
function renderTeachers(list) {
  const grid      = document.getElementById("teachersGrid");
  const noResults = document.getElementById("noResults");
  if (!grid) return;

  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = `<p style="text-align:center;color:#999;padding:2rem;grid-column:1/-1;">No teachers found </p>`;
    if (noResults) noResults.style.display = "block";
    return;
  }
  if (noResults) noResults.style.display = "none";

  list.forEach(function (teacher, index) {
    const gradeTags = (teacher.grades || []).map(g => `<span class="tag tag-purple">${g}</span>`).join("");
    const typeTags  = (teacher.type   || []).map(t => `<span class="tag tag-teal">${t}</span>`).join("");

    const statusHTML = teacher.status === "online"
      ? `<span class="online-dot"></span><span class="status-online">Available</span>`
      : `<span class="status-busy">Busy</span>`;

    const card = document.createElement("div");
    card.className = "teacher-card";
    card.style.animationDelay = (index * 0.07) + "s";
    card.innerHTML = `
      <div class="card-top">
        <div class="card-avatar" style="background:${teacher.avatarColor};color:${teacher.avatarText};">
          ${teacher.initials}
        </div>
        <div>
          <div class="card-name">${teacher.name}</div>
          <div class="card-subject">${teacher.subject}</div>
        </div>
        <div class="card-status">${statusHTML}</div>
      </div>
      <div class="card-rating">${teacher.stars} ${teacher.rating}</div>
      <div class="card-detail">
        <span>${teacher.experience} yrs exp</span> · <span>${teacher.fee}/hr</span> · <span>${teacher.students} students</span>
      </div>
      <div class="card-tags">${gradeTags}${typeTags}</div>
      <button class="card-btn" onclick="openProfile('${teacher.id}')">View Profile</button>
    `;
    grid.appendChild(card);
  });
}

/* =============================================
   TEACHER LIST RENDER — teachers.html
   ============================================= */
let visibleCount = 3;
let currentData  = [];

function renderTeachersList() {
  currentData = [...teachers];
  renderList();
}

function renderList() {
  const container  = document.getElementById("teacherList");
  const btn        = document.getElementById("seeMoreBtn");
  const countSpan  = document.querySelector("#resultsCount span");
  if (!container) return;

  container.innerHTML = "";
  if (countSpan) countSpan.textContent = currentData.length;

  currentData.slice(0, visibleCount).forEach(t => {
    const row = document.createElement("div");
    row.className = "teacher-row";
    row.innerHTML = `
      <div class="tr-avatar" style="background:${t.avatarColor};color:${t.avatarText};">${t.initials}</div>
      <div class="tr-info">
        <div class="tr-name">${t.name}</div>
        <div class="tr-subject">${t.subject}</div>
      </div>
      <div class="tr-stats">
        <div class="tr-rating">${t.stars} ${t.rating}</div>
        <div class="tr-fee">${t.fee}/hr</div>
      </div>
      <a class="tr-btn" href="enroll.html?teacher=${encodeURIComponent(t.name)}&subject=${encodeURIComponent(t.subject)}">Book Demo</a>
    `;
    container.appendChild(row);
  });

  if (btn) btn.style.display = visibleCount < currentData.length ? "inline-block" : "none";
}

function loadMore() {
  visibleCount += 3;
  renderList();
}

/* =============================================
   SEARCH
   ============================================= */
function doSearch() {
  const query = (document.getElementById("heroSearch")?.value || "").toLowerCase().trim();
  if (!query) { renderTeachers(teachers); return; }

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(query) ||
    t.subject.toLowerCase().includes(query) ||
    (t.grades || []).some(g => g.toLowerCase().includes(query)) ||
    (t.type   || []).some(tp => tp.toLowerCase().includes(query))
  );

  renderTeachers(filtered);
  document.getElementById("teachers")?.scrollIntoView({ behavior: "smooth" });
}

function filterByTag(tag) {
  const filtered = teachers.filter(t =>
    (t.grades || []).includes(tag) ||
    (t.type   || []).includes(tag) ||
    t.subject === tag
  );
  renderTeachers(filtered);
  document.getElementById("teachers")?.scrollIntoView({ behavior: "smooth" });
}

function applyFilters() {
  const subject = document.getElementById("filterSubject")?.value || "";
  const grade   = document.getElementById("filterGrade")?.value   || "";
  const type    = document.getElementById("filterType")?.value    || "";

  if (document.getElementById("teacherList")) {
    currentData = teachers.filter(t => !subject || t.subject === subject);
    visibleCount = 3;
    renderList();
    return;
  }

  const filtered = teachers.filter(t => {
    const matchSubject = !subject || t.subject === subject;
    const matchGrade   = !grade   || (t.grades || []).includes(grade);
    const matchType    = !type    || (t.type   || []).includes(type);
    return matchSubject && matchGrade && matchType;
  });
  renderTeachers(filtered);
}

function resetFilters() {
  ["filterSubject","filterGrade","filterType","heroSearch"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  if (document.getElementById("teacherList")) {
    currentData  = [...teachers];
    visibleCount = 3;
    renderList();
  } else {
    renderTeachers(teachers);
  }
}

/* =============================================
   PROFILE MODAL
   ============================================= */
function openProfile(teacherId) {
  const teacher = teachers.find(t => t.id === teacherId);
  if (!teacher) return;

  currentTeacherId = teacherId;

  document.getElementById("modalAvatar").textContent       = teacher.initials;
  document.getElementById("modalAvatar").style.background  = teacher.avatarColor;
  document.getElementById("modalAvatar").style.color       = teacher.avatarText;
  document.getElementById("modalName").textContent         = teacher.name;
  document.getElementById("modalSubjectGrade").textContent = teacher.subject + " · " + (teacher.grades || []).join(" · ");
  document.getElementById("modalRating").textContent       = teacher.stars + " " + teacher.rating + " · " + teacher.students + " students";
  document.getElementById("modalExp").textContent          = teacher.experience;
  document.getElementById("modalStudents").textContent     = teacher.students;
  document.getElementById("modalFee").textContent          = teacher.fee;
  document.getElementById("modalBio").textContent          = teacher.bio;
  document.getElementById("modalReview").textContent       = teacher.review;

  const statusEl = document.getElementById("modalStatus");
  if (teacher.status === "online") {
    statusEl.innerHTML   = `<span class="online-dot"></span> Available`;
    statusEl.style.color = "var(--teal-600)";
  } else {
    statusEl.textContent = "Busy";
    statusEl.style.color = "var(--gray-400)";
  }

  const tagsContainer = document.getElementById("modalTags");
  tagsContainer.innerHTML = "";
  (teacher.grades || []).forEach(g => {
    const span = document.createElement("span");
    span.className = "tag tag-purple"; span.textContent = g;
    tagsContainer.appendChild(span);
  });
  (teacher.type || []).forEach(tp => {
    const span = document.createElement("span");
    span.className = "tag tag-teal"; span.textContent = tp;
    tagsContainer.appendChild(span);
  });

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModalBtn() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function closeModal(event) {
  if (event.target === document.getElementById("modalOverlay")) closeModalBtn();
}

function openEnrollFromModal() {
  const teacher = teachers.find(t => t.id === currentTeacherId);
  closeModalBtn();
  if (teacher) {
    const formTeacher = document.getElementById("formTeacherName");
    if (formTeacher) formTeacher.textContent = "Teacher: " + teacher.name + " — " + teacher.subject;
  }
  document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" });
}

/* =============================================
   FORM SUBMIT
   ============================================= */
function submitForm(event) {
  event.preventDefault();
  const name  = document.getElementById("studentName").value.trim();
  const phone = document.getElementById("studentPhone").value.trim();
  if (!name || !phone) { alert("Name and phone number are required!"); return; }

  const teacher = teachers.find(t => t.id === currentTeacherId);
  if (typeof window.saveEnrollment === "function") {
    window.saveEnrollment({
      teacherName:     teacher ? teacher.name     : "Unknown Teacher",
      teacherInitials: teacher ? teacher.initials : "?",
      subject:         teacher ? teacher.subject  : "",
      classType:       document.getElementById("classType")?.value      || "",
      preferredTime:   document.getElementById("preferredTime")?.value  || "",
      message:         document.getElementById("studentMessage")?.value || "",
    });
  }
  document.getElementById("enrollForm").style.display = "none";
  document.getElementById("successMsg").style.display = "block";
}

/* =============================================
   GLOBAL EXPORTS
   ============================================= */
window.doSearch            = doSearch;
window.filterByTag         = filterByTag;
window.applyFilters        = applyFilters;
window.resetFilters        = resetFilters;
window.openProfile         = openProfile;
window.closeModalBtn       = closeModalBtn;
window.closeModal          = closeModal;
window.openEnrollFromModal = openEnrollFromModal;
window.submitForm          = submitForm;
window.loadMore            = loadMore;