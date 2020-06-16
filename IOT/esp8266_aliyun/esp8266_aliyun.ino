//Vcc---Vcc
//GND---GND
//CS--- D8 / 1k ohm resistor
//Reset---D1
//D/C--- D2 /1k ohm resistor
//SDI/mosi---D7 / 1k ohm resistor
//SCK---D5 / 1k ohm resistor
//LED---Vcc

#include <ESP8266WiFi.h>
/* 依赖 PubSubClient 2.4.0 */
#include <PubSubClient.h>
/* 依赖 ArduinoJson 5.13.4 */
#include <ArduinoJson.h>

#include <WiFiUdp.h>
#include <WakeOnLan.h>

#define SENSOR_PIN    13

/* 修改1 ------------------------------------------ */
/* 连接您的WIFI SSID和密码 */
#define WIFI_SSID         "18Join"
#define WIFI_PASSWD       "$join2017"
/* 修改1 end--------------------------------------- */
 
/* 修改2 ------------------------------------------ */
/* 设备证书信息*/
#define PRODUCT_KEY       "a1pxdg4PlSl"
#define DEVICE_NAME       "esp8266_01"
#define DEVICE_SECRET     "nbxeZAOsEpglHkZB1RwnyFefKMag7jgr"
#define REGION_ID         "cn-shanghai"
/* 修改2 end--------------------------------------- */
 
/* 线上环境域名和端口号，不需要改 */
#define MQTT_SERVER       PRODUCT_KEY ".iot-as-mqtt." REGION_ID ".aliyuncs.com"
#define MQTT_PORT         1883
#define MQTT_USRNAME      DEVICE_NAME "&" PRODUCT_KEY
 
/* 修改3 ------------------------------------------ */
#define CLIENT_ID    "esp8266|securemode=3,signmethod=hmacsha1,timestamp=1234567890|"
// 请使用以上说明中的加密工具或参见MQTT-TCP连接通信文档加密生成password。
// 加密明文是参数和对应的值（clientIdesp8266deviceName${deviceName}productKey${productKey}timestamp1234567890）按字典顺序拼接
// 密钥是设备的DeviceSecret
#define MQTT_PASSWD       "2852C5060CE2C5E8FF5DC304362AC75DF0166175"
/* 修改3 end--------------------------------------- */
 
#define ALINK_BODY_FORMAT         "{\"id\":\"123\",\"version\":\"1.0\",\"method\":\"thing.event.property.post\",\"params\":%s}"
#define ALINK_TOPIC_PROP_POST     "/sys/" PRODUCT_KEY "/" DEVICE_NAME "/thing/event/property/post"
#define ALINK_TOPIC_PROP_SUB      PRODUCT_KEY "/" DEVICE_NAME "/user/device_boot"
 
unsigned long lastMs = 0;
unsigned long lastLED = 0;
WiFiClient espClient;
PubSubClient  client(espClient);

WiFiUDP UDP;
WakeOnLan WOL(UDP);

void wakeMyPC() {
    const char *MACAddress = "DC:71:96:A2:9E:00";
  
    WOL.sendMagicPacket(MACAddress); // Send Wake On Lan packet with the above MAC address. Default to port 9.
    // WOL.sendMagicPacket(MACAddress, 7); // Change the port number
}

void wakeOfficePC() {
    const char *MACAddress = "01:23:45:67:89:AB";
    const char *secureOn = "FE:DC:BA:98:76:54";
  
    WOL.sendSecureMagicPacket(MACAddress, secureOn); // Send Wake On Lan packet with the above MAC address and SecureOn feature. Default to port 9.
    // WOL.sendSecureMagicPacket(MACAddress, secureOn, 7); // Change the port number
}


//***display***//
void callback(char *topic, byte *payload, unsigned int length)
{
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    payload[length] = '\0';
    Serial.println((char *)payload);



  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == '1') {
    lastLED = 1;
    digitalWrite(BUILTIN_LED, LOW); // Turn the LED on (Note that LOW is the voltage level
  } else {
    lastLED = 0;
    digitalWrite(BUILTIN_LED, HIGH);  // Turn the LED off by making the voltage HIGH
  }
  
  if ((char)payload[0] == 'wol') {
    Serial.print("WOL Staring...");
    WOL.calculateBroadcastAddress(WiFi.localIP(), WiFi.subnetMask()); // Optional  => To calculate the broadcast address, otherwise 255.255.255.255 is used (which is denied in some networks).
    wakeMyPC();
  }
}
 
 
void wifiInit()
{
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWD);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("WiFi not Connect");
    }
 
    Serial.println("Connected to AP");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    
    Serial.print("espClient [");
 
    client.setServer(MQTT_SERVER, MQTT_PORT);   /* 连接WiFi之后，连接MQTT服务器 */
    client.setCallback(callback);
}
 
 
void mqttCheckConnect()
{
    while (!client.connected())
    {
        Serial.println("Connecting to MQTT Server ...");
        if (client.connect(CLIENT_ID, MQTT_USRNAME, MQTT_PASSWD))
 
        {
 
            Serial.println("MQTT Connected!");
            client.subscribe(ALINK_TOPIC_PROP_SUB);
 
        }
        else
        {
            Serial.print("MQTT Connect err:");
            Serial.println(client.state());
            delay(5000);
        }
    }
}
 
 
void mqttIntervalPost()
{
    char param[32];
    char jsonBuf[128];
    sprintf(param, "{\"USBSwitch_1\":%d}", lastLED);
    sprintf(jsonBuf, ALINK_BODY_FORMAT, param);
    Serial.println(jsonBuf);
    boolean d = client.publish(ALINK_TOPIC_PROP_POST, jsonBuf);
    Serial.print("上传数据");
    Serial.println(d);
}

void setup() 
{
    // Initialize the BUILTIN_LED pin as an output
    pinMode(BUILTIN_LED, OUTPUT);    
    delay(1000);
    digitalWrite(BUILTIN_LED, HIGH); 
    /* initialize serial for debugging */
    Serial.begin(115200);
    wifiInit();

}   

// the loop function runs over and over again forever
void loop()
{
    if (millis() - lastMs >= 50000)
    {
        lastMs = millis();
        mqttCheckConnect(); 
        /* 上报消息心跳周期 */
        mqttIntervalPost();
    }
 
    client.loop();
}
