import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATASET_PATH = './storage/datasets/inat-endpoints';
const OUTPUT_PATH = './inat-api-endpoints.json';

interface EndpointData {
  endpoint: {
    url: string;
    method: string;
    section: string;
    description: string;
  };
  authentication: {
    type: string;
    required: boolean;
  } | null;
  parameters: {
    query: Array<{
      name: string;
      type: string;
      description: string;
      required: boolean;
    }>;
    total: number;
  };
  request: {
    payload: any;
    contentType: string | null;
  };
  response: {
    example: any;
    format: string | null;
  };
  metadata: {
    extractedAt: string;
    source: string;
  };
}

async function consolidateData() {
  try {
    const files = readdirSync(DATASET_PATH).filter(file => file.endsWith('.json'));
    const endpoints: EndpointData[] = [];
    
    console.log(`Found ${files.length} JSON files to consolidate`);
    
    for (const file of files) {
      const filePath = join(DATASET_PATH, file);
      const content = readFileSync(filePath, 'utf-8');
      
      try {
        const endpointData = JSON.parse(content);
        endpoints.push(endpointData);
      } catch (error) {
        console.error(`Error parsing ${file}:`, error);
      }
    }
    
    // Sort endpoints by method and URL for better organization
    endpoints.sort((a, b) => {
      if (a.endpoint.method !== b.endpoint.method) {
        return a.endpoint.method.localeCompare(b.endpoint.method);
      }
      return a.endpoint.url.localeCompare(b.endpoint.url);
    });
    
    const consolidatedData = {
      meta: {
        totalEndpoints: endpoints.length,
        extractedAt: new Date().toISOString(),
        source: 'iNaturalist API Documentation',
        methods: [...new Set(endpoints.map(e => e.endpoint.method))].sort(),
        authRequired: endpoints.filter(e => e.authentication?.required).length,
        withPayload: endpoints.filter(e => e.request.payload).length,
        withResponse: endpoints.filter(e => e.response.example).length
      },
      endpoints: endpoints
    };
    
    writeFileSync(OUTPUT_PATH, JSON.stringify(consolidatedData, null, 2));
    
    console.log(`\n📊 Consolidation Summary:`);
    console.log(`   Total endpoints: ${consolidatedData.meta.totalEndpoints}`);
    console.log(`   HTTP methods: ${consolidatedData.meta.methods.join(', ')}`);
    console.log(`   Auth required: ${consolidatedData.meta.authRequired}`);
    console.log(`   With payload: ${consolidatedData.meta.withPayload}`);
    console.log(`   With response: ${consolidatedData.meta.withResponse}`);
    console.log(`\n💾 Consolidated data saved to: ${OUTPUT_PATH}`);
    
    // Show sample endpoints by method
    console.log(`\n🔍 Sample endpoints by method:`);
    for (const method of consolidatedData.meta.methods) {
      const methodEndpoints = endpoints.filter(e => e.endpoint.method === method);
      console.log(`   ${method}: ${methodEndpoints.length} endpoints`);
      if (methodEndpoints.length > 0) {
        console.log(`     Example: ${method} ${methodEndpoints[0].endpoint.url}`);
      }
    }
    
  } catch (error) {
    console.error('Error consolidating data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  consolidateData();
}