// Test script to verify API data mapping
// Run this in browser console to debug data issues

async function testAPIMapping() {
  console.log('🔍 Testing API data mapping...\n');
  
  try {
    const response = await fetch('https://gdg-ajce.onrender.com/api/leaderboard');
    const data = await response.json();
    
    console.log('✅ API Response received');
    console.log(`📊 Total records: ${data.length}\n`);
    
    // Check first record structure
    console.log('📝 First record from API:');
    console.log(JSON.stringify(data[0], null, 2));
    console.log('\n');
    
    // Map the data (same logic as in Leaderboard.jsx)
    const mapped = data.map((row, index) => ({
      id: row['Profile URL'] || row.Name || String(index),
      name: row.Name || row.name || '',
      handle: row['Profile URL'] || row.profileUrl || '',
      profileUrl: row['Profile URL'] || row.profileUrl || '',
      modules: row.modules || 0,
      points: row.points || 0,
      streak: row.streak || 0,
      progress: row.progress || 0,
      lastActivity: row.lastActivity || '',
      verified: !!row.verified,
      avatar: row.avatar || '',
      profileCompleted: row.profileCompleted || 'No',
      redeemed: row.redeemed || 0,
      syllabusCompleted: row.syllabusCompleted || 0,
      skillBadges: row['Skill Badges Completed'] || row.skillBadges || 0,
      arcadeGames: row['Arcade Games Completed'] || row.arcadeGames || 0,
      rank: index + 1
    }));
    
    console.log('✨ First record after mapping:');
    console.log(JSON.stringify(mapped[0], null, 2));
    console.log('\n');
    
    // Check for empty names
    const emptyNames = mapped.filter(m => !m.name || m.name.trim() === '');
    console.log(`⚠️  Records with empty names: ${emptyNames.length} out of ${mapped.length}`);
    
    if (emptyNames.length > 0) {
      console.log('First empty name record:');
      console.log(emptyNames[0]);
    }
    
    // Check field population
    const stats = {
      withNames: mapped.filter(m => m.name).length,
      withHandles: mapped.filter(m => m.handle).length,
      withProfileUrls: mapped.filter(m => m.profileUrl).length,
      withSkillBadges: mapped.filter(m => m.skillBadges > 0).length,
      withArcadeGames: mapped.filter(m => m.arcadeGames > 0).length,
    };
    
    console.log('\n📈 Data Statistics:');
    console.log(`Names populated: ${stats.withNames}/${mapped.length} (${(stats.withNames/mapped.length*100).toFixed(1)}%)`);
    console.log(`Handles populated: ${stats.withHandles}/${mapped.length} (${(stats.withHandles/mapped.length*100).toFixed(1)}%)`);
    console.log(`Profile URLs populated: ${stats.withProfileUrls}/${mapped.length} (${(stats.withProfileUrls/mapped.length*100).toFixed(1)}%)`);
    console.log(`Skill Badges > 0: ${stats.withSkillBadges}/${mapped.length}`);
    console.log(`Arcade Games > 0: ${stats.withArcadeGames}/${mapped.length}`);
    
    console.log('\n✅ Test complete!');
    return { original: data, mapped, stats, emptyNames };
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return null;
  }
}

// Run the test
testAPIMapping().then(result => {
  if (result) {
    window.testResult = result; // Store for further inspection
    console.log('\n💡 Tip: Access results via window.testResult');
  }
});
