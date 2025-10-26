package com.gdg.backend.config;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Configuration
public class GoogleSheetsConfig {

    @Value("${GOOGLE_PROJECT_ID}")
    private String projectId;

    @Value("${GOOGLE_PRIVATE_KEY}")
    private String privateKey;

    @Value("${GOOGLE_PRIVATE_KEY_ID}")
    private String privateKeyId;

    @Value("${GOOGLE_CLIENT_EMAIL}")
    private String clientEmail;

    @Value("${GOOGLE_CLIENT_ID}")
    private String clientId;

    @Value("${GOOGLE_AUTH_URI}")
    private String authUri;

    @Value("${GOOGLE_TOKEN_URI}")
    private String tokenUri;

    @Value("${GOOGLE_AUTH_PROVIDER_CERT_URL}")
    private String authProviderCertUrl;

    @Value("${GOOGLE_CLIENT_CERT_URL}")
    private String clientCertUrl;

    public Sheets getSheetsService() throws IOException, GeneralSecurityException {
        if (privateKey == null) {
            throw new IllegalStateException("GOOGLE_PRIVATE_KEY is not set!");
        }

        String formattedPrivateKey = privateKey.replace("\\n", "\n");

        String credentialsJson = "{"
                + "\"type\":\"service_account\","
                + "\"project_id\":\"" + projectId + "\","
                + "\"private_key_id\":\"" + privateKeyId + "\","
                + "\"private_key\":\"" + formattedPrivateKey + "\","
                + "\"client_email\":\"" + clientEmail + "\","
                + "\"client_id\":\"" + clientId + "\","
                + "\"auth_uri\":\"" + authUri + "\","
                + "\"token_uri\":\"" + tokenUri + "\","
                + "\"auth_provider_x509_cert_url\":\"" + authProviderCertUrl + "\","
                + "\"client_x509_cert_url\":\"" + clientCertUrl + "\""
                + "}";

        GoogleCredentials credentials = ServiceAccountCredentials.fromStream(
                new ByteArrayInputStream(credentialsJson.getBytes())
        ).createScoped(Collections.singleton(SheetsScopes.SPREADSHEETS_READONLY));

        return new Sheets.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                GsonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials)
        ).setApplicationName("LeaderboardApp").build();
    }
}
