package com.gdg.backend.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;

@Service
public class GoogleSheetService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleSheetService.class);

    @Value("${sheet.id}")
    private String SHEET_ID;

    private static final String RANGE = "Sheet1!A2:D";

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

    private Sheets getSheetsService() throws IOException, GeneralSecurityException {
        if (privateKey == null) {
            throw new IllegalStateException("GOOGLE_PRIVATE_KEY is not set!");
        }

        // Replace literal \n with actual line breaks
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


    public List<Map<String, String>> getLeaderboardData() {
        List<Map<String, String>> leaderboard = new ArrayList<>();
        try {
            Sheets service = getSheetsService();
            ValueRange response = service.spreadsheets().values().get(SHEET_ID, RANGE).execute();
            List<List<Object>> values = response.getValues();

            if (values == null || values.isEmpty()) {
                logger.warn("No data found in the sheet.");
                return leaderboard;
            }

            for (List<Object> row : values) {
                Map<String, String> entry = new LinkedHashMap<>();
                entry.put("Rank", getCell(row, 0));
                entry.put("Name", getCell(row, 1));
                entry.put("Score", getCell(row, 2));
                entry.put("College", getCell(row, 3));
                leaderboard.add(entry);
            }

        } catch (IOException | GeneralSecurityException e) {
            logger.error("Error fetching Google Sheet data", e);
        }
        return leaderboard;
    }

    private String getCell(List<Object> row, int index) {
        return (row.size() > index && row.get(index) != null) ? row.get(index).toString() : "";
    }
}
