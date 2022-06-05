#!/bin/bash

#create namespace
kubectl create ns jhub

# create a tls secret for the ingress controler
# BUT before put correct information in the files privkey.pem and fullchain.pem (eg. letsencrypt)
kubectl create secret tls vlab-education --cert https-certificates/fullchain.pem --key https-certificates/privkey.pem -njhub

# install the ingress controler
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx --version 4.0.13 \
--namespace jhub --create-namespace --values config-ingress.yaml \
--debug --set controller.metrics.enabled=true \
--set-string controller.podAnnotations."prometheus\.io/scrape"="true" \
--set-string controller.podAnnotations."prometheus\.io/port"="10254" \
--set controller.replicaCount=1 \
--set controller.nodeSelector."kubernetes\.io/os"=linux \
--set controller.admissionWebhooks.patch.nodeSelector."kubernetes\.io/os"=linux \
--set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz \
--set defaultBackend.nodeSelector."kubernetes\.io/os"=linux 

# install jupyterhub
helm upgrade --install nr jupyterhub/jupyterhub --namespace jhub --version 1.2.0  --values config.yaml --set-file hub.extraFiles.my_azuread.stringData=./patches/azuread.py

# supply the node-red settings file to the conatiners
kubectl create configmap nodered-settings --from-file=nodered/settings.js -njhub -o yaml --dry-run=client | kubectl apply -f -

# create a helper job which populates the shared-disk with the dir node_modules based on 
kubectl create -f helper.yaml

# waot for the job to be finished
kubectl wait --for=condition=complete --timeout=60s job/helper -njhub

