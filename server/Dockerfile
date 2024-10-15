FROM amazoncorretto:22

ARG APP_VERSION

ENV APP_VERSION=${APP_VERSION}

COPY ./build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
