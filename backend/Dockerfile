FROM golang:1.24-alpine3.20 AS base

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

FROM golang:1.24-alpine3.20 AS builder

WORKDIR /app

COPY --from=base /go/pkg /go/pkg
COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/app/public/main.go

FROM alpine:3.20

WORKDIR /app

RUN apk --no-cache add ca-certificates

COPY --from=builder /app/main /app/main

EXPOSE 8080

CMD ["/app/main"]
