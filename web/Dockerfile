FROM node:18-alpine

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN mkdir .next

COPY ./.next/standalone ./
COPY ./.next/static ./.next/static

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]