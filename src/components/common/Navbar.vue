<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <router-link to="/">
        <div class="logo">
          <span class="logo-text">AI Table</span>
        </div>
      </router-link>
    </div>
    
    <div class="navbar-links">
      <router-link to="/execution" class="nav-link" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
        <span class="link-text">执行</span>
      </router-link>
      
      <router-link to="/creation" class="nav-link" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        <span class="link-text">创作</span>
      </router-link>
      
      <router-link to="/collaboration" class="nav-link" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span class="link-text">协同</span>
      </router-link>
      
      <router-link to="/management" class="nav-link" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span class="link-text">管理</span>
      </router-link>
    </div>
    
    <div class="navbar-user">
      <div class="user-avatar" style="background-image: url('https://randomuser.me/api/portraits/men/32.jpg')"></div>
      <div class="user-info">
        <div class="user-name">张三</div>
        <div class="user-role">管理员</div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 240px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--color-bg-glass);
  backdrop-filter: var(--blur-card);
  border-right: 1px solid var(--color-border);
  padding: var(--spacing-lg) 0;
  z-index: var(--z-index-navbar);
}

.navbar-logo {
  margin-bottom: var(--spacing-xl);
  padding: 0 var(--spacing-lg);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-links {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: var(--transition-normal);
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
}

.nav-link.active {
  color: var(--color-text-primary);
  background: rgba(42, 63, 251, 0.1);
  border-left: 3px solid var(--color-primary);
}

.link-text {
  font-size: var(--font-size-md);
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  margin-top: auto;
  width: 100%;
  border-top: 1px solid var(--color-border);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 2px solid var(--color-border);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.user-role {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .navbar {
    width: 60px;
  }
  
  .logo-text, .link-text, .user-info {
    display: none;
  }
  
  .navbar-user {
    justify-content: center;
  }
}
</style> 