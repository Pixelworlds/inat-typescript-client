const { INaturalistClient } = require('./dist/index.cjs');

async function testPublicEndpoints() {
  console.log('🧪 Testing Public Endpoints - No Authentication Required\n');
  
  const client = new INaturalistClient();
  
  const tests = [
    {
      name: 'Places',
      method: () => client.places.get_places(),
      description: 'Get places/locations data'
    },
    {
      name: 'Observation Fields',
      method: () => client.observation_fields.get_observationfields(),
      description: 'Get observation field definitions'
    },
    {
      name: 'Identifications',
      method: () => client.identifications.get_identifications ? client.identifications.get_identifications() : null,
      description: 'Get identifications (if GET method exists)'
    },
    {
      name: 'Comments',
      method: () => client.comments.get_comments ? client.comments.get_comments() : null,
      description: 'Get comments (if GET method exists)'
    },
    {
      name: 'Project Observations',
      method: () => client.project_observations.get_project_observations ? client.project_observations.get_project_observations() : null,
      description: 'Get project observations (if GET method exists)'
    },
    {
      name: 'Observation Photos',
      method: () => client.observation_photos.get_observation_photos ? client.observation_photos.get_observation_photos() : null,
      description: 'Get observation photos (if GET method exists)'
    },
    {
      name: 'Observation Field Values',
      method: () => client.observation_field_values.get_observation_field_values ? client.observation_field_values.get_observation_field_values() : null,
      description: 'Get observation field values (if GET method exists)'
    }
  ];

  for (const test of tests) {
    console.log(`\n📍 Testing ${test.name}`);
    console.log(`   ${test.description}`);
    
    try {
      const result = await test.method();
      if (result === null) {
        console.log(`   ⚠️  No GET method available for ${test.name}`);
        continue;
      }
      
      console.log(`   ✅ Status: ${result.status}`);
      console.log(`   📊 Response type: ${typeof result.data}`);
      
      if (result.data) {
        if (Array.isArray(result.data)) {
          console.log(`   📋 Array with ${result.data.length} items`);
          if (result.data.length > 0) {
            console.log(`   🔍 First item keys: ${Object.keys(result.data[0]).join(', ')}`);
          }
        } else if (result.data.results && Array.isArray(result.data.results)) {
          console.log(`   📋 Results array with ${result.data.results.length} items`);
          if (result.data.results.length > 0) {
            console.log(`   🔍 First result keys: ${Object.keys(result.data.results[0]).join(', ')}`);
          }
        } else {
          console.log(`   📄 Object with keys: ${Object.keys(result.data).join(', ')}`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status || 'Network'} - ${error.message}`);
      if (error.response?.data) {
        console.log(`   📄 Error details: ${JSON.stringify(error.response.data).substring(0, 200)}...`);
      }
    }
  }
  
  console.log('\n🎯 Public Endpoints Testing Complete!');
}

testPublicEndpoints().catch(console.error);