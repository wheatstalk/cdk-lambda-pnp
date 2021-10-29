FROM node:14 as packages

WORKDIR /asset
# Create all the package.json in a cacheable layer
RUN --mount=type=bind,target=/docker-context \
    cd /docker-context/; \
    find . -name "package.json" -mindepth 0 -maxdepth 4 -exec cp --parents "{}" /asset/ \;

FROM node:14
ARG WORKSPACE
ENV WORKSPACE=$WORKSPACE

WORKDIR /asset

# Build a cacheable layer of the deps for the given workspace
COPY .yarn .yarn
COPY .yarnrc.yml .
COPY yarn.lock .
COPY --from=packages /asset/ .
RUN yarn plugin import workspace-tools \
    && yarn workspaces focus $WORKSPACE

# Now copy in the rest of the code
COPY . .