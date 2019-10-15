kubectl	create namespace esspace
kubectl -n esspace create -f es-discovery-svc.yaml
kubectl -n esspace create -f es-svc.yaml

kubectl -n esspace create -f es-master-svc.yaml
kubectl -n esspace create -f es-master-stateful.yaml
kubectl -n esspace rollout status -f es-master-stateful.yaml

kubectl -n esspace create -f es-data-svc.yaml
kubectl -n esspace create -f es-data-stateful.yaml
kubectl -n esspace rollout status -f es-data-stateful.yaml
