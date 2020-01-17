FROM redhat-openjdk-18/openjdk18-openshift

ARG ALV_USERNAME
ARG ALV_PASSWORD
ENV ARTIFACTORY_SERVER="https://alvch.jfrog.io/artifactory" GROUP_ID="ch.admin.seco" ARTIFACT_ID="app-portal-webapp"
ENV REPO_ID="libs-snapshots-local"
# TODO resolve hardcoded version
ENV ARTIFACT_VERSION="0.0.0-SNAPSHOT"
ENV JAVA_OPTS="-Xms384 -Xmx384m"

USER root

RUN yum install wget -y && yum clean all -y

RUN mkdir -p /srv/jobroom/

# Download the latest version of the artifact
RUN wget -O /srv/jobroom/app-portal.jar "$ARTIFACTORY_SERVER/libs-snapshots-local/$(echo "$GROUP_ID" | sed 's/\./\//g')/$ARTIFACT_ID/$ARTIFACT_VERSION/$ARTIFACT_ID-$ARTIFACT_VERSION.jar"

# Maven artifact location
ENV name=$ARTIFACT_ID
ENV artifact=ch/admin/seco/$ARTIFACT_ID
ENV path=$ARTIFACTORY_SERVER/$REPO_ID/$artifact
ENV version="$(curl -s $path/maven-metadata.xml | grep latest | sed "s/.*<latest>\([^<]*\)<\/latest>.*/\1/")"
ENV build="$(curl -s $path/$version/maven-metadata.xml | grep '<value>' | head -1 | sed "s/.*<value>\([^<]*\)<\/value>.*/\1/")"
ENV jar=$name-$build.jar
ENV url=$path/$version/$jar

# Download
RUN echo $url
RUN wget -q -N $url

WORKDIR /

ADD openshift/bootstrap.sh /
ADD openshift/logback-spring.xml /srv/jobroom/
RUN chmod 755 /bootstrap.sh && chmod g=u /etc/passwd && chown -R 1001:0 /srv/jobroom

EXPOSE 8080

# OpenShift requires images to run as non-root by default
USER 1001
ENTRYPOINT ["/bootstrap.sh"]
