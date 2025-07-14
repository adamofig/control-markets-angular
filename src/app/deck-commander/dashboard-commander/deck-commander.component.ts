import { Component, OnInit, OnDestroy, Inject, Renderer2, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-deck-commander',
  templateUrl: './deck-commander.component.html',
  styleUrls: ['./deck-commander.component.scss'],
})
export class DeckCommanderComponent implements OnInit, OnDestroy {
  buttons = [
    { id: 'mic', icon: '🎤', label: 'Microphone', action: 'toggleMic' },
    { id: 'camera', icon: '📹', label: 'Camera', action: 'toggleCamera' },
    { id: 'screen', icon: '🖥️', label: 'Screen Share', action: 'toggleScreen' },
    { id: 'music', icon: '🎵', label: 'Music', action: 'toggleMusic' },
    { id: 'lights', icon: '💡', label: 'Lights', action: 'toggleLights' },
    { id: 'discord', icon: '💬', label: 'Discord', action: 'openDiscord' },
    { id: 'obs', icon: '🎬', label: 'OBS Studio', action: 'openOBS' },
    { id: 'twitter', icon: '🐦', label: 'Twitter', action: 'openTwitter' },
    { id: 'volume', icon: '🔊', label: 'Volume', action: 'adjustVolume' },
    { id: 'timer', icon: '⏰', label: 'Timer', action: 'startTimer' },
    { id: 'weather', icon: '🌤️', label: 'Weather', action: 'showWeather' },
    { id: 'settings', icon: '⚙️', label: 'Settings', action: 'openSettings' },
  ];

  status = 'Ready';
  private kioskExitListeners: (() => void)[] = [];

  constructor(@Inject(DOCUMENT) private document: any, private renderer: Renderer2) {}

  ngOnInit() {
    this.updateStatus('Stream Deck Ready');
  }

  ngOnDestroy() {
    this.kioskExitListeners.forEach(listener => listener());
  }

  @HostListener('document:fullscreenchange')
  @HostListener('document:webkitfullscreenchange')
  @HostListener('document:mozfullscreenchange')
  @HostListener('document:MSFullscreenChange')
  handleFullscreenChange() {
    const isFullscreen =
      this.document.fullscreenElement || this.document.webkitFullscreenElement || this.document.mozFullScreenElement || this.document.msFullscreenElement;

    const fullscreenBtn = this.document.getElementById('fullscreenBtn');
    if (isFullscreen) {
      if (fullscreenBtn) fullscreenBtn.textContent = '🔲 Exit Fullscreen';
      this.updateStatus('Fullscreen mode enabled');
    } else {
      if (fullscreenBtn) fullscreenBtn.textContent = '🔳 Fullscreen';
      this.updateStatus('Fullscreen mode disabled');
      this.exitKioskMode(false); // Ensure kiosk mode is also exited
    }
  }

  handleButtonPress(button: any) {
    if (!button) return;

    const buttonElement = this.document.querySelector(`[data-id="${button.id}"]`);
    if (buttonElement) {
      this.animateButton(buttonElement);
    }

    if (typeof (this as any)[button.action] === 'function') {
      (this as any)[button.action]();
    }

    this.updateStatus(`${button.label} activated`);

    setTimeout(() => {
      this.updateStatus('Ready');
    }, 2000);
  }

  animateButton(element: HTMLElement) {
    this.renderer.addClass(element, 'active');
    setTimeout(() => {
      this.renderer.removeClass(element, 'active');
    }, 200);
  }

  updateStatus(message: string) {
    this.status = message;
  }

  toggleFullscreen() {
    if (
      !this.document.fullscreenElement &&
      !this.document.webkitFullscreenElement &&
      !this.document.mozFullScreenElement &&
      !this.document.msFullscreenElement
    ) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  enterFullscreen() {
    const elem = this.document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }

  exitFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.webkitExitFullscreen) {
      this.document.webkitExitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      this.document.mozCancelFullScreen();
    } else if (this.document.msExitFullscreen) {
      this.document.msExitFullscreen();
    }
  }

  enterKioskMode() {
    this.renderer.setStyle(this.document.querySelector('.header'), 'display', 'none');
    this.renderer.setStyle(this.document.querySelector('.fullscreen-controls'), 'display', 'none');
    this.renderer.setStyle(this.document.querySelector('.status'), 'display', 'none');
    this.enterFullscreen();
    this.renderer.setStyle(this.document.body, 'cursor', 'none');
    this.setupKioskExit();
    this.updateStatus('Kiosk mode enabled - swipe from top to exit');
  }

  setupKioskExit() {
    let startY = 0;
    let isSwipeFromTop = false;

    const touchstartListener = this.renderer.listen(this.document, 'touchstart', (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isSwipeFromTop = startY < 50;
    });

    const touchmoveListener = this.renderer.listen(this.document, 'touchmove', (e: TouchEvent) => {
      if (isSwipeFromTop) {
        const currentY = e.touches[0].clientY;
        const swipeDistance = currentY - startY;
        if (swipeDistance > 100) {
          this.exitKioskMode();
        }
      }
    });

    this.kioskExitListeners.push(touchstartListener, touchmoveListener);
  }

  exitKioskMode(doExitFullscreen = true) {
    this.renderer.setStyle(this.document.querySelector('.header'), 'display', 'block');
    this.renderer.setStyle(this.document.querySelector('.fullscreen-controls'), 'display', 'flex');
    this.renderer.setStyle(this.document.querySelector('.status'), 'display', 'block');
    this.renderer.setStyle(this.document.body, 'cursor', 'default');

    if (doExitFullscreen) this.exitFullscreen();

    this.updateStatus('Kiosk mode disabled');
    this.kioskExitListeners.forEach(listener => listener());
    this.kioskExitListeners = [];
  }

  toggleMic() {
    this.updateStatus('Microphone toggled');
  }
  toggleCamera() {
    this.updateStatus('Camera toggled');
  }
  toggleScreen() {
    this.updateStatus('Screen share toggled');
  }
  toggleMusic() {
    this.updateStatus('Music toggled');
  }
  toggleLights() {
    this.updateStatus('Lights toggled');
  }
  openDiscord() {
    this.updateStatus('Opening Discord...');
  }
  openOBS() {
    this.updateStatus('Opening OBS Studio...');
  }
  openTwitter() {
    this.updateStatus('Opening Twitter...');
  }
  adjustVolume() {
    this.updateStatus('Volume adjusted');
  }
  startTimer() {
    this.updateStatus('Timer started');
  }
  showWeather() {
    this.updateStatus('Showing weather...');
  }
  openSettings() {
    this.updateStatus('Opening settings...');
  }
}
