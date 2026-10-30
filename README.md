# Guinchos24h — Aluno 24 (Mobilidade)

Aplicativo React + Capacitor para localizar o usuário por GPS e abrir as coordenadas no Google Maps.

## Preparação automática

Requisitos: Node.js LTS e Android Studio instalado.

No terminal, dentro desta pasta, execute:

```bash
npm run android:setup
```

Esse comando instala as dependências, cria a plataforma Android se necessário, adiciona as permissões de localização ao `AndroidManifest.xml`, gera a versão web e sincroniza o projeto Android.

Depois execute:

```bash
npm run android:open
```

No Android Studio, aguarde a sincronização do Gradle, conecte o celular com depuração USB ativada e use **Run** para instalar e executar o app.

## Desenvolvimento no navegador

```bash
npm install
npm run dev
```

A captura de GPS no navegador depende das permissões do navegador e de um contexto seguro. Para validar as permissões nativas do Android, teste no celular.

## O que o app implementa

- `Geolocation.checkPermissions()` e `Geolocation.requestPermissions()`.
- `Geolocation.getCurrentPosition()` com alta precisão, timeout de 20 segundos e sem reutilizar posição antiga.
- Estados React para latitude, longitude, precisão, carregamento e erro.
- Link do Google Maps com `https://www.google.com/maps/search/?api=1&query=LATITUDE,LONGITUDE`.
- Mensagens para permissão negada e falha/timeout de localização.

Observação: a precisão depende do sinal GPS, do aparelho e do ambiente. O app não solicita automaticamente um guincho; ele fornece a posição para compartilhar com o serviço.
