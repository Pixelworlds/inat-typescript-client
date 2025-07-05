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
      name: 'Observations (Public)',
      method: () => client.observations.get_observations(),
      description: 'Get public observations'
    },
    {
      name: 'Observations with Taxon Filter',
      method: () => client.observations.get_observations({ taxon_name: 'Quercus', per_page: 5 }),
      description: 'Get observations filtered by taxon'
    },
    {
      name: 'Observation Fields',
      method: () => client.observation_fields.get_observationfields(),
      description: 'Get observation field definitions'
    },
    {
      name: 'Places',
      method: () => client.places.get_places(),
      description: 'Get places/locations data'
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
  
  console.log('\n🧪 Testing Additional Methods in Other Modules\n');
  
  // Test methods that exist but may not be commonly used
  const additionalTests = [
    {
      name: 'Observations Module Methods',
      tests: [
        {
          method: 'get_observations_popular_field_values',
          call: () => client.observations.get_observations_popular_field_values ? client.observations.get_observations_popular_field_values() : null,
          description: 'Get popular field values for observations'
        },
        {
          method: 'get_observations_species_counts',
          call: () => client.observations.get_observations_species_counts ? client.observations.get_observations_species_counts() : null,
          description: 'Get species counts'
        },
        {
          method: 'get_observations_identifiers',
          call: () => client.observations.get_observations_identifiers ? client.observations.get_observations_identifiers() : null,
          description: 'Get observation identifiers'
        },
        {
          method: 'get_observations_observers',
          call: () => client.observations.get_observations_observers ? client.observations.get_observations_observers() : null,
          description: 'Get observation observers'
        }
      ]
    },
    {
      name: 'Users Module Methods',
      tests: [
        {
          method: 'get_users_edit',
          call: () => client.users.get_users_edit(),
          description: 'Get user edit form (may require auth)'
        },
        {
          method: 'get_users_newupdates',
          call: () => client.users.get_users_newupdates(),
          description: 'Get new user updates (may require auth)'
        }
      ]
    }
  ];

  for (const moduleTest of additionalTests) {
    console.log(`\n📦 ${moduleTest.name}`);
    for (const test of moduleTest.tests) {
      console.log(`\n  📍 Testing ${test.method}`);
      console.log(`     ${test.description}`);
      
      try {
        const result = await test.call();
        if (result === null) {
          console.log(`     ⚠️  Method ${test.method} not available`);
          continue;
        }
        
        console.log(`     ✅ Status: ${result.status}`);
        console.log(`     📊 Response type: ${typeof result.data}`);
        
        if (result.data && result.data.results) {
          console.log(`     📋 Results: ${result.data.results.length} items`);
        } else if (result.data && Array.isArray(result.data)) {
          console.log(`     📋 Array: ${result.data.length} items`);
        } else if (result.data) {
          console.log(`     📄 Object with keys: ${Object.keys(result.data).join(', ')}`);
        }
        
      } catch (error) {
        console.log(`     ❌ Error: ${error.response?.status || 'Network'} - ${error.message}`);
      }
    }
  }
  
  console.log('\n🎯 Public Endpoints Testing Complete!');
}

testPublicEndpoints().catch(console.error);