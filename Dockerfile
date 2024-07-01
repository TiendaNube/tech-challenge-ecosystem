FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
# Adjust COPY commands to correctly reference the .csproj files
COPY ["TechChallengeApplication/TechChallengeApplication.csproj", "TechChallengeApplication/"]
COPY ["TechChallenge.Core/TechChallenge.Core.csproj", "TechChallenge.Core/"]
COPY ["TechChallenge.Infrastructure/TechChallenge.Infrastructure.csproj", "TechChallenge.Infrastructure/"]
RUN dotnet restore "TechChallengeApplication/TechChallengeApplication.csproj"
# Copy everything else and build
COPY . .
WORKDIR "/src/TechChallengeApplication"
RUN dotnet build "TechChallengeApplication.csproj" -c $BUILD_CONFIGURATION -o /app/build