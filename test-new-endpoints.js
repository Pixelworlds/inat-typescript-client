const { INaturalistClient } = require('./dist/index.cjs');

async function testNewEndpoints() {
  console.log('🧪 Testing New Endpoints Added from Official Documentation\n');
  
  const client = new INaturalistClient();
  
  const tests = [
    {
      name: 'Taxa Search',
      method: () => client.taxa.get_taxa(),
      description: 'Search taxa endpoint'
    },
    {
      name: 'Taxa by ID',
      method: () => client.taxa.get_taxa_id(1),
      description: 'Get specific taxa details'
    },
    {
      name: 'Identifications',
      method: () => client.identifications.get_identifications(),
      description: 'Search identifications'
    },
    {
      name: 'Identifications Categories',
      method: () => client.identifications.get_identifications_categories(),
      description: 'Get identification categories'
    },
    {
      name: 'Controlled Terms',
      method: () => client.controlled_terms.get_controlled_terms(),
      description: 'Get controlled terms for annotations'
    },
    {
      name: 'Search',
      method: () => client.search.get_search(),
      description: 'Global search endpoint'
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const test of tests) {
    console.log(`\n📍 Testing ${test.name}`);
    console.log(`   ${test.description}`);
    
    try {
      const result = await test.method();
      
      console.log(`   ✅ Status: ${result.status}`);
      console.log(`   📊 Response type: ${typeof result.data}`);
      
      if (result.data && result.data.results && Array.isArray(result.data.results)) {
        console.log(`   📋 Results: ${result.data.results.length} items`);
        if (result.data.total_results !== undefined) {
          console.log(`   📊 Total available: ${result.data.total_results}`);
        }
      } else if (result.data && Array.isArray(result.data)) {
        console.log(`   📋 Array: ${result.data.length} items`);
      } else if (result.data) {
        console.log(`   📄 Object keys: ${Object.keys(result.data).join(', ')}`);
      }
      
      successCount++;
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.response?.status || 'Network'} - ${error.message}`);
      errorCount++;
    }
  }
  
  console.log('\n🎯 New Endpoints Testing Complete!');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total modules available: ${Object.keys(client).filter(key => typeof client[key] === 'object' && client[key].constructor.name !== 'INaturalistHttpClient').length}`);
  
  // List all available modules
  const modules = Object.keys(client).filter(key => typeof client[key] === 'object' && client[key].constructor.name !== 'INaturalistHttpClient');
  console.log(`\n📦 Available modules: ${modules.join(', ')}`);
}

testNewEndpoints().catch(console.error);