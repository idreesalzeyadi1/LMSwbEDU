/* =============================================
   EDUACADEMY — script.js
   Teachers data, cards, search, filter, modal
   ============================================= */

/* =============================================
   1. TEACHERS DATA
   ============================================= */
const teachers = [
  {
    id: 1, initials: "AK", name: "Ahmed Khan",
    subject: "Mathematics", grades: ["Matric","O-Level","A-Level"],
    type: ["Online","Home"], experience: 10, students: 120,
    fee: "Rs.2,000", rating: "4.9", stars: "★★★★★", status: "online",
    bio: "10 saal se O-Level aur A-Level Math parha raha hun. Cambridge board specialist. Demo class bilkul free hai.",
    review: '"Bohot achi tarah samjhate hain, mera result A* aa gaya" — Ali R.',
    avatarColor: "#EEEDFE", avatarText: "#3C3489"
  },
  {
    id: 2, initials: "SF", name: "Sara Fatima",
    subject: "English", grades: ["Primary","Matric","O-Level"],
    type: ["Online","Home"], experience: 7, students: 85,
    fee: "Rs.1,500", rating: "4.8", stars: "★★★★★", status: "busy",
    bio: "7 saal se English Grammar, Composition aur Literature parha rahi hun. Interactive aur fun style mein.",
    review: '"Sara ma\'am ki wajah se meri English bohot improve hui" — Hina S.',
    avatarColor: "#E1F5EE", avatarText: "#085041"
  },
  {
    id: 3, initials: "RA", name: "Rizwan Ali",
    subject: "Physics", grades: ["Matric","O-Level","A-Level"],
    type: ["Online"], experience: 12, students: 200,
    fee: "Rs.2,500", rating: "4.9", stars: "★★★★★", status: "online",
    bio: "12 saal se Physics parha raha hun. Real life examples se explain karta hun. ECAT specialist.",
    review: '"Rizwan sir ne Physics ko bohot aasan bana diya" — Umar F.',
    avatarColor: "#EEEDFE", avatarText: "#3C3489"
  },
  {
    id: 4, initials: "NB", name: "Nadia Baig",
    subject: "Chemistry", grades: ["Matric","O-Level"],
    type: ["Home","Online"], experience: 6, students: 60,
    fee: "Rs.1,800", rating: "4.7", stars: "★★★★☆", status: "online",
    bio: "Chemistry ko bohot log mushkil samjhte hain lekin meri teaching se sab clear ho jata hai.",
    review: '"Nadia ma\'am ki wajah se mera Chemistry ka fear khatam ho gaya" — Zara K.',
    avatarColor: "#E1F5EE", avatarText: "#085041"
  },
  {
    id: 5, initials: "TH", name: "Tariq Hassan",
    subject: "Mathematics", grades: ["Primary","Matric"],
    type: ["Home"], experience: 5, students: 45,
    fee: "Rs.1,200", rating: "4.6", stars: "★★★★☆", status: "online",
    bio: "Primary aur Matric level ke liye Math. Bunyadi concepts strong karta hun pehle.",
    review: '"Mera beta jo Math se darta tha, ab interest lene laga hai" — Parent',
    avatarColor: "#FAEEDA", avatarText: "#633806"
  },
  {
    id: 6, initials: "AM", name: "Ayesha Malik",
    subject: "Biology", grades: ["Matric","O-Level"],
    type: ["Online","Home"], experience: 8, students: 95,
    fee: "Rs.1,700", rating: "4.8", stars: "★★★★★", status: "busy",
    bio: "Biology ko diagrams aur visual methods se explain karti hun. MCAT preparation mein bhi help karti hun.",
    review: '"Ayesha ma\'am ke notes sabse best hain" — Fatima A.',
    avatarColor: "#EEEDFE", avatarText: "#3C3489"
  }
];

/* =============================================
   2. CURRENTLY OPEN TEACHER ID
   ============================================= */
let currentTeacherId = null;

/* =============================================
   3. PAGE LOAD
   ============================================= */
document.addEventListener("DOMContentLoaded", function () {
  renderTeachers(teachers);

  // Hero search enter key
  const searchInput = document.getElementById("heroSearch");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") doSearch();
    });
  }
});

/* =============================================
   4. TEACHER CARDS RENDER KARNA
   ============================================= */
function renderTeachers(list) {
  const grid      = document.getElementById("teachersGrid");
  const noResults = document.getElementById("noResults");
  if (!grid) return;

  grid.innerHTML = "";

  if (list.length === 0) {
    if (noResults) noResults.style.display = "block";
    return;
  }
  if (noResults) noResults.style.display = "none";

  list.forEach(function (teacher, index) {
    const gradeTags = teacher.grades.map(g => `<span class="tag tag-purple">${g}</span>`).join("");
    const typeTags  = teacher.type.map(t => `<span class="tag tag-teal">${t}</span>`).join("");

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
      <button class="card-btn" onclick="openProfile(${teacher.id})">View Profile</button>
    `;
    grid.appendChild(card);
  });
}

/* =============================================
   5. SEARCH
   ============================================= */
function doSearch() {
  const query = (document.getElementById("heroSearch").value || "").toLowerCase().trim();
  if (!query) { renderTeachers(teachers); return; }

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(query) ||
    t.subject.toLowerCase().includes(query) ||
    t.grades.some(g => g.toLowerCase().includes(query)) ||
    t.type.some(tp => tp.toLowerCase().includes(query))
  );

  renderTeachers(filtered);
  const teacherSection = document.getElementById("teachers");
  if (teacherSection) teacherSection.scrollIntoView({ behavior: "smooth" });
}

/* =============================================
   6. FILTER BY TAG
   ============================================= */
function filterByTag(tag) {
  const filtered = teachers.filter(t =>
    t.grades.includes(tag) || t.type.includes(tag) || t.subject === tag
  );
  renderTeachers(filtered);
  const teacherSection = document.getElementById("teachers");
  if (teacherSection) teacherSection.scrollIntoView({ behavior: "smooth" });
}

/* =============================================
   7. DROPDOWN FILTERS
   ============================================= */
function applyFilters() {
  const subject = document.getElementById("filterSubject").value;
  const grade   = document.getElementById("filterGrade").value;
  const type    = document.getElementById("filterType").value;

  const filtered = teachers.filter(t => {
    const matchSubject = !subject || t.subject === subject;
    const matchGrade   = !grade   || t.grades.includes(grade);
    const matchType    = !type    || t.type.includes(type);
    return matchSubject && matchGrade && matchType;
  });
  renderTeachers(filtered);
}

function resetFilters() {
  document.getElementById("filterSubject").value = "";
  document.getElementById("filterGrade").value   = "";
  document.getElementById("filterType").value    = "";
  if (document.getElementById("heroSearch"))
    document.getElementById("heroSearch").value  = "";
  renderTeachers(teachers);
}

/* =============================================
   8. PROFILE MODAL OPEN
   ============================================= */
function openProfile(teacherId) {
  const teacher = teachers.find(t => t.id === teacherId);
  if (!teacher) return;

  currentTeacherId = teacherId;

  document.getElementById("modalAvatar").textContent        = teacher.initials;
  document.getElementById("modalAvatar").style.background   = teacher.avatarColor;
  document.getElementById("modalAvatar").style.color        = teacher.avatarText;
  document.getElementById("modalName").textContent          = teacher.name;
  document.getElementById("modalSubjectGrade").textContent  = teacher.subject + " · " + teacher.grades.join(" · ");
  document.getElementById("modalRating").textContent        = teacher.stars + " " + teacher.rating + " · " + teacher.students + " students";
  document.getElementById("modalExp").textContent           = teacher.experience;
  document.getElementById("modalStudents").textContent      = teacher.students;
  document.getElementById("modalFee").textContent           = teacher.fee;
  document.getElementById("modalBio").textContent           = teacher.bio;
  document.getElementById("modalReview").textContent        = teacher.review;

  const statusEl = document.getElementById("modalStatus");
  if (teacher.status === "online") {
    statusEl.innerHTML    = `<span class="online-dot"></span> Available`;
    statusEl.style.color  = "var(--teal-600)";
  } else {
    statusEl.textContent  = "Busy";
    statusEl.style.color  = "var(--gray-400)";
  }

  const tagsContainer = document.getElementById("modalTags");
  tagsContainer.innerHTML = "";
  teacher.grades.forEach(g => {
    const span = document.createElement("span");
    span.className = "tag tag-purple";
    span.textContent = g;
    tagsContainer.appendChild(span);
  });
  teacher.type.forEach(tp => {
    const span = document.createElement("span");
    span.className = "tag tag-teal";
    span.textContent = tp;
    tagsContainer.appendChild(span);
  });

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

/* =============================================
   9. MODAL CLOSE
   ============================================= */
function closeModalBtn() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function closeModal(event) {
  if (event.target === document.getElementById("modalOverlay")) closeModalBtn();
}

/* =============================================
   10. DEMO BOOK BUTTON — LOGIN CHECK
   auth.js ka requireLoginForEnroll use karta hai
   ============================================= */
function handleDemoBook() {
  if (!requireLoginForEnroll()) return; // auth.js mein defined hai
  openEnrollFromModal();
}

/* =============================================
   11. ENROLL FROM MODAL
   Modal band karo, form mein teacher set karo
   ============================================= */
function openEnrollFromModal() {
  const teacher = teachers.find(t => t.id === currentTeacherId);
  closeModalBtn();

  if (teacher) {
    const formTeacher = document.getElementById("formTeacherName");
    if (formTeacher) formTeacher.textContent = "Teacher: " + teacher.name + " — " + teacher.subject;
  }

  const enrollSection = document.getElementById("enroll");
  if (enrollSection) enrollSection.scrollIntoView({ behavior: "smooth" });
}

/* =============================================
   12. FORM SUBMIT
   ============================================= */
function submitForm(event) {
  event.preventDefault();

  const name  = document.getElementById("studentName").value.trim();
  const phone = document.getElementById("studentPhone").value.trim();

  if (!name || !phone) {
    alert("Name and phone number are required!");
    return;
  }

  const teacher = teachers.find(t => t.id === currentTeacherId);

  // auth.js ka saveEnrollment call karo
  if (typeof saveEnrollment === "function") {
    saveEnrollment({
      teacherName:     teacher ? teacher.name     : "Unknown Teacher",
      teacherInitials: teacher ? teacher.initials : "?",
      subject:         teacher ? teacher.subject  : "",
      classType:       document.getElementById("classType").value,
      preferredTime:   document.getElementById("preferredTime").value,
      message:         document.getElementById("studentMessage").value,
    });
  }

  document.getElementById("enrollForm").style.display  = "none";
  document.getElementById("successMsg").style.display  = "block";
}