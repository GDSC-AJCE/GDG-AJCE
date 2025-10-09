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

    // Include up to column K
    private static final String RANGE = "Sheet1!A2:K";

    public GoogleSheetService(GoogleSheetsConfig googleSheetsConfig) {
        this.googleSheetsConfig = googleSheetsConfig;
    }

    public List<Map<String, Object>> getSheetData() {
        List<Map<String, Object>> results = new ArrayList<>();
        try {
            Sheets service = googleSheetsConfig.getSheetsService();
            ValueRange response = service.spreadsheets().values().get(SHEET_ID, RANGE).execute();
            List<List<Object>> values = response.getValues();

            if (values == null || values.isEmpty()) {
                logger.warn("No data found in the sheet.");
                return results;
            }

            for (List<Object> row : values) {
                Map<String, Object> entry = new LinkedHashMap<>();
                entry.put("Name", getCell(row, 0));  // Column A - Username
                entry.put("Profile URL", getCell(row, 2));  // Column C - Google Cloud Skills Boost Profile URL
                entry.put("Skill Badges Completed", parseInt(getCell(row, 6))); // Column G
                entry.put("Arcade Games Completed", parseInt(getCell(row, 8))); // Column I
                results.add(entry);
            }

        } catch (IOException | GeneralSecurityException e) {
            logger.error("Error fetching Google Sheet data", e);
        }
        return results;
    }

    private String getCell(List<Object> row, int index) {
        return (row.size() > index && row.get(index) != null) ? row.get(index).toString() : "";
    }

    // Utility method to parse integers
    private int parseInt(String value) {
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
