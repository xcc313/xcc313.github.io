/**

ssl fingerprint

openssl s_client -connect sc.ftqq.com:443
echo '' >ssl.perm
openssl x509 -noout -in ./ssl.perm -fingerprint -sha1

3A:B1:76:BF:65:F2:9D:BA:78:E4:22:90:73:53:74:B8:51:E6:B4:A4
rm split char
3A B1 76 BF 65 F2 9D BA 78 E4 22 90 73 53 74 B8 51 E6 B4 A4

openssl s_client -connect sc.ftqq.com:443 2>/dev/null </dev/null | sed -ne '/-BEGIN CERTIFICATE-/,/-END CERTIFICATE-/p' | openssl x509 -noout -fingerprint -sha1

Ticker cant't call http
*/

#include <Arduino.h>
#include "Ticker.h"
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266httpUpdate.h>

#define USE_SERIAL Serial

#ifndef APSSID
#define APSSID "NETGEAR"
#define APPSK  "pwd"
#endif

#define SSL_PORT 443

ESP8266WiFiMulti WiFiMulti;

Ticker ticker;
Ticker otaTicker;

int unHealthCount=0;

int checkTimes=0;

int otaTimes=0;

void update_started() {
  USE_SERIAL.println("CALLBACK:  HTTP update process started");
}

void update_finished() {
  USE_SERIAL.println("CALLBACK:  HTTP update process finished");
}

void update_progress(int cur, int total) {
  USE_SERIAL.printf("CALLBACK:  HTTP update process at %d of %d bytes...\n", cur, total);
}

void update_error(int err) {
  USE_SERIAL.printf("CALLBACK:  HTTP update fatal error code %d\n", err);
}

void ota(){
    if ((WiFiMulti.run() == WL_CONNECTED) && otaTimes == 1) {
      otaTimes = 0;
      
      WiFiClient client;
      // The line below is optional. It can be used to blink the LED on the board during flashing
      // The LED will be on during download of one buffer of data from the network. The LED will
      // be off during writing that buffer to flash
      ESPhttpUpdate.setLedPin(LED_BUILTIN, LOW);
  
      // Add optional callback notifiers
      ESPhttpUpdate.onStart(update_started);
      ESPhttpUpdate.onEnd(update_finished);
      ESPhttpUpdate.onProgress(update_progress);
      ESPhttpUpdate.onError(update_error);
  
      t_httpUpdate_return ret = ESPhttpUpdate.update(client, "http://192.168.50.63/ota_v3.bin");
  
      switch (ret) {
        case HTTP_UPDATE_FAILED:
          USE_SERIAL.printf("HTTP_UPDATE_FAILD Error (%d): %s\n", ESPhttpUpdate.getLastError(), ESPhttpUpdate.getLastErrorString().c_str());
          break;
  
        case HTTP_UPDATE_NO_UPDATES:
          USE_SERIAL.println("HTTP_UPDATE_NO_UPDATES");
          break;
  
        case HTTP_UPDATE_OK:
          USE_SERIAL.println("HTTP_UPDATE_OK");
          break;
    }
   }
}

void checkWebService() {
    if ((WiFiMulti.run() == WL_CONNECTED) && checkTimes == 1) {
      checkTimes = 0;
      HTTPClient http;
      Serial.print("begin checkWebService requesting : ");  
      http.begin("https://www.18join.com/initcfg", "AB 43 60 BB D4 B4 FD 51 6C EB 8B C8 8E 55 33 A2 DC 05 9D E2");
      http.addHeader("Accept", "application/json");
      int httpCode = http.GET();
      if (httpCode > 0 && httpCode == HTTP_CODE_OK) {
          String payload = http.getString();
          Serial.println(payload);
          unHealthCount=0;
      } else {
          unHealthCount++;
          Serial.printf("[HTTP] ... code: %d", httpCode);
          Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
      http.end();
    }
}


void setup() {
  USE_SERIAL.begin(115200);
  // USE_SERIAL.setDebugOutput(true);

  for (uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(APSSID, APPSK);

  while (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.println("Connection Failed! Rebooting...");
    delay(5000);
    ESP.restart();
  }
  
  ticker.attach(6, []() { checkTimes=1; });

  otaTicker.attach(60, []() { otaTimes=1; });


  pinMode(LED_BUILTIN, OUTPUT);     // Initialize the LED_BUILTIN pin as an output
  digitalWrite(LED_BUILTIN, HIGH);
}

void alertWebService() {
  if(unHealthCount >= 3){
    digitalWrite(LED_BUILTIN, LOW); 
    HTTPClient http;
    IPAddress ip = WiFi.localIP();
    char buffer[4];
    sprintf(buffer,"%d:%d:%d:%d", ip[0],ip[1],ip[2],ip[3]); 
    
    String url="https://sc.ftqq.com/xxxxxxx.send?text=ESP-Service-Check-Alert&desp=18join.com-From-"+String(buffer);
    Serial.print("begin alert requesting URL:"+url);  
    http.begin(url,"E5 22 45 4E E9 F4 28 FE 1A A3 99 EB 8C EE A8 48 BD E6 07 CA");
    int httpCode = http.GET();
    if (httpCode > 0 && httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      Serial.println(payload);
      digitalWrite(LED_BUILTIN, HIGH);
          unHealthCount=-8;
    } else {
          unHealthCount=0;
      Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();
   }
}



void loop() {
  // wait for WiFi connection
  if ((WiFiMulti.run() == WL_CONNECTED)) {
    
    checkWebService();

    alertWebService();

    ota();
  }
}
