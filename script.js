/* =============================================
   EDUACADEMY — script.js
   Sab website ki functionality yahan hai
   ============================================= */

/* =============================================
   1. TEACHERS DATA
   Yahan tamam teachers ki info stored hai
   Baad mein aap isko apne real teachers se
   replace kar sakte hain
   ============================================= */
const teachers = [
  {
    id: 1,
    initials: "AK",
    name: "Awais Khan",
    subject: "Mathematics",
    grades: ["Matric", "O-Level", "A-Level"],
    type: ["Online", "Home"],
    experience: 10,
    students: 20,
    fee: "Rs.2,000",
    rating: "4.9",
    stars: "★★★★★",
    status: "online",
    bio: "10 saal se O-Level aur A-Level Math parha raha hun. Cambridge board specialist hun. Mera teaching style interactive hai — problems ko step by step solve karta hun taake concept clear ho jaye. Demo class bilkul free hai.",
    review: '"Bohot achi tarah samjhate hain, mera result A* aa gaya" — Ali R.',
    avatarColor: "#EEEDFE",
    avatarText: "#3C3489"
  },
  {
    id: 2,
    initials: "SF",
    name: "Sara Fatima",
    subject: "English",
    grades: ["Primary", "Matric", "O-Level"],
    type: ["Online", "Home"],
    experience: 7,
    students: 85,
    fee: "Rs.1,500",
    rating: "4.8",
    stars: "★★★★★",
    status: "busy",
    bio: "7 saal se English Grammar, Composition aur Literature parha rahi hun. Bacchon ko English bolna aur likhna sikhati hun ek fun aur interactive tareeqe se.",
    review: '"Sara ma\'am ki wajah se meri English bohot improve hui" — Hina S.',
    avatarColor: "#E1F5EE",
    avatarText: "#085041"
  },
  {
    id: 3,
    initials: "RA",
    name: "Rizwan Ali",
    subject: "Physics",
    grades: ["Matric", "O-Level", "A-Level"],
    type: ["Online"],
    experience: 12,
    students: 200,
    fee: "Rs.2,500",
    rating: "4.9",
    stars: "★★★★★",
    status: "online",
    bio: "12 saal se Physics parha raha hun. Concepts ko real life examples se explain karta hun. ECAT aur A-Level Physics mein specialization hai. Abhi tak 200 se zyada students ko guide kar chuka hun.",
    review: '"Rizwan sir ne Physics ko mujhe bohot aasan bana diya" — Umar F.',
    avatarColor: "#EEEDFE",
    avatarText: "#3C3489"
  },
  
  {
    id: 5,
    initials: "TH",
    name: "Tariq Hassan",
    subject: "Mathematics",
    grades: ["Primary", "Matric"],
    type: ["Home"],
    experience: 5,
    students: 45,
    fee: "Rs.1,200",
    rating: "4.6",
    stars: "★★★★☆",
    status: "online",
    bio: "Primary aur Matric level ke students ke liye Math parha raha hun. Bunyadi concepts pehle strong karta hun, phir advanced topics. Patience ke saath har student ko samajhta hun.",
    review: '"Mera beta jo Math se darta tha, ab interest lene laga hai" — Parent',
    avatarColor: "#FAEEDA",
    avatarText: "#633806"
  },
  {
    id: 6,
    initials: "AM",
    name: "Ayesha Malik",
    subject: "Biology",
    grades: ["Matric", "O-Level"],
    type: ["Online", "Home"],
    experience: 8,
    students: 95,
    fee: "Rs.1,700",
    rating: "4.8",
    stars: "★★★★★",
    status: "busy",
    bio: "Biology ko diagrams aur visual methods se explain karti hun. MCAT preparation mein bhi help karti hun. Online classes Zoom pe hoti hain.",
    review: '"Ayesha ma\'am ke notes sabse best hain" — Fatima A.',
    avatarColor: "#EEEDFE",
    avatarText: "#3C3489"
  },
  {
  id: 7,
  initials: "MK",
  name: "Muhammad Idrees",
  subject: "Computer Science",
  grades: ["Matric", "Intermediate", "BS"],
  type: ["Online"],
  experience: 5,
  students: 50,
  fee: "Rs.1,500",
  rating: "5.0",
  stars: "★★★★★",
  status: "online",
  bio: "IT Instructor aur web developer hun. Coding ko aasan tareeqe se sikhata hun.",
  review: '"Kamran sir ka samjhane ka tarika bohot alag aur acha hai" — Bilal X.',
  avatarColor: "#E1F5EE",
  avatarText: "#085041"
}
];

/* =============================================
   2. PAGE LOAD — Sab kuch initialize karo
   ============================================= */
document.addEventListener("DOMContentLoaded", function () {

  // Teachers grid render karo
  renderTeachers(teachers);

  // Navbar scroll effect lagao
  initNavbar();

  // Hero search pe Enter key kaam kare
  document.getElementById("heroSearch").addEventListener("keypress", function (e) {
    if (e.key === "Enter") doSearch();
  });
});

/* =============================================
   3. TEACHER CARDS RENDER KARNA
   teachers array se HTML cards banana (Limit: 6)
   ============================================= */
function renderTeachers(list) {
  const grid = document.getElementById("teachersGrid");
  const noResults = document.getElementById("noResults");

  // Grid clear karo
  grid.innerHTML = "";

  // Agar koi teacher nahi mila
  if (list.length === 0) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  // --- UPDATE: Sirf pehle 6 teachers ka slice lena ---
  // Is se original 'list' kharab nahi hogi, sirf display 6 honge
  const limitedList = list.slice(0, 6);

  // Ab 'list' ki jagah 'limitedList' par loop chalayein
  limitedList.forEach(function (teacher, index) {

    // Tags HTML banana
    const gradeTags = teacher.grades
      .map(g => `<span class="tag tag-purple">${g}</span>`)
      .join("");

    const typeTags = teacher.type
      .map(t => `<span class="tag tag-teal">${t}</span>`)
      .join("");

    // Online/Busy status
    const statusHTML = teacher.status === "online"
      ? `<span class="online-dot"></span><span class="status-online">Available</span>`
      : `<span class="status-busy">Offline</span>`;

    // Card HTML
    const card = document.createElement("div");
    card.className = "teacher-card";
    card.style.animationDelay = (index * 0.07) + "s";

    card.innerHTML = `
      <div class="card-top">
        <div class="card-avatar" style="background:${teacher.avatarColor}; color:${teacher.avatarText};">
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
        <span>${teacher.experience} saal exp.</span>
        <span>·</span>
        <span>${teacher.fee}/hr</span>
        <span>·</span>
        <span>${teacher.students} students</span>
      </div>

      <div class="card-tags">
        ${gradeTags}
        ${typeTags}
      </div>

      <button class="card-btn" onclick="openProfile(${teacher.id})">
        View Teacher Profile
      </button>
    `;

    grid.appendChild(card);
  });
}
/* =============================================
   4. SEARCH FUNCTION
   Hero search bar se teachers dhundna
   ============================================= */
function doSearch() {
  const query = document.getElementById("heroSearch").value.toLowerCase().trim();

  if (!query) {
    renderTeachers(teachers);
    return;
  }

  // Subject, name ya grade mein search karo
  const filtered = teachers.filter(function (t) {
    return (
      t.name.toLowerCase().includes(query) ||
      t.subject.toLowerCase().includes(query) ||
      t.grades.some(g => g.toLowerCase().includes(query)) ||
      t.type.some(tp => tp.toLowerCase().includes(query))
    );
  });

  renderTeachers(filtered);

  // Teacher section pe scroll karo
  document.getElementById("teachers").scrollIntoView({ behavior: "smooth" });
}

/* =============================================
   5. FILTER BY TAG — Hero section ke tags
   Tag click pe filter apply karo
   ============================================= */
function filterByTag(tag) {
  const filtered = teachers.filter(function (t) {
    return (
      t.grades.includes(tag) ||
      t.type.includes(tag) ||
      t.subject === tag
    );
  });

  renderTeachers(filtered);

  // Teacher section pe scroll karo
  document.getElementById("teachers").scrollIntoView({ behavior: "smooth" });
}

/* =============================================
   6. APPLY FILTERS — Dropdown filters
   Subject, grade, type se filter karo
   ============================================= */
function applyFilters() {
  const subject = document.getElementById("filterSubject").value;
  const grade   = document.getElementById("filterGrade").value;
  const type    = document.getElementById("filterType").value;

  const filtered = teachers.filter(function (t) {
    const matchSubject = !subject || t.subject === subject;
    const matchGrade   = !grade   || t.grades.includes(grade);
    const matchType    = !type    || t.type.includes(type);
    return matchSubject && matchGrade && matchType;
  });

  renderTeachers(filtered);
}

/* =============================================
   7. RESET FILTERS — Sab filters clear karo
   ============================================= */
function resetFilters() {
  document.getElementById("filterSubject").value = "";
  document.getElementById("filterGrade").value   = "";
  document.getElementById("filterType").value    = "";
  document.getElementById("heroSearch").value    = "";
  renderTeachers(teachers);
}

/* =============================================
   8. TEACHER PROFILE MODAL OPEN
   Card ka "Profile Dekhein" button click pe
   ============================================= */

// Yahan currently open teacher ka id save hoga
let currentTeacherId = null;

function openProfile(teacherId) {
  const teacher = teachers.find(t => t.id === teacherId);
  if (!teacher) return;

  currentTeacherId = teacherId;

  // Modal mein data fill karo
  document.getElementById("modalAvatar").textContent   = teacher.initials;
  document.getElementById("modalAvatar").style.background = teacher.avatarColor;
  document.getElementById("modalAvatar").style.color      = teacher.avatarText;
  document.getElementById("modalName").textContent         = teacher.name;
  document.getElementById("modalSubjectGrade").textContent = teacher.subject + " · " + teacher.grades.join(" · ");
  document.getElementById("modalRating").textContent       = teacher.stars + " " + teacher.rating + " · " + teacher.students + " students";
  document.getElementById("modalExp").textContent          = teacher.experience;
  document.getElementById("modalStudents").textContent     = teacher.students;
  document.getElementById("modalFee").textContent          = teacher.fee;
  document.getElementById("modalBio").textContent          = teacher.bio;
  document.getElementById("modalReview").textContent       = teacher.review;

  // Status update karo
  const statusEl = document.getElementById("modalStatus");
  if (teacher.status === "online") {
    statusEl.innerHTML = `<span class="online-dot"></span> Available`;
    statusEl.style.color = "var(--teal-600)";
  } else {
    statusEl.textContent = "Busy";
    statusEl.style.color = "var(--gray-400)";
  }

  // Tags banao
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

  // Modal open karo
  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden"; // Background scroll band karo
}

/* =============================================
   9. MODAL CLOSE KARNA
   X button ya overlay click pe
   ============================================= */
function closeModalBtn() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = ""; // Scroll wapas on karo
}

function closeModal(event) {
  // Sirf tab close karo jab overlay pe click ho, modal box pe nahi
  if (event.target === document.getElementById("modalOverlay")) {
    closeModalBtn();
  }
}

/* =============================================
   10. ENROLL FROM MODAL
   Modal ka "Demo Book Karein" button
   Form section pe le jao aur teacher set karo
   ============================================= */
function openEnrollFromModal() {
  const teacher = teachers.find(t => t.id === currentTeacherId);

  // Modal band karo
  closeModalBtn();

  // Form mein selected teacher dikhao
  if (teacher) {
    document.getElementById("formTeacherName").textContent =
      "Teacher: " + teacher.name + " — " + teacher.subject;
  }

  // Enroll section pe scroll karo
  document.getElementById("enroll").scrollIntoView({ behavior: "smooth" });
}

/* =============================================
   11. FORM SUBMIT
   Enrollment form submit hone pe
   ============================================= */

// Enrolled teachers ki list (dashboard ke liye)
let enrolledTeachers = [];

function submitForm(event) {
  event.preventDefault(); // Page reload rokna

  // Form values lena
  const name  = document.getElementById("studentName").value.trim();
  const phone = document.getElementById("studentPhone").value.trim();

  // Simple validation
  if (!name || !phone) {
    alert("Naam aur phone number zaroor bharein!");
    return;
  }

  // Enrolled teacher save karo
  const teacher = teachers.find(t => t.id === currentTeacherId);
  if (teacher) {
    enrolledTeachers.push(teacher);
  }

  // Form chupa do, success message dikhao
  document.getElementById("enrollForm").style.display    = "none";
  document.getElementById("successMsg").style.display = "block";
}

/* =============================================
   12. DASHBOARD DIKHANA
   Success message ke "Dashboard" button pe
   ============================================= */
function showDashboard() {
  const dashSection = document.getElementById("dashboard");

  // Dashboard dikhao
  dashSection.style.display = "block";

  // Enrolled count update karo
  document.getElementById("dashEnrolled").textContent = enrolledTeachers.length;

  // Classes render karo
  const classesContainer = document.getElementById("dashboardClasses");
  classesContainer.innerHTML = "";

  // Agar koi enrolled teacher nahi
  if (enrolledTeachers.length === 0) {
    classesContainer.innerHTML = `<p style="color:var(--gray-400); text-align:center; padding:1.5rem;">Abhi koi enrolled class nahi hai.</p>`;
  } else {
    enrolledTeachers.forEach(function (t, index) {
      const row = document.createElement("div");
      row.className = "class-row";
      row.style.animationDelay = (index * 0.1) + "s";

      row.innerHTML = `
        <div class="class-avatar" style="background:${t.avatarColor}; color:${t.avatarText};">
          ${t.initials}
        </div>
        <div>
          <div class="class-name">${t.name} — ${t.subject}</div>
          <div class="class-time">Demo class pending · ${t.type[0]}</div>
        </div>
        <span class="class-badge badge-active">Enrolled</span>
      `;

      classesContainer.appendChild(row);
    });
  }

  // Dashboard pe scroll karo
  dashSection.scrollIntoView({ behavior: "smooth" });
}

/* =============================================
   13. NAVBAR SCROLL EFFECT
   Scroll karne pe navbar pe shadow lagao
   ============================================= */
function initNavbar() {
  const navbar = document.getElementById("navbar");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

/* =============================================
   14. MOBILE HAMBURGER MENU
   Mobile pe nav links toggle karna
   ============================================= */
const hamburger = document.getElementById("hamburger");
const navLinks  = document.querySelector(".nav-links");

if (hamburger) {
  hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });
}