FROM alpine:3.20.3 as build

# Switch to root user to perform operations
USER root

# Install p7zip to extract the n-gram datasets
RUN apk add --no-cache \
    bash \
    p7zip \
    wget

# Create a directory for n-grams
RUN mkdir -p /ngrams

# Copy the download_ngrams script
COPY download_ngrams.sh /usr/local/bin/download_ngrams.sh
RUN chmod +x /usr/local/bin/download_ngrams.sh

# Download and extract n-gram datasets if not present
RUN /bin/bash -c 'source /usr/local/bin/download_ngrams.sh && download_ngrams de' \
    && /bin/bash -c 'source /usr/local/bin/download_ngrams.sh && download_ngrams en' \
    && /bin/bash -c 'source /usr/local/bin/download_ngrams.sh && download_ngrams fr'

FROM erikvl87/languagetool as final

# Switch to root user to perform operations
USER root

# Copy the n-gram datasets from the build image
COPY --from=build /ngrams /ngrams

# Switch back to the languagetool user
USER languagetool

# Set the languageModel configuration to use the n-grams
ENV langtool_languageModel=/ngrams
