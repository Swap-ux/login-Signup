// File: script.js
document.addEventListener('DOMContentLoaded', () => {
  const mainAuth     = document.querySelector('.main-auth');
  const loginBtn     = document.querySelector('.login-button');
  const closeBtn     = document.querySelector('.close-button');
  const registerLink = document.querySelector('.register');
  const loginLink    = document.querySelector('.login');
  const profileBox   = document.querySelector('.pbox');
  const avatar       = document.querySelector('.Ava');
  const logoutLink   = document.querySelector('.logout');
  const alertBox     = document.querySelector('.alert');
  const alertIcon    = alertBox.querySelector('i');
  const alertText    = alertBox.querySelector('span');

  function triggerAlert(message, type) {
    alertBox.classList.remove('success', 'error', 'show');
    alertIcon.className = type === 'success' ? 'bx bx-check' : 'bx bx-error-circle';
    alertText.textContent = message;
    alertBox.classList.add(type, 'show');
    setTimeout(() => alertBox.classList.remove('show'), 6000);
  }

  function updateUIForLogin(user) {
    if (user) {
      loginBtn.style.display = 'none';
      avatar.textContent = user.name.charAt(0).toUpperCase();
      profileBox.style.display = 'flex';
    
    } else {
      loginBtn.style.display = '';
      profileBox.style.display = 'none';
      profileBox.classList.remove('show');

    }
  }

  // Persisted login state
  const stored = localStorage.getItem('clubUser');
  const currentUser = stored ? JSON.parse(stored) : null;
  updateUIForLogin(currentUser);

  avatar.addEventListener('click', () => profileBox.classList.toggle('show'));
  logoutLink.addEventListener('click', e => {
    e.preventDefault();
    localStorage.removeItem('clubUser');
    updateUIForLogin(null);
  });

  // Modal controls
  loginBtn.addEventListener('click', () => mainAuth.classList.add('show'));
  closeBtn.addEventListener('click', () => mainAuth.classList.remove('show', 'slide'));
  registerLink.addEventListener('click', () => mainAuth.classList.add('slide'));
  loginLink.addEventListener('click', () => mainAuth.classList.remove('slide'));

  // Registration
  const registerForm = document.querySelector('.fboxregister form');
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    const { name, email, password } = registerForm;
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          password: password.value
        })
      });
      const data = await res.json();
      if (res.ok) {
        triggerAlert('Registration successful!', 'success');
        registerForm.reset();
      } else {
        triggerAlert(data.error || data.message, 'error');
      }
    } catch (err) {
      triggerAlert("Registration failed: " + err.message, 'error');
    }
  });

  // Login
  const loginForm = document.querySelector('.fbox form');
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const { email, password } = loginForm;
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value.trim(),
          password: password.value
        })
      });
      if (res.status === 404) {
        return triggerAlert("Login endpoint not found.", 'error');
      }
      const data = await res.json();
      if (res.ok) {
        triggerAlert('Login successful!', 'success');
        localStorage.setItem('clubUser', JSON.stringify({
          userId: data.userId,
          name:   data.name
        }));
        updateUIForLogin({ name: data.name });
        mainAuth.classList.remove('show', 'slide');
      } else {
        triggerAlert(data.message || 'Invalid email or password.', 'error');
      }
    } catch (err) {
      triggerAlert("Login failed: " + err.message, 'error');
    }
  });
});
