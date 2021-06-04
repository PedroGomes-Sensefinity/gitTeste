#!/bin/bash 

count=0
retry=6
sleep_value=10
app_name=$CI_PROJECT_TITLE
while [ $count -le $retry ]
do
        echo "Executing kubectl to check the new pod status retry $count / $retry "
        kubectl get pods -l app=$app_name
        output=`kubectl get pods -l app=$app_name | grep  -v -e Running -e READY|wc -l`
        if [ $output -gt "0" ]
        then
                echo "Pod is not running! sleeping for $sleep_value seconds"

                sleep $sleep_value
                if [ $count = $retry ]
                then
                        echo "Maximum retries reached !"
                        echo "Deployment failed! Please check logs with kubectl describe pod podname to find out the root cause"
                        echo "Note: $app_name is still running with the old build!"
                        exit 1
                fi
                count=$(($count + 1))
        else
                echo "Pod is running!"
                exit 0
        fi
done
