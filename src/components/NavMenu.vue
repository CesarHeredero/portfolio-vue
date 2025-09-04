<template>
  <nav class="nav-menu">
    <!-- Menú web (desktop) -->
    <div class="desktop-menu">
      <div class="logo">César Heredero</div>
      <div class="menu-items">
        <a href="#inicio">
          <span>{{ t('nav.home') }}</span>
        </a>
        <a href="#sobre-mi">
          <span>{{ t('nav.about') }}</span>
        </a>
        <a href="#experience">
          <span>{{ t('nav.experience') }}</span>
        </a>
        <a href="#contact">
          <span>{{ t('nav.contact') }}</span>
        </a>
      </div>
    </div>

    <!-- Menú mobile -->
    <div class="mobile-menu">
      <div class="nav-header">
        <div class="logo">César Heredero</div>
        <div class="hamburger" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <div class="menu-overlay" :class="{ 'is-open': isMenuOpen }" @click="closeMenu"></div>
      <div class="mobile-menu-items" :class="{ 'is-open': isMenuOpen }">
        <div class="menu-header">
          <div class="logo">César Heredero</div>
          <div class="close-btn" @click="closeMenu">
            <i class="fas fa-times"></i>
          </div>
        </div>
        <div class="menu-links">
          <a href="#inicio" @click="closeMenu">
            <i class="fas fa-home"></i>
            <span>{{ t('nav.home') }}</span>
          </a>
          <a href="#sobre-mi" @click="closeMenu">
            <i class="fas fa-user"></i>
            <span>{{ t('nav.about') }}</span>
          </a>
          <a href="#experiencia" @click="closeMenu">
            <i class="fas fa-briefcase"></i>
            <span>{{ t('nav.experience') }}</span>
          </a>
          <a href="#contacto" @click="closeMenu">
            <i class="fas fa-envelope"></i>
            <span>{{ t('nav.contact') }}</span>
          </a>
        </div>
        <div class="menu-footer">
          <div class="social-links">
            <a href="https://linkedin.com/in/cesarheredero" target="_blank">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="https://github.com/tu-usuario" target="_blank">
              <i class="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'NavMenu',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    },
    closeMenu() {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

// Estilos para el menú desktop
.desktop-menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;

  .logo {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
  }

  .menu-items {
    display: flex;
    gap: 2rem;

    a {
      color: var(--text-color);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;

      &:hover {
        color: var(--primary-color);
        background: var(--section-bg);
      }
    }
  }
}

// Estilos para el menú mobile
.mobile-menu {
  display: none;
}

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  
  .logo {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
  }
}

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  cursor: pointer;
  z-index: 1001;
  
  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: var(--text-color);
    transition: all 0.3s ease;
  }
  
  &.is-active span {
    &:first-child {
      transform: translateY(9px) rotate(45deg);
    }
    
    &:nth-child(2) {
      opacity: 0;
    }
    
    &:last-child {
      transform: translateY(-9px) rotate(-45deg);
    }
  }
}

.menu-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  
  &.is-open {
    opacity: 1;
    visibility: visible;
  }
}

.mobile-menu-items {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  transition: right 0.3s ease;
  
  &.is-open {
    right: 0;
  }
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  .logo {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
  }
  
  .close-btn {
    cursor: pointer;
    font-size: 1.5rem;
    color: var(--text-color);
    
    &:hover {
      color: var(--primary-color);
    }
  }
}

.menu-links {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  
  a {
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 1rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    i {
      width: 20px;
      text-align: center;
      font-size: 1.2rem;
    }
    
    &:hover {
      color: var(--primary-color);
      background: var(--section-bg);
    }
  }
}

.menu-footer {
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid #eee;
  
  .social-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    
    a {
      font-size: 1.5rem;
      color: var(--text-color);
      
      &:hover {
        color: var(--primary-color);
      }
    }
  }
}

@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }
  
  .mobile-menu {
    display: block;
  }

  .menu-overlay {
    display: block;
  }
}
</style> 