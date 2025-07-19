export const environment = {
  projectName: 'Control Markets',
  version: '0.0.28',
  envName: 'DEV',
  production: false,

  clientId: '',
  androidClientId: '',
  iosClientId: '',
  // n8nUrl: 'https://n8n.polito.casa/webhook',
  n8nUrl: 'http://192.168.2.5:5678/webhook',

  // backendNodeUrl: 'https://golden-ad-node-164740776065.us-central1.run.app',
  backendNodeUrl: 'http://localhost:8080',
  // backendNodeUrl: 'https://niche-market-node-905545672221.us-central1.run.app',
  backendPythonUrl: 'http://localhost:8000',
  // backendPythonUrl: 'https://python-server-905545672221.us-central1.run.app',

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
