pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }
    stage('Deploy') {
      steps {
        script {
          sh 'chmod +x ./jenkins/scripts/deploy.sh'
          sh 'chmod +x ./jenkins/scripts/moveFile.sh'
          // sh './jenkins/scripts/deploy.sh'
        }
      }
    }
  }
}
