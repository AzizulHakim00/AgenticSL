FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY spring-app/pom.xml pom.xml
COPY spring-app/maven-settings.xml maven-settings.xml
COPY spring-app/src src
RUN mvn -s /app/maven-settings.xml -B -Dmaven.test.skip=true package

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
RUN groupadd --system app && useradd --system --gid app app
COPY --from=build --chown=app:app /app/target/learning-hub-1.0.0.jar app.jar
USER app
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=60 -XX:InitialRAMPercentage=20 -XX:+ExitOnOutOfMemoryError"
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
