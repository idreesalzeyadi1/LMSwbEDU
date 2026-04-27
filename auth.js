/* =============================================
   EDUACADEMY — auth.js
   Real Firebase Authentication
   - Google Sign In
   - Email/Password Register & Login
   - Navbar update
   - Logout
   ============================================= */

/* =============================================
   1. FIREBASE CONFIG
   Apna config yahan hai — mat badlna
   ============================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAN2slfT95-HBcd6agX-KjqMWnNBIw8GNU",
  authDomain:        "eduacademy-c3c75.firebaseapp.com",
  projectId:         "eduacademy-c3c75",
  storageBucket:     "eduacademy-c3c75.firebasestorage.app",
  messagingSenderId: "224117270680",
  appId:             "1:224117270680:web:60f1b950cf2af3705cc8ed"
};

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();

/* =============================================
   2. CURRENT USER LENA
   Koi bhi page call kar sakta hai
   ============================================= */
function getLoggedInUser() {
  const raw = localStorage.getItem('eduCurrentUser');
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch { return null; }
}

/* =============================================
   3. USER LOCALSTORAGE MEIN SAVE KARNA
   Firebase user object se local object banao
   ============================================= */
function saveUserLocally(firebaseUser) {
  const user = {
    name:     firebaseUser.displayName || "User",
    email:    firebaseUser.email,
    phone:    firebaseUser.phoneNumber || "",
    photo:    firebaseUser.photoURL || "",
    uid:      firebaseUser.uid,
    city:     "",
    grade:    "",
    isGoogle: firebaseUser.providerData?.[0]?.providerId === "google.com"
  };
  localStorage.setItem('eduCurrentUser', JSON.stringify(user));
  return user;
}

/* =============================================
   4. GOOGLE LOGIN
   Real Google popup — login.html ka button
   ============================================= */
async function handleGoogleAuth() {
  try {
    const result = await signInWithPopup(auth, provider);
    saveUserLocally(result.user);

    const redirect = sessionStorage.getItem('eduRedirectAfterLogin') || 'profile.html';
    sessionStorage.removeItem('eduRedirectAfterLogin');
    window.location.href = redirect;

  } catch (error) {
    console.error("Google login error:", error);
    showAuthError(
      document.getElementById('loginError') || document.getElementById('registerError'),
      "Google login fail hua. Dobara try karein."
    );
  }
}

/* =============================================
   5. EMAIL/PASSWORD REGISTER
   login.html register form
   ============================================= */
async function handleRegister(event) {
  event.preventDefault();

  const name      = document.getElementById('regName').value.trim();
  const email     = document.getElementById('regEmail').value.trim();
  const phone     = document.getElementById('regPhone').value.trim();
  const password  = document.getElementById('regPassword').value;
  const password2 = document.getElementById('regPassword2').value;
  const errorEl   = document.getElementById('registerError');

  // Validation
  if (password !== password2) {
    showAuthError(errorEl, 'Passwords match nahi kar rahe!');
    return;
  }

  try {
    // Firebase mein account banao
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Display name set karo
    await updateProfile(result.user, { displayName: name });

    // Local mein save karo (phone bhi add karo)
    const user = saveUserLocally(result.user);
    user.name  = name;
    user.phone = phone;
    localStorage.setItem('eduCurrentUser', JSON.stringify(user));

    const redirect = sessionStorage.getItem('eduRedirectAfterLogin') || 'profile.html';
    sessionStorage.removeItem('eduRedirectAfterLogin');
    window.location.href = redirect;

  } catch (error) {
    console.error("Register error:", error);
    let msg = "Registration fail hui. Dobara try karein.";
    if (error.code === 'auth/email-already-in-use') msg = "Yeh email already registered hai.";
    if (error.code === 'auth/weak-password')        msg = "Password kam se kam 6 characters ka hona chahiye.";
    if (error.code === 'auth/invalid-email')        msg = "Email format sahi nahi hai.";
    showAuthError(errorEl, msg);
  }
}

/* =============================================
   6. EMAIL/PASSWORD LOGIN
   login.html login form
   ============================================= */
async function handleLogin(event) {
  event.preventDefault();

  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl  = document.getElementById('loginError');

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    saveUserLocally(result.user);

    const redirect = sessionStorage.getItem('eduRedirectAfterLogin') || 'profile.html';
    sessionStorage.removeItem('eduRedirectAfterLogin');
    window.location.href = redirect;

  } catch (error) {
    console.error("Login error:", error);
    let msg = "Email ya password galat hai.";
    if (error.code === 'auth/user-not-found')  msg = "Yeh email registered nahi hai.";
    if (error.code === 'auth/wrong-password')  msg = "Password galat hai.";
    if (error.code === 'auth/invalid-email')   msg = "Email format sahi nahi hai.";
    if (error.code === 'auth/too-many-requests') msg = "Bohot zyada attempts. Thodi der baad try karein.";
    showAuthError(errorEl, msg);
  }
}

/* =============================================
   7. LOGOUT
   ============================================= */
async function handleLogout() {
  await signOut(auth);
  localStorage.removeItem('eduCurrentUser');
  window.location.href = 'index.html';
}

/* =============================================
   8. AUTH STATE LISTENER
   Firebase login state track karta hai
   Har page load pe check hota hai
   ============================================= */
onAuthStateChanged(auth, function(firebaseUser) {
  if (firebaseUser) {
    // Logged in — local data update karo
    const existing = getLoggedInUser();
    if (!existing || existing.uid !== firebaseUser.uid) {
      saveUserLocally(firebaseUser);
    }
  } else {
    // Logged out
    localStorage.removeItem('eduCurrentUser');
  }
  // Navbar update karo
  updateNavAuth();
  checkEnrollSection();
});

/* =============================================
   9. NAVBAR AUTH AREA UPDATE
   Logged out: Login + Register buttons
   Logged in:  Avatar + dropdown
   ============================================= */
function updateNavAuth() {
  const navAuth = document.getElementById('navAuth');
  if (!navAuth) return;

  const user = getLoggedInUser();

  if (!user) {
    navAuth.innerHTML = `
      <a href="login.html" class="nav-login-btn">Login</a>
      <a href="login.html?tab=register" class="nav-register-btn">Register</a>
    `;
  } else {
    // Avatar — photo ya initials
    const initials = user.name
      ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
      : '?';

    const avatarHTML = user.photo
      ? `<img src="${user.photo}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid #AFA9EC;" />`
      : `<div class="nav-avatar" onclick="toggleNavDropdown()">${initials}</div>`;

    navAuth.innerHTML = `
      <div class="nav-profile-wrap" id="navProfileWrap">
        <div onclick="toggleNavDropdown()" style="cursor:pointer;">
          ${avatarHTML}
        </div>
        <div class="nav-dropdown" id="navDropdown">
          <div class="nav-dropdown-header">
            <div class="nav-dropdown-avatar">${initials}</div>
            <div class="nav-dropdown-info">
              <div class="nav-dropdown-name">${user.name}</div>
              <div class="nav-dropdown-email">${user.email}</div>
            </div>
          </div>
          <div class="nav-dropdown-menu">
            <a href="profile.html" class="nav-dropdown-item">
              <span class="nav-dropdown-item-icon" style="background:#EEEDFE;">&#128100;</span>
              My Profile
            </a>
            <a href="profile.html" class="nav-dropdown-item">
              <span class="nav-dropdown-item-icon" style="background:#E1F5EE;">&#128218;</span>
              My Enrollments
            </a>
            <div class="nav-dropdown-divider"></div>
            <button class="nav-dropdown-item nav-logout-item" onclick="handleLogout()">
              <span class="nav-dropdown-item-icon" style="background:#FEF2F2;">&#128682;</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    `;

    // Bahar click pe dropdown band karo
    setTimeout(() => {
      document.addEventListener('click', function closeDD(e) {
        const wrap = document.getElementById('navProfileWrap');
        if (wrap && !wrap.contains(e.target)) {
          const dd = document.getElementById('navDropdown');
          if (dd) dd.classList.remove('open');
        }
      });
    }, 100);
  }
}

/* =============================================
   10. DROPDOWN TOGGLE
   ============================================= */
function toggleNavDropdown() {
  const dd = document.getElementById('navDropdown');
  if (dd) dd.classList.toggle('open');
}

/* =============================================
   11. LOGIN REQUIRED CHECK
   Book Demo button ke liye
   ============================================= */
function requireLoginForEnroll() {
  const user = getLoggedInUser();
  if (!user) {
    sessionStorage.setItem('eduRedirectAfterLogin', window.location.href + '#enroll');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

/* =============================================
   12. ENROLLMENT SAVE KARNA
   LocalStorage mein — profile pe dikhai dega
   ============================================= */
function saveEnrollment(enrollData) {
  const user = getLoggedInUser();
  if (!user) return;

  const key         = 'eduEnrollments_' + user.email;
  const enrollments = JSON.parse(localStorage.getItem(key) || '[]');

  enrollments.push({
    ...enrollData,
    status: 'Pending',
    date:   new Date().toLocaleDateString('en-PK', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  });

  localStorage.setItem(key, JSON.stringify(enrollments));
}

/* =============================================
   13. ENROLL FORM — PRE FILL + LOGIN CHECK
   ============================================= */
function prefillEnrollForm() {
  const user = getLoggedInUser();
  if (!user) return;
  const n = document.getElementById('studentName');
  const e = document.getElementById('studentEmail');
  const p = document.getElementById('studentPhone');
  if (n && user.name)  n.value = user.name;
  if (e && user.email) e.value = user.email;
  if (p && user.phone) p.value = user.phone;
}

function checkEnrollSection() {
  const user        = getLoggedInUser();
  const form        = document.getElementById('enrollForm');
  const loginPrompt = document.getElementById('loginPrompt');
  if (!form || !loginPrompt) return;

  if (user) {
    form.style.display        = 'flex';
    loginPrompt.style.display = 'none';
    prefillEnrollForm();
  } else {
    form.style.display        = 'none';
    loginPrompt.style.display = 'block';
  }
}

/* =============================================
   14. ERROR SHOW KARNA
   ============================================= */
function showAuthError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 5000);
}

/* =============================================
   15. GLOBAL FUNCTIONS — HTML onclick ke liye
   ============================================= */
window.handleGoogleAuth      = handleGoogleAuth;
window.handleRegister        = handleRegister;
window.handleLogin           = handleLogin;
window.handleLogout          = handleLogout;
window.toggleNavDropdown     = toggleNavDropdown;
window.requireLoginForEnroll = requireLoginForEnroll;
window.saveEnrollment        = saveEnrollment;
window.getLoggedInUser       = getLoggedInUser;
window.checkEnrollSection    = checkEnrollSection;