const { INaturalistClient } = require('./dist/index.cjs');

async function testObservationEndpoints() {
  console.log('🧪 Testing Additional Observation Endpoints\n');
  
  const client = new INaturalistClient();
  
  const tests = [
    {
      name: 'Observation by ID',
      method: () => client.observations.get_observations_id(1),
      description: 'Get specific observation by ID'
    },
    {
      name: 'Observations by Username',
      method: () => client.observations.get_observations_username('arctic_mongoose'),
      description: 'Get observations by username'
    },
    {
      name: 'Observations by Project ID',
      method: () => client.observations.get_observations_project_id(1),
      description: 'Get observations from specific project'
    },
    {
      name: 'Observations Taxon Stats',
      method: () => client.observations.get_observations_taxonstats(),
      description: 'Get taxon statistics from observations'
    },
    {
      name: 'Observations User Stats',
      method: () => client.observations.get_observations_userstats(),
      description: 'Get user statistics from observations'
    }
  ];

  for (const test of tests) {
    console.log(`\n📍 Testing ${test.name}`);
    console.log(`   ${test.description}`);
    
    try {
      const result = await test.method();
      
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
          if (result.data.total_results !== undefined) {
            console.log(`   📊 Total results available: ${result.data.total_results}`);
          }
        } else {
          console.log(`   📄 Object with keys: ${Object.keys(result.data).join(', ')}`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status || 'Network'} - ${error.message}`);
      if (error.response?.data) {
        const errorData = typeof error.response.data === 'string' 
          ? error.response.data.substring(0, 200) 
          : JSON.stringify(error.response.data).substring(0, 200);
        console.log(`   📄 Error details: ${errorData}...`);
      }
    }
  }
  
  console.log('\n🎯 Observation Endpoints Testing Complete!');
}

testObservationEndpoints().catch(console.error);