import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (!fs.existsSync('node_modules')) {
  console.log('Instalando dependências...');
  run('npm', ['install']);
}

if (!fs.existsSync('android')) {
  console.log('Criando a plataforma Android...');
  run('npx', ['cap', 'add', 'android']);
}

const manifest = 'android/app/src/main/AndroidManifest.xml';
if (!fs.existsSync(manifest)) {
  console.error('Não foi possível encontrar:', manifest);
  process.exit(1);
}

let xml = fs.readFileSync(manifest, 'utf8');
const permissions = [
  '    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
  '    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />'
];
for (const permission of permissions) {
  const name = permission.match(/android:name="([^"]+)"/)[1];
  if (!xml.includes(name)) {
    xml = xml.replace('<application', `${permission}\\n    <application`);
  }
}
fs.writeFileSync(manifest, xml);
console.log('Permissões de localização configuradas no AndroidManifest.xml.');

console.log('Gerando a versão web e sincronizando com Android...');
run('npm', ['run', 'android:sync']);
console.log('\\nPronto! Para abrir o projeto Android Studio, execute: npm run android:open');
