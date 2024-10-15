FROM node:18-alpine

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY ./public ./public

RUN mkdir .next

COPY ./.next/standalone ./
COPY ./.next/static ./.next/static

EXPOSE 80

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]