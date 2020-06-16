import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Formatter;

/**
 * @author ljt
 * @version 1.0
 * @date 2019/9/3 16:03
 */
public class SignUtil {
    private static final String HMAC_SHA1_ALGORITHM = "HmacSHA1";
    private static String toHexString(byte[] bytes) {
        Formatter formatter = new Formatter();
        for (byte b : bytes) {
            formatter.format("%02x", b);
        }
        return formatter.toString();
    }

    public static String re(String data, String key) throws Exception {
        SecretKeySpec signingKey = new SecretKeySpec(key.getBytes(), HMAC_SHA1_ALGORITHM);
        Mac mac = Mac.getInstance(HMAC_SHA1_ALGORITHM);
        mac.init(signingKey);
        return toHexString(mac.doFinal(data.getBytes()));

    }

    public static void  main(String args[]) throws Exception{
        String productKey = "a1pxdg4PlSl";
        String deviceName = "esp8266_01";
        String deviceSecret = "nbxeZAOsEpglHkZB1RwnyFefKMag7jgr";
        String clientId = "esp8266";
        String region = "cn-shanghai";
        String data = "clientId" + clientId + "deviceName" + deviceName + "productKey" + productKey + "timestamp1234567890";

        System.out.println("address  : " + productKey + ".iot-as-mqtt." + region + ".aliyuncs.com");
        System.out.println("clientId : " + clientId + "|securemode=3,signmethod=hmacsha1,timestamp=1234567890|");
        System.out.println("userName : " + deviceName + "&" + productKey);
        System.out.println("passwd   : " + re(data, deviceSecret).toUpperCase());
    }


}
