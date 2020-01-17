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
        ARTIFACTORY_SERVER = "alv-ch"
        MAVEN_HOME = "/opt/rh/rh-maven35/root/usr/share/xmvn"
        SONAR_LOGIN = credentials('SONAR_TOKEN')
        SONAR_SERVER = "${env.SONAR_HOST_URL}"
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

        stage('Exec Maven') {
            steps {

                withCredentials([usernamePassword(credentialsId: 'artifactory-deployer',
                        passwordVariable: 'ARTIFACTORY_PASSWORD', usernameVariable: 'ARTIFACTORY_USER')]) {

                    sh 'echo "Use user: $ARTIFACTORY_USER"'

                    withCredentials([string(credentialsId: 'font-awesome-pro', variable: 'FONTAWESOME_NPM_AUTH_TOKEN')]) {

                        sh '''
                            ls -l
                            mvn clean deploy --settings ./.mvn/wrapper/settings.xml -DskipTests -DskipITs=true
                        '''
                    }

                }
            }
        }

//        stage('SonarQube') {
//            steps {
//                sh '''
//                  mvn sonar:sonar --settings ./.mvn/wrapper/settings.xml  -Dsonar.projectKey=AlvPortal -Dsonar.host.url="$SONAR_SERVER" -Dsonar.login=$SONAR_LOGIN
//                '''
//            }
//        }

        stage('Publish build info') {
            steps {
                rtPublishBuildInfo(
                    serverId: ARTIFACTORY_SERVER
                )
            }
        }
    }
}
