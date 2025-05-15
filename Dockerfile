FROM nginx:alpine

# Copia apenas os arquivos estáticos do Angular build
COPY ./dist/client-side/browser /usr/share/nginx/html

# Copia a configuração personalizada do nginx
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
