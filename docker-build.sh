#!/usr/bin/env bash

tar --exclude=config/deployment.json --exclude=override/deployment.json --exclude=kube --exclude=api/public --exclude=node_modules --exclude=*.tar.gz --exclude=.nyc_output --exclude=tags --exclude=.git --exclude=coverage --exclude=.vscode/ --exclude=.nyc_output/ -cvf app.tar.gz ./

docker build -t cerberos -f Dockerfile .;

if [ $# -ne 0 ]
  then
      echo "pushing to remote repo";
      $(aws ecr get-login --region ap-south-1 | sed -e 's/-e none//g');
      docker tag cerberos sumanta23/cerberos:latest
      docker push sumanta23/cerberos:latest
fi

rm app.tar.gz
