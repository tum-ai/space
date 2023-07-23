FROM mambaorg/micromamba:latest

WORKDIR /apps/space/api

COPY --chown=$MAMBA_USER:$MAMBA_USER ./environment.yml environment.yml
RUN micromamba install -y -n base -f environment.yml

RUN mkdir .secrets && \
    touch .secrets/tumai-space-firebase-adminsdk.json && \
    echo ${FIREBASE_ADMINSDK_CERTIFICATE} > .secrets/tumai-space-firebase-adminsdk.json

COPY --chown=$MAMBA_USER:$MAMBA_USER . /apps/space/api
