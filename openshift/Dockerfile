FROM redhat-openjdk-18/openjdk18-openshift
LABEL ch.admin.seco.app=portal

ARG JAVA_OPTS="-Xms384m -Xmx384m"

USER root

RUN mkdir -p /srv/jobroom/

COPY alv-portal-webapp/target/alv-portal-webapp.jar /srv/jobroom/alv-portal-webapp.jar

WORKDIR /

ADD openshift/bootstrap.sh /
ADD openshift/logback-spring.xml /srv/jobroom/
RUN chmod 755 /bootstrap.sh && chmod g=u /etc/passwd && chown -R 1001:0 /srv/jobroom

EXPOSE 8080

# OpenShift requires images to run as non-root by default
USER 1001
ENTRYPOINT ["/bootstrap.sh"]
