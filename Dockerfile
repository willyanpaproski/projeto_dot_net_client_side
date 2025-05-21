# Etapa 1: build da aplicação Angular
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência primeiro para cache eficiente
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Executa o build Angular (ajuste a configuração se necessário)
RUN npm run build -- --configuration production

# Etapa 2: imagem com NGINX para servir os arquivos
FROM nginx:alpine

# Remove os arquivos padrão do NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos buildados do Angular
COPY --from=builder /app/dist/client-side/browser /usr/share/nginx/html

# Copia configuração customizada do NGINX
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Garante permissões adequadas
RUN chmod -R 755 /usr/share/nginx/html
