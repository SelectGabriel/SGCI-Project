FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/SGCI-Backend-1.0.1-PRD.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]