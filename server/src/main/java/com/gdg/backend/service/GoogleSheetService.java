package com.gdg.backend.service;

import com.gdg.backend.confg.GoogleSheetsConfig;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;

@Service
public class GoogleSheetService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleSheetService.class);

    private final GoogleSheetsConfig googleSheetsConfig;

    @Value("${sheet.id}")
    private String SHEET_ID;

    private static final String RANGE = "Sheet1!A2:D";

    public GoogleSheetService(GoogleSheetsConfig googleSheetsConfig) {
        this.googleSheetsConfig = googleSheetsConfig;
    }

    public List<Map<String, String>> getLeaderboardData() {
        List<Map<String, String>> leaderboard = new ArrayList<>();
        try {
            Sheets service = googleSheetsConfig.getSheetsService();
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
