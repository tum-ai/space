# For rootserver deployment only

FROM mambaorg/micromamba:latest

WORKDIR /apps/space/api

COPY --chown=$MAMBA_USER:$MAMBA_USER ./environment.yml environment.yml
RUN micromamba install -y -n base -f environment.yml

RUN mkdir .secrets

COPY --chown=$MAMBA_USER:$MAMBA_USER . /apps/space/api
COPY --chown=$MAMBA_USER:$MAMBA_USER .secrets /apps/space/api/.secrets
