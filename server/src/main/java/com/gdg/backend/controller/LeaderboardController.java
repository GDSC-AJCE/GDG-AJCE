package com.gdg.backend.controller;

import com.gdg.backend.service.GoogleSheetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final GoogleSheetService googleSheetService;

    @GetMapping
    public List<Map<String, Object>> getLeaderboard() throws IOException, GeneralSecurityException {
        return googleSheetService.getSheetData();
    }
}
