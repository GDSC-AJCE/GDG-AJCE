FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy Maven wrapper & project files
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Give execution permission to mvnw
RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Package the application
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
