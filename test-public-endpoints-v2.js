const { INaturalistClient } = require('./dist/index.cjs');

async function testPublicEndpoints() {
  console.log('🧪 Testing Public Endpoints - No Authentication Required\n');
  
  const client = new INaturalistClient();
  
  const tests = [
    {
      name: 'Projects (General)',
      method: () => client.projects.get_projects(),
      description: 'Get public projects list'
    },
    {
      name: 'Project by ID',
      method: () => client.projects.get_projects_id(1),
      description: 'Get specific project details'
    },
    {
      name: 'Project Members',
      method: () => client.projects.get_projects_id_members(1),
      description: 'Get project members'
    },
    {
      name: 'Projects by User',
      method: () => client.projects.get_projects_user_login('arctic_mongoose'),
      description: 'Get projects by user login'
    },
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
      name: 'Observations (Public)',
      method: () => client.observations.get_observations(),
      description: 'Get public observations - already tested but included for completeness'
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
  
  console.log('\n🎯 Public Endpoints Testing Complete!');
}

testPublicEndpoints().catch(console.error);