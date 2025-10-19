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
                
                // Column A - Name/Username
                entry.put("Name", getCell(row, 0));
                
                // Column B - Email (optional, not exposed)
                // String email = getCell(row, 1);
                
                // Column C - Profile URL
                entry.put("Profile URL", getCell(row, 2));
                
                // Column D - Institution (optional)
                entry.put("Institution", getCell(row, 3));
                
                // Column E - Enrollment Status (Yes/No)
                String enrollmentStatus = getCell(row, 4);
                entry.put("Enrolled", enrollmentStatus.equalsIgnoreCase("Yes"));
                
                // Column F - Profile Completed (Yes/No)
                String profileCompleted = getCell(row, 5);
                entry.put("Profile Completed", profileCompleted.equalsIgnoreCase("Yes"));
                
                // Column G - Skill Badges Completed (# of Skill Badges Completed)
                int skillBadges = parseInt(getCell(row, 6));
                entry.put("Skill Badges Completed", skillBadges);
                
                // Column H - Arcade Games (# of Arcade Game Completed)  
                int arcadeGames = parseInt(getCell(row, 7));
                entry.put("Arcade Games Completed", arcadeGames);
                
                // Column I - Trivia Games (# of Trivia Game Completed)
                int triviaGames = parseInt(getCell(row, 8));
                entry.put("Trivia Games Completed", triviaGames);
                
                // Column J - Total Completions (Skill Badges + Arcade + Trivia)
                int totalCompletions = skillBadges + arcadeGames + triviaGames;
                entry.put("Total Completions", totalCompletions);
                
                // Calculate points: Skill Badges = 2 points each, Arcade = 1 point, Trivia = 1 point
                int points = (skillBadges * 2) + arcadeGames + triviaGames;
                entry.put("Points", points);
                
                // Calculate progress percentage (out of expected completions, e.g., 15 skill badges + 15 arcade games)
                int expectedTotal = 30; // Adjust based on your program requirements
                int progress = totalCompletions > 0 ? Math.min(100, (totalCompletions * 100) / expectedTotal) : 0;
                entry.put("Progress", progress);
                
                // Verified status (based on profile completion and enrollment)
                boolean verified = profileCompleted.equalsIgnoreCase("Yes") && enrollmentStatus.equalsIgnoreCase("Yes");
                entry.put("Verified", verified);
                
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
