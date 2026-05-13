package com.sky.test;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
public class HttpClientTest {

    // httpclient send request in GET way
    @Test
    public void testGet() throws IOException {
        // create httpclient object
        CloseableHttpClient httpClient = HttpClients.createDefault();

        // create request object
        HttpGet httpGet = new HttpGet("http://localhost:8080/user/shop/status");

        // send request and receive response
        CloseableHttpResponse response = httpClient.execute(httpGet);

        // get response status code
        int statusCode = response.getStatusLine().getStatusCode();
        System.out.println("status code of response is: "+ statusCode);

        HttpEntity entity = response.getEntity();
        String body = EntityUtils.toString(entity);
        System.out.println("response data is: "+body);

        // close resources
        response.close();
        httpClient.close();

    }

    // httpclient send request in POST way
}
