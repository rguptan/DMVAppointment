docker build -t puppeteer .

docker run -it --rm -e FIRST_NAME=Rajesh -e SLEEP=60000 -e LAST_NAME=Gupta -e AREACODE=602 -e TELPREFIX=555 -e TELSUFFIX=6666 -e OFFICE_CODE=644 -e TARGET_DATE=2018-02-07 puppeteer
