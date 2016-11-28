#!groovy

node('nodejs') {


    currentBuild.result = "SUCCESS"

    try {

       stage 'Checkout'

            checkout scm

       stage 'Test'

            env.NODE_ENV = "test"

            print "Environment will be : ${env.NODE_ENV}"
            print "Testing pull-requests"

            sh 'node -v'
            sh 'npm prune'
            sh 'npm install'

       stage 'Cleanup'

            echo 'prune and cleanup'
            sh 'npm prune'
            sh 'rm node_modules -rf'

        }


    catch (err) {

        currentBuild.result = "FAILURE"

        throw err
    }

}
