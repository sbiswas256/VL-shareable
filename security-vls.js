(function() {
  // 1. Inject CSS for Flash Message
  const style = document.createElement('style');
  style.innerHTML = `
    .flash-message {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(220, 53, 69, 0.95);
      color: white;
      padding: 12px 28px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 0.95em;
      box-shadow: 0 8px 32px rgba(220, 53, 69, 0.3);
      z-index: 10000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      white-space: nowrap;
      pointer-events: none;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .flash-message.show {
      opacity: 1;
      visibility: visible;
      bottom: 60px;
    }
  `;
  document.head.appendChild(style);

  // 2. Flash Message Logic
  let flashMsg;
  let flashTimeout;

  function createFlashElement() {
    if (document.getElementById('security-flash')) {
        flashMsg = document.getElementById('security-flash');
        return;
    }
    flashMsg = document.createElement('div');
    flashMsg.id = 'security-flash';
    flashMsg.className = 'flash-message';
    flashMsg.textContent = 'This function is not allowed here, Due to security reason';
    document.body.appendChild(flashMsg);
  }

  // Wait for body to be available
  if (document.body) {
    createFlashElement();
  } else {
    document.addEventListener('DOMContentLoaded', createFlashElement);
  }

  function showSecurityMessage() {
    if (!flashMsg) createFlashElement();
    if (!flashMsg) return;
    
    clearTimeout(flashTimeout);
    flashMsg.classList.add('show');
    flashTimeout = setTimeout(() => {
      flashMsg.classList.remove('show');
    }, 3000);
  }

  // 3. Block Right-Click (Using capture phase and multiple event hooks to prevent bypasses)
  const preventContext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    showSecurityMessage();
    return false;
  };

  // Block via contextmenu event on both window and document (capture phase)
  window.addEventListener('contextmenu', preventContext, true);
  document.addEventListener('contextmenu', preventContext, true);

  // Additional check for right-click via mousedown (button 2)
  window.addEventListener('mousedown', (e) => {
    if (e.button === 2) {
      e.preventDefault();
      showSecurityMessage();
    }
  }, true);

  // 4. Block Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // F12 key
    const isF12 = e.key === 'F12' || e.keyCode === 123;
    
    // Letters to block with modifiers
    const devToolsKeys = ['I', 'J', 'C', 'U', 'K', 'S', 'E', 'M', 'P'];
    const key = e.key ? e.key.toUpperCase() : String.fromCharCode(e.keyCode).toUpperCase();
    
    // Windows/Linux: Ctrl+Shift+Key, Mac: Cmd+Opt+Key
    const isDevShortcut = (e.ctrlKey && e.shiftKey || e.metaKey && e.altKey) && devToolsKeys.includes(key);
    
    // View Source: Ctrl+U or Cmd+Opt+U
    const isViewSource = (e.ctrlKey || (e.metaKey && e.altKey)) && key === 'U';
    
    // Shift+F10: Context Menu shortcut
    const isShiftF10 = e.shiftKey && (e.key === 'F10' || e.keyCode === 121);

    if (isF12 || isDevShortcut || isViewSource || isShiftF10) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      showSecurityMessage();
      return false;
    }
  }, true);
})();
