pipeline {
    agent { label 'maven-node' }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 10, unit: 'MINUTES')
    }

    environment {
        DEFAULT_JVM_OPTS = '-Dhttp.proxyHost=l98fppx1.admin.arbeitslosenkasse.ch -Dhttp.proxyPort=8080 -Dhttps.proxyHost=l98fppx1.admin.arbeitslosenkasse.ch -Dhttps.proxyPort=8080 -Dhttp.nonProxyHosts="*.admin.arbeitslosenkasse.ch|172.27.97.10|172.27.97.11|172.27.97.12|172.30.0.1"'
        JAVA_TOOL_OPTIONS = "$JAVA_TOOL_OPTIONS $DEFAULT_JVM_OPTS"
        SERVER_URL = "https://alvch.jfrog.io/alvch"
        CREDENTIALS = "artifactory-deploy"
        FONTAWESOME_NPM_AUTH_TOKEN="F210019D-75E0-4C3D-B1D6-CE6A1B68FBFB"
        ARTIFACTORY_SERVER = "alv-ch"
        MAVEN_HOME = "/opt/rh/rh-maven35/root/usr/share/xmvn"
        SONAR_LOGIN = credentials('SONAR_TOKEN')
        SONAR_SERVER = "${env.SONAR_HOST_URL}"
        ARTIFACTORY_USERNAME = "developer"
        ARTIFACTORY_PASSWORD = "aibQuCpCHR3+H/lj"
    }

    stages {

        stage('Init') {
            steps {
                sh '''
                  echo "PATH = ${PATH}"
                  echo "MAVEN_HOME = ${MAVEN_HOME}"
                  mvn --version
              '''
            }
        }

        stage('Artifactory configuration') {
            steps {
                rtServer(
                    id: ARTIFACTORY_SERVER,
                    url: SERVER_URL,
                    credentialsId: CREDENTIALS
                )

                rtMavenDeployer(
                    id: "MAVEN_DEPLOYER",
                    serverId: ARTIFACTORY_SERVER,
                    releaseRepo: "libs-releases-local",
                    snapshotRepo: "libs-snapshots-local"
                )

                rtMavenResolver(
                    id: "MAVEN_RESOLVER",
                    serverId: ARTIFACTORY_SERVER,
                    releaseRepo: "libs-releases-ocp",
                    snapshotRepo: "libs-snapshots"
                )
            }
        }

        stage('Exec Maven') {
            steps {
                sh '''
                  mvn clean deploy --settings ./.mvn/wrapper/settings.xml -DskipTests -DskipITs=true
                '''
            }
        }

        stage('SonarQube') {
            steps {
                sh '''
                  mvn sonar:sonar --settings ./.mvn/wrapper/settings.xml  -Dsonar.projectKey=AlvPortal -Dsonar.host.url="$SONAR_SERVER" -Dsonar.login=$SONAR_LOGIN
                '''
            }
        }

        stage('Publish build info') {
            steps {
                rtPublishBuildInfo(
                    serverId: ARTIFACTORY_SERVER
                )
            }
        }
    }
}
