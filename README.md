# nrhub
## 0. create a kubernetes cluster. eg. by the use of azure AKS or any other k8s
In the case for AKS, after the creation is finishd you can connect to your cluster:
```
az account set --subscription e4f45774-xxxx-xxxx-xxxx
az login
az aks get-credentials --resource-group hubcluster --name hubcluster
```
now the command 
```
kubectl get pods
```
shall work.

## 1. configure and install
in a terminal where the comand kubectl is available and connected to your k8s cluster run the script _deploy.sh_

But before adjust the values for the base url/domain in the config.yaml file.
- azuread admin group (--> members of this group will have admin access on the hub and can impersonate all users to access their instances. Eg. to help for creating flows.)
- oauth client secret / client id
- optional use your own node-red image (see the Dockerfile)

The Steps inside are:
1. create a namespace
2. create self signed certificate for initial purpose -> later you have to replace the cert and the key in the kubernetes secret with productive ones
3. deploy the ingress controler
4. install the [jupyterhub](https://zero-to-jupyterhub.readthedocs.io/en/latest/)
5. create a configmap for the node-red settings.js which is shared among all user instances
6. a helper job is started which creates a shared disk for the node_modules and populates it accodring to the package.json file

After a while you can visit your own node-red-hub or go here: [https://nrhub.vlab.education/](https://nrhub.vlab.education/)

Additional mandatory steps needed:
- replace the cert and the key in the secret for propper tls functionality
- create a DNS A record to point to the loadbalancer external IP

