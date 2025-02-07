FROM erikvl87/languagetool

# Switch to root user to perform operations
USER root

# Create a directory for n-grams
RUN mkdir -p /ngrams

# Copy the download_ngrams script
COPY download_ngrams.sh /usr/local/bin/download_ngrams.sh
RUN chmod +x /usr/local/bin/download_ngrams.sh

# Download and extract n-gram datasets if not present
RUN /bin/bash -c 'source /usr/local/bin/download_ngrams.sh && download_ngrams en' \
    && /bin/bash -c 'source /usr/local/bin/download_ngrams.sh && download_ngrams de' \
    && /bin/bash -c 'source /usr/local/bin/download_ngrams.sh && download_ngrams fr'

# Switch back to the languagetool user
USER languagetool

# Set the languageModel configuration to use the n-grams
ENV langtool_languageModel=/ngrams
