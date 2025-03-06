import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterLink,
  IonHeader,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonMenuButton,
  IonTabBar,
  IonTabButton,
  IonButton,
  IonFooter,
  NavController,
  IonAvatar,
  ActionSheetController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import * as ionicons from 'ionicons/icons'; // import all icons

import { environment } from 'src/environments/environment';
import { FirebaseAuthService } from '@dataclouder/app-auth';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ionic-layout',
  templateUrl: './ionic-layout.component.html',
  styleUrl: './ionic-layout.component.css',
  standalone: true,
  imports: [
    IonAvatar,
    IonFooter,
    IonButton,
    IonTabButton,
    IonTabBar,
    RouterOutlet,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonHeader,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonMenuToggle,
    IonMenuButton,
    ToggleButtonModule,
    FormsModule,
  ],
})
export class IonicLayoutComponent implements OnInit {
  public envName = environment.envName;
  public projectName = environment.projectName;
  public version = environment.version;
  public user: any = {};

  public appPages = [
    { title: 'Home', url: '/page/home', icon: 'home' },
    { title: 'Explore', url: '/page/explore', icon: 'id-card' },
    { title: 'Sources', url: '/page/sources', icon: 'document-attach' },
    { title: 'Video Analizer', url: '/page/video-analizer', icon: 'analytics' },
    { title: 'Video Generator', url: '/page/video-generator', icon: 'videocam' },
    { title: 'Conversation', url: '/page/chat', icon: 'chatbubble-ellipses' },
    { title: 'Generics', url: '/page/generics', icon: 'code-working' },
    { title: 'Tools', url: '/page/tools', icon: 'code-working' },
  ];

  public adminPages = [
    { title: 'Admin Users', url: '/page/admin-user', icon: 'people' },
    { title: 'Admin Other', url: '/page/admin-other', icon: 'settings' },
  ];

  public testingPages = [{ title: 'Test', url: '/page/test', icon: 'code-working' }];

  public isAdmin: boolean = false;

  // Add this property to track dark mode state
  public isDarkMode: boolean = false;

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private router: Router,
    private navController: NavController,
    private actionSheetController: ActionSheetController
  ) {
    addIcons(ionicons);

    // Check if dark mode was previously enabled
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.initializeDarkMode();
  }

  ngOnInit(): void {
    this.firebaseAuthService.authState$.subscribe((auth: any) => {
      if (auth) {
        this.user = {
          email: auth.email,
          displayName: auth.displayName,
          photoURL: auth.photoURL,
          emailVerified: auth.emailVerified,
          isAdmin: auth.email === 'admin@example.com',
        };
        // this.isAdmin = this.user.isAdmin;
        this.isAdmin = true;
      }

      console.log(this.user);
    });
  }

  logout() {
    console.log('logout');
    this.firebaseAuthService.logOut('/');
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  async openActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Actions',
      buttons: [
        {
          text: 'Ir al perfil',
          icon: 'share',
          handler: () => {
            // this.navController.navigateForward(RouteNames.Profile);
            this.router.navigate(['/page/stack/profile']);
          },
        },

        {
          text: 'Cerrar sesión',
          role: 'destructive',
          icon: 'close',
          handler: async () => {
            this.logout();
          },
        },
      ],
    });
    await actionSheet.present();
  }

  public goToStack(path: string) {
    // this.navController.navigateForward(path);
    this.router.navigate(['/page/profile']);
  }

  // Update the toggleDarkMode method
  toggleDarkMode() {
    // this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode);

    document.body.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  // Add this method to initialize dark mode on component creation
  private initializeDarkMode() {
    document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode);

    document.body.classList.toggle('dark', this.isDarkMode);
  }
}
