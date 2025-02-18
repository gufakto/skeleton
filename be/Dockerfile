FROM golang:1.23-alpine as build_base

ENV GO111MODULE=on
ARG GITLAB_LOGIN
ARG GITLAB_TOKEN
RUN apk add --update --no-cache bash ca-certificates git openssl curl
# RUN apk add --update --no-cache bash ca-certificates git openssl curl certbot

# RUN echo "machine gitlab.com login ${GITLAB_LOGIN} password ${GITLAB_TOKEN}" > ~/.netrc

ARG cert_location=/usr/local/share/ca-certificates
ARG HTTP_PROXY=proxy.golang.org:443,sum.golang.org:443,github.com:443
RUN openssl s_client -showcerts -connect proxy.golang.org:443 </dev/null 2>/dev/null|openssl x509 -outform PEM >  ${cert_location}/proxy.golang.crt
RUN openssl s_client -showcerts -connect sum.golang.org:443 </dev/null 2>/dev/null|openssl x509 -outform PEM >  ${cert_location}/sum.golang.crt
RUN openssl s_client -showcerts -connect google.golang.org:443 </dev/null 2>/dev/null|openssl x509 -outform PEM >  ${cert_location}/google.golang.crt
RUN openssl s_client -showcerts -connect gitlab.com:443 </dev/null 2>/dev/null|openssl x509 -outform PEM >  ${cert_location}/gitlab.crt
RUN openssl s_client -showcerts -connect github.com:443 </dev/null 2>/dev/null|openssl x509 -outform PEM >  ${cert_location}/github.crt
# Update certificates
RUN update-ca-certificates

WORKDIR /app

COPY . .

COPY go.mod ./
COPY go.sum ./
COPY .air.toml ./

RUN go mod tidy

# RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -o ./out/setup .

RUN go install github.com/air-verse/air@latest && \
    mv /go/bin/air /usr/local/bin/ && \
    chmod +x /usr/local/bin/air

# FROM alpine:3.9
# RUN mkdir config
# RUN chmod -R 775 config
# COPY --from=build_base /app/out/setup /
EXPOSE 3000

# ENTRYPOINT [ "/setup" ]
CMD ["air", "-c", ".air.toml"]
