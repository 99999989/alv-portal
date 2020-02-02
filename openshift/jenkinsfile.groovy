pipeline {
    agent { label 'maven-node' }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        DEFAULT_JVM_OPTS = '-Dhttp.proxyHost=l98fppx1.admin.arbeitslosenkasse.ch -Dhttp.proxyPort=8080 -Dhttps.proxyHost=l98fppx1.admin.arbeitslosenkasse.ch -Dhttps.proxyPort=8080 -Dhttp.nonProxyHosts="*.admin.arbeitslosenkasse.ch|172.27.97.10|172.27.97.11|172.27.97.12|172.30.0.1"'
        JAVA_TOOL_OPTIONS = "$JAVA_TOOL_OPTIONS $DEFAULT_JVM_OPTS"
        SERVER_URL = "https://alvch.jfrog.io/alvch"
        CREDENTIALS = "artifactory-deploy"
        ARTIFACTORY_SERVER = "alv-ch"
        MAVEN_HOME = "/opt/rh/rh-maven35/root/usr/share/xmvn"
        SONAR_LOGIN = credentials('SONAR_TOKEN')
        SONAR_SERVER = "${env.SONAR_HOST_URL}"
        JR_DEV = "jobroom-dev"
        DOCKER_BUILD_NAME = "alv-portal-docker"
        DEPLOYMENT_CONFIG = "alv-portal"
    }

    stages {

        stage('Init') {
            steps {
                sh '''
                  echo "PATH = ${PATH}"
                  echo "MAVEN_HOME = ${MAVEN_HOME}"
              '''
            }
        }

        stage('Exec Maven Build') {
            environment {
                ARTIFACTORY_PASSWORD = getArtifactoryPassword()
                ARTIFACTORY_USERNAME = getArtifactoryUser()
                FONTAWESOME_NPM_AUTH_TOKEN = getFontAwesomeToken()
            }

            steps {
                sh '''
                   mvn package deploy -Popenshift --settings .mvn/wrapper/settings.xml -DskipTests -DskipITs=true
                '''

                rtPublishBuildInfo(serverId: ARTIFACTORY_SERVER)
            }
        }

        stage('SonarQube') {
            steps {
                sh '''
                  mvn sonar:sonar --settings ./.mvn/wrapper/settings.xml  -Dsonar.projectKey=AlvPortal -Dsonar.host.url="$SONAR_SERVER" -Dsonar.login=$SONAR_LOGIN
                '''
            }
        }

        stage('Docker Build in dev') {
            steps {
                sh '''
                    oc start-build -F $DOCKER_BUILD_NAME --from-dir . -n $JR_DEV
                '''
            }
        }

        stage('Deploy to jobroom-dev') {
            steps {
                openshiftDeploy(
                        namespace: '$JR_DEV',
                        depCfg: '$DEPLOYMENT_CONFIG',
                        waitTime: '300000'
                )

                openshiftVerifyDeployment(
                        namespace: '$JR_DEV',
                        depCfg: '$DEPLOYMENT_CONFIG',
                        replicaCount: '1',
                        verifyReplicaCount: 'true',
                        waitTime: '300000')
            }
        }
    }
}

def getArtifactoryUser() {
    withCredentials([usernamePassword(credentialsId: 'artifactory-deploy',
            passwordVariable: 'ARTIFACTORY_PASSWORD', usernameVariable: 'ARTIFACTORY_USER')]) {
        return  ARTIFACTORY_USER
    }
}

def getArtifactoryPassword() {
    withCredentials([usernamePassword(credentialsId: 'artifactory-deploy',
            passwordVariable: 'ARTIFACTORY_PASSWORD', usernameVariable: 'ARTIFACTORY_USER')]) {
        return ARTIFACTORY_PASSWORD
    }
}

def getFontAwesomeToken() {
    withCredentials([string(credentialsId: 'font-awesome-pro', variable: 'faToken')]) {
       return faToken
    }
}
