exit_handler() {
    echo "Stopping port forwarding."
    
    return 0
}

trap "exit" INT TERM ERR
trap exit_handler EXIT

source ~/.zshrc.parkbee
k8pp
echo "Switching to preprod context... DONE."

echo "Forwarding ports..."

# kubectl port-forward service/abproxy  5100:80 -n test &
kubectl port-forward service/api-client-management-test 5101:80 -n test &
# kubectl port-forward service/api-documentation-test 5102:80 -n test &
kubectl port-forward service/api-test 5102:443 -n test & ## it looks like this may be ssl also internally
kubectl port-forward service/authentication-test 5103:80 -n test &
kubectl port-forward service/authorization-test 5104:80 -n test &
kubectl port-forward service/availability-test 5105:80 -n test &
# kubectl port-forward service/availability-test-scheduler 5106:80 -n test &
# kubectl port-forward service/camera-acl-pusher-test 5107:80 -n test &
# kubectl port-forward service/camera-data-scraper-test 5108:80 -n test &
# kubectl port-forward service/cron-scheduler-test 5109:80 -n test &
# kubectl port-forward service/cron-scheduler-test-postgresql 5110:80 -n test &
# kubectl port-forward service/cron-scheduler-test-postgresql-headless 5111:80 -n test &
kubectl port-forward service/data-event-aggregator-test 5112:80 -n test &
# kubectl port-forward service/details 5113:80 -n test &
# kubectl port-forward service/elasticsearch-master 5114:80 -n test &
# kubectl port-forward service/elasticsearch-master-headless 5115:80 -n test &
kubectl port-forward service/file-management-test 5116:80 -n test &
kubectl port-forward service/garage-access-service-test 5117:80 -n test &
# kubectl port-forward service/garage-access-vs-testing 5118:80 -n test &
kubectl port-forward service/garage-management-service-test 5119:80 -n test &
kubectl port-forward service/go-api-test 5120:80 -n test &
# kubectl port-forward service/go-app-test 5121:80 -n test &
kubectl port-forward service/go-service-test 5122:80 -n test &
# kubectl port-forward service/integration-consumers-test 5123:80 -n test &
kubectl port-forward service/invoicing-test 5124:80 -n test &
# kubectl port-forward service/lb-wp 5125:80 -n test &
# kubectl port-forward service/mailer-test 5126:80 -n test &
# kubectl port-forward service/maps-api-test 5127:80 -n test &
# kubectl port-forward service/maps-api-test-redis-headless 5128:80 -n test &
# kubectl port-forward service/maps-api-test-redis-master 5129:80 -n test &
# kubectl port-forward service/maps-api-test-redis-slave 5130:80 -n test &
# kubectl port-forward service/maps-app-ab-test 5131:80 -n test &
# kubectl port-forward service/maps-app-ab-test-proxy 5132:80 -n test &
# kubectl port-forward service/maps-app-test 5133:80 -n test &
# kubectl port-forward service/mapsruurd 5134:80 -n test &
# kubectl port-forward service/monitor-vpn-simservice 5135:80 -n test &
kubectl port-forward service/mygarage-test 5136:80 -n test &
kubectl port-forward service/owner-portal-api-test 5137:80 -n test &
kubectl port-forward service/partner-support-api-test 5138:80 -n test &
kubectl port-forward service/partner-support-test 5139:80 -n test &
kubectl port-forward service/payment-test 5140:80 -n test &
# kubectl port-forward service/payment-test-postgresql 5141:80 -n test &
# kubectl port-forward service/payment-test-postgresql-headless 5142:80 -n test &
kubectl port-forward service/prepaid-service-test 5143:80 -n test &
kubectl port-forward service/pricing-test 5144:80 -n test &
# kubectl port-forward service/productpage 5145:80 -n test &
# kubectl port-forward service/ratings 5146:80 -n test &
# kubectl port-forward service/revenue-service-test 5147:80 -n test &
# kubectl port-forward service/reviews 5148:80 -n test &
kubectl port-forward service/savant-api-test 5149:80 -n test &
kubectl port-forward service/savant-test 5150:80 -n test &
kubectl port-forward service/search-service-test 5151:80 -n test &
# kubectl port-forward service/shiftapi 5152:80 -n test &
# kubectl port-forward service/sms-service-test 5153:80 -n test &
# kubectl port-forward service/staging-parkbeecom 5154:80 -n test &
# kubectl port-forward service/staging-parkbeecom-proxy 5155:80 -n test &
kubectl port-forward service/subscriptions-test 5156:80 -n test &
kubectl port-forward service/user-management-service-test 5157:80 -n test &
kubectl port-forward service/user-portal-api-test 5158:80 -n test &
# kubectl port-forward service/user-portal-app-test 5159:80 -n test &
kubectl port-forward service/visitor-access-api-test 5160:80 -n test &
kubectl port-forward service/visitor-access-app-test 5161:80 -n test &
# kubectl port-forward service/weather 5162:80 -n test &
# kubectl port-forward service/webhook-receiver-test 5163:80 -n test &
kubectl port-forward service/discount-service-test 5164:80 -n test &
# Databases
kubectl port-forward service/availability-test-mongodb 5300:27017 -n test &
kubectl port-forward service/go-service-test-mongodb 5301:27017 -n test &
kubectl port-forward service/discount-service-test-mongodb 5302:27017 -n test &
kubectl port-forward service/garage-access-service-test-mongodb 5303:27017 -n test &

wait
