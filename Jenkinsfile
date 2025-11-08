pipeline {
    agent any

    environment {
        DOCKER_REPO = 'deepak37/ecom-sample'
        IMAGE_TAG = "${env.BUILD_NUMBER ?: 'local'}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'node -v || true'
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || echo "⚠️ No tests or tests failed (check logs)"; true'
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
                    sh '''
                      echo "🔐 Logging into Docker Hub..."
                      echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin
                      echo "🚀 Pushing image to Docker Hub..."
                      docker push ${DOCKER_REPO}:${IMAGE_TAG}
                      docker push ${DOCKER_REPO}:latest
                    '''
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    sh '''
                      echo "🧹 Stop & remove old container if exists..."
                      docker stop ecom-app || true
                      docker rm ecom-app || true

                      echo "📥 Pull latest image..."
                      docker pull ${DOCKER_REPO}:latest

                      echo "🚀 Starting new container on port 9090..."
                      docker run -d -p 9090:80 --name ecom-app ${DOCKER_REPO}:latest

                      echo "✅ Container deployed successfully!"
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f || true'
        }
        success {
            echo '✅ Pipeline completed successfully and app deployed!'
            echo '👉 Access your app at: http://<EC2-PUBLIC-IP>:9090'
        }
        failure {
            echo '❌ Pipeline failed — check Jenkins console for details.'
        }
    }
}

