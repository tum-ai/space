# Dockerfile for main.go at dev-test-service
# golang version: 1.18

FROM golang:1.18-alpine
WORKDIR /app

# Copy the go.mod and go.sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY *.go ./

# Build the Go app
RUN go build -o /dev-test-service

# Expose port 7777
EXPOSE 7777

# Run the executable
CMD ["/dev-test-service"]