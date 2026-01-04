// Note: This file is Deprecated for environment variables, inject APP_CONFIG and use it 
// Example: public appConfig = inject(APP_CONFIG);

export const environment = {
  projectName: 'Control Markets',
  version: '0.0.34',
  envName: 'DEV',
  production: false,
  authenticationRequired: true,

  clientId: '',
  androidClientId: '',
  iosClientId: '',
  // n8nUrl: 'https://n8n.polito.casa/webhook',
  n8nUrl: 'http://192.168.2.5:5678/webhook',

  backendNodeUrl: 'http://localhost:8080',
  backendPythonUrl: 'http://localhost:8000',

  mobile: {
    appleAppId: '',
    appleRedirectURI: '',
    androidClientId: '',
    iosClientId: '',
  },
  firebase: {
    apiKey: 'AIzaSyAecVnUj1-IjKGDvBarhufKAfO-Y-RyTXw',
    authDomain: 'golden-ad-dev.firebaseapp.com',
    projectId: 'golden-ad-dev',
    storageBucket: 'golden-ad-dev.firebasestorage.app',
    messagingSenderId: '164740776065',
    appId: '1:164740776065:web:e2c59fd82d71fe6817cd80',
  },
};
