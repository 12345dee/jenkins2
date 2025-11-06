pipeline {
agent any
environment {
// repo name on Docker Hub (replace if you want). Using your Docker Hub username deepak37.
DOCKER_REPO = 'deepak37/ecom-sample'
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
sh 'npm test'
}
}
stage('Build Docker Image') {
steps {
script {
IMAGE_TAG = "${env.BUILD_NUMBER ?: 'local'}"
sh "docker build -t ${DOCKER_REPO}:${IMAGE_TAG} -t ${DOCKER_REPO}:latest ."
}
}
}
stage('Push to Docker Hub') {
steps {
// Requires a Jenkins username/password credential named 'dockerhub'
withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
sh 'echo Logging into Docker Hub...'
sh 'echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin'
sh "docker push ${DOCKER_REPO}:${IMAGE_TAG}"
sh "docker push ${DOCKER_REPO}:latest"
}
}
}
}
post {
always {
sh 'docker image prune -f || true'
}
success {
echo 'Build and push succeeded.'
}
failure {
echo 'Something failed — check logs.'
}
}
}
