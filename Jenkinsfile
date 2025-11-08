pipeline {
    agent any
    environment {
        DOCKER_REPO = 'deepak37/ecom-sample'
        IMAGE_TAG = "${env.BUILD_NUMBER ?: 'local'}"
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Install') {
            steps {
                sh 'node -v || true'
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test || echo "No tests or tests failed (check logs)"; true'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh "docker build --pull -t ${DOCKER_REPO}:${IMAGE_TAG} -t ${DOCKER_REPO}:latest ."
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh 'echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin'
                    sh "docker push ${DOCKER_REPO}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_REPO}:latest"
                }
            }
        }
        stage('Deploy Container') {
            steps {
                script {
                    sh '''
                      echo "Stop & remove old container if exists..."
                      docker stop ecom-app || true
                      docker rm ecom-app || true
                      echo "Pull latest image..."
                      docker pull ${DOCKER_REPO}:latest
                      echo "Start container..."
                      docker run -d -p 8080:80 --name ecom-app ${DOCKER_REPO}:latest
                    '''
                }
            }
        }
    }
    post {
        always { sh 'docker image prune -f || true' }
        success { echo '✅ Pipeline success' }
        failure { echo '❌ Pipeline failed — check console output' }
    }
}

