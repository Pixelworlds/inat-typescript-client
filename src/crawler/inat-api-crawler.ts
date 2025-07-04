import { Dataset, log, PlaywrightCrawler } from 'crawlee';

interface EndpointData {
  url: string;
  method: string;
  authentication: string | null;
  queryParams: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
  }>;
  payload: any;
  response: any;
  description: string;
  section: string;
}

export class INaturalistAPICrawler {
  private crawler: PlaywrightCrawler;

  constructor() {
    this.crawler = new PlaywrightCrawler({
      requestHandler: async ({ request, page }) => {
        log.info(`Processing page: ${request.url}`);

        page.setDefaultTimeout(60000);

        await this.extractEndpoints(page, request.url);
      },
      failedRequestHandler: async ({ request, error }) => {
        log.error(`Request failed for ${request.url}: ${error instanceof Error ? error.message : String(error)}`);
      },
      maxRequestsPerCrawl: 1000,
      maxConcurrency: 1,
      requestHandlerTimeoutSecs: 120,
      navigationTimeoutSecs: 60,
      launchContext: {
        launchOptions: {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--proxy-server=direct://',
            '--proxy-bypass-list=*',
          ],
        },
      },
      preNavigationHooks: [
        async ({ page }) => {
          await page.setExtraHTTPHeaders({
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            Connection: 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          });
        },
      ],
    });
  }

  private async extractEndpoints(page: any, url: string): Promise<void> {
    const endpoints: EndpointData[] = [];

    const headings = await page.$$('h2, h3, h4');

    for (const heading of headings) {
      const headingText = await heading.textContent();

      if (!this.isEndpointHeading(headingText || '')) {
        continue;
      }

      const endpoint = await this.extractEndpointFromSection(page, heading);
      if (endpoint) {
        endpoints.push(endpoint);
      }
    }

    const highlightTables = await page.$$('table.highlight[data-hpc]');

    for (const table of highlightTables) {
      const endpoint = await this.extractEndpointFromHighlightTable(page, table);
      if (endpoint) {
        endpoints.push(endpoint);
      }
    }

    const codeBlocks = await page.$$('pre, code');

    for (const codeBlock of codeBlocks) {
      const content = await codeBlock.textContent();

      const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      for (const method of httpMethods) {
        if (content?.includes(method) && content?.includes('http')) {
          const endpoint = await this.extractEndpointFromCodeBlock(page, codeBlock, method);
          if (endpoint) {
            endpoints.push(endpoint);
          }
        }
      }
    }

    const uniqueEndpoints = endpoints.filter(
      (endpoint, index, self) => index === self.findIndex(e => e.url === endpoint.url && e.method === endpoint.method)
    );

    for (const endpoint of uniqueEndpoints) {
      const formattedEndpoint = this.formatEndpointForOutput(endpoint);
      await Dataset.pushData(formattedEndpoint);
    }

    log.info(`Extracted ${uniqueEndpoints.length} unique endpoints from ${url}`);
  }

  private isEndpointHeading(text: string): boolean {
    const endpointPatterns = [/^(GET|POST|PUT|DELETE|PATCH)\s+/i, /\/[a-zA-Z0-9_\-\/{}:]+/, /endpoint/i, /api/i];

    return endpointPatterns.some(pattern => pattern.test(text));
  }

  private async extractEndpointFromSection(page: any, heading: any): Promise<EndpointData | null> {
    const headingText = await heading.textContent();
    const section = await this.findParentSection(page, heading);

    const methodMatch = headingText?.match(/^(GET|POST|PUT|DELETE|PATCH)\s+(.+)/i);
    let method = 'GET';
    let url = '';

    if (methodMatch) {
      method = methodMatch[1].toUpperCase();
      url = methodMatch[2].trim();
    } else {
      const urlMatch = headingText?.match(/\/[a-zA-Z0-9_\-\/{}:]+/);
      if (urlMatch) {
        url = urlMatch[0];
      }
    }

    if (!url) {
      return null;
    }

    const authentication = await this.extractAuthentication(page, heading);

    const queryParams = await this.extractParameters(page, heading);

    const { payload, response } = await this.extractPayloadAndResponse(page, heading);

    const description = await this.extractDescription(page, heading);

    return {
      url,
      method,
      authentication,
      queryParams,
      payload,
      response,
      description,
      section,
    };
  }

  private async extractEndpointFromCodeBlock(page: any, element: any, method: string): Promise<EndpointData | null> {
    const content = await element.textContent();
    const lines = content?.split('\n') || [];

    let url = '';
    let payload = null;
    let response = null;

    for (const line of lines) {
      const urlMatch = line.match(/https?:\/\/[^\s]+|\/[a-zA-Z0-9_\-\/{}:]+/);
      if (urlMatch) {
        url = urlMatch[0];
        break;
      }
    }

    if (!url) {
      return null;
    }

    if (content?.includes('{') && content?.includes('}')) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          payload = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          payload = jsonMatch[0];
        }
      }
    }

    if (content?.includes('response') || content?.includes('returns')) {
      const responseMatch = content.match(/response[:\s]*\{[\s\S]*\}/i);
      if (responseMatch) {
        try {
          response = JSON.parse(responseMatch[0].replace(/^response[:\s]*/i, ''));
        } catch (e) {
          response = responseMatch[0].replace(/^response[:\s]*/i, '');
        }
      }
    }

    const section = await this.findParentSection(page, element);

    return {
      url,
      method,
      authentication: null,
      queryParams: [],
      payload,
      response,
      description: '',
      section,
    };
  }

  private async findParentSection(page: any, element: any): Promise<string> {
    const parent = await element.evaluate((el: any) => {
      let current = el.previousElementSibling;
      while (current) {
        if (current.tagName && ['H1', 'H2', 'H3'].includes(current.tagName)) {
          return current.textContent;
        }
        current = current.previousElementSibling;
      }
      return null;
    });

    return parent || 'Unknown';
  }

  private async extractAuthentication(page: any, heading: any): Promise<string | null> {
    const sectionText = await heading.evaluate((el: any) => {
      let text = '';
      let current = el.nextElementSibling;

      while (current && !['H1', 'H2', 'H3', 'H4'].includes(current.tagName)) {
        text += current.textContent || '';
        current = current.nextElementSibling;
      }

      return text.toLowerCase();
    });

    if (sectionText.includes('auth required') || sectionText.includes('authentication required')) {
      return 'required';
    }

    if (sectionText.includes('bearer token') || sectionText.includes('authorization header')) {
      return 'bearer_token';
    }

    if (sectionText.includes('api key')) {
      return 'api_key';
    }

    if (sectionText.includes('oauth')) {
      return 'oauth';
    }

    return null;
  }

  private async extractParameters(
    page: any,
    heading: any
  ): Promise<Array<{ name: string; type: string; description: string; required: boolean }>> {
    const params: Array<{ name: string; type: string; description: string; required: boolean }> = [];

    const tableParams = await heading.evaluate((el: any) => {
      const params: Array<{ name: string; type: string; description: string; required: boolean }> = [];
      let current = el.nextElementSibling;

      while (current && !['H1', 'H2', 'H3', 'H4'].includes(current.tagName)) {
        if (current.tagName === 'TABLE') {
          const headerText = current.querySelector('thead tr, tr:first-child')?.textContent?.toLowerCase() || '';
          if (headerText.includes('parameter') || headerText.includes('param') || headerText.includes('field')) {
            const rows = current.querySelectorAll('tbody tr, tr:not(:first-child)');
            rows.forEach((row: any) => {
              const cells = Array.from(row.querySelectorAll('td, th')).map(
                (cell: any) => cell.textContent?.trim() || ''
              );

              if (cells.length >= 2) {
                const name = cells[0];
                const description = cells[cells.length - 1];
                const type = cells.length >= 3 ? cells[1] : 'string';
                const required =
                  description.toLowerCase().includes('required') || description.toLowerCase().includes('mandatory');

                params.push({
                  name,
                  type,
                  description,
                  required,
                });
              }
            });
          }
        }

        if (current.tagName === 'UL' || current.tagName === 'OL') {
          const listText = current.textContent?.toLowerCase() || '';

          if (listText.includes('parameter') || listText.includes('accepts')) {
            const items = current.querySelectorAll('li');
            items.forEach((item: any) => {
              const text = item.textContent?.trim() || '';

              const paramMatch = text.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:\(([^)]+)\))?\s*:?\s*(.+)$/);
              if (paramMatch) {
                const name = paramMatch[1];
                const type = paramMatch[2] || 'string';
                const description = paramMatch[3];
                const required = description.toLowerCase().includes('required');

                params.push({
                  name,
                  type,
                  description,
                  required,
                });
              }
            });
          }
        }

        current = current.nextElementSibling;
      }

      return params;
    });

    return tableParams;
  }

  private async extractPayloadAndResponse(page: any, heading: any): Promise<{ payload: any; response: any }> {
    const { payload, response } = await heading.evaluate((el: any) => {
      let payload: any = null;
      let response: any = null;
      let current = el.nextElementSibling;

      while (current && !['H1', 'H2', 'H3', 'H4'].includes(current.tagName)) {
        if (current.tagName === 'PRE' || current.tagName === 'CODE') {
          const content = current.textContent?.trim() || '';

          if (content.includes('{') && content.includes('}')) {
            try {
              const jsonMatch = content.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const jsonData = JSON.parse(jsonMatch[0]);

                const context = current.previousElementSibling?.textContent?.toLowerCase() || '';
                if (context.includes('request') || context.includes('payload') || context.includes('body')) {
                  payload = jsonData;
                } else if (context.includes('response') || context.includes('returns')) {
                  response = jsonData;
                } else {
                  if (!response) {
                    response = jsonData;
                  }
                }
              }
            } catch (e) {
              const jsonMatch = content.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const context = current.previousElementSibling?.textContent?.toLowerCase() || '';
                if (context.includes('request') || context.includes('payload')) {
                  payload = jsonMatch[0];
                } else {
                  response = jsonMatch[0];
                }
              }
            }
          }
        }

        const codeBlocks = current.querySelectorAll('pre, code');
        codeBlocks.forEach((block: any) => {
          const content = block.textContent?.trim() || '';

          if (content.includes('{') && content.includes('}')) {
            try {
              const jsonMatch = content.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const jsonData = JSON.parse(jsonMatch[0]);

                const context = block.previousElementSibling?.textContent?.toLowerCase() || '';
                if (context.includes('request') || context.includes('payload') || context.includes('body')) {
                  payload = jsonData;
                } else if (context.includes('response') || context.includes('returns')) {
                  response = jsonData;
                } else {
                  if (!response) {
                    response = jsonData;
                  }
                }
              }
            } catch (e) {
              const jsonMatch = content.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const context = block.previousElementSibling?.textContent?.toLowerCase() || '';
                if (context.includes('request') || context.includes('payload')) {
                  payload = jsonMatch[0];
                } else {
                  response = jsonMatch[0];
                }
              }
            }
          }
        });

        current = current.nextElementSibling;
      }

      return { payload, response };
    });

    return { payload, response };
  }

  private async extractDescription(page: any, heading: any): Promise<string> {
    const description = await heading.evaluate((el: any) => {
      let current = el.nextElementSibling;

      while (current && !['H1', 'H2', 'H3', 'H4'].includes(current.tagName)) {
        if (current.tagName === 'P') {
          const text = current.textContent?.trim() || '';
          if (text.length > 0) {
            return text;
          }
        }

        const firstParagraph = current.querySelector('p');
        if (firstParagraph) {
          const text = firstParagraph.textContent?.trim() || '';
          if (text.length > 0) {
            return text;
          }
        }

        current = current.nextElementSibling;
      }

      current = el.nextElementSibling;
      while (current && !['H1', 'H2', 'H3', 'H4'].includes(current.tagName)) {
        const text = current.textContent?.trim() || '';
        if (text.length > 20) {
          return text;
        }
        current = current.nextElementSibling;
      }

      return '';
    });

    return description || '';
  }

  private async extractEndpointFromHighlightTable(page: any, table: any): Promise<EndpointData | null> {
    const codeContent = await table.evaluate((el: any) => {
      const rows = el.querySelectorAll('tr');
      let code = '';

      rows.forEach((row: any) => {
        const codeCell = row.querySelector('td.blob-code');
        if (codeCell) {
          code += codeCell.textContent + '\n';
        }
      });

      return code.trim();
    });

    if (!codeContent) {
      return null;
    }

    const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const lines = codeContent.split('\n');

    let method = 'GET';
    let url = '';
    let payload = null;
    let response = null;

    for (const line of lines) {
      const methodMatch = line.match(/RestClient\.(get|post|put|delete|patch)\s*\(/i);
      if (methodMatch) {
        method = methodMatch[1].toUpperCase();
      }

      const urlMatch = line.match(/["']([^"']*\/[^"']*?)["']/);
      if (urlMatch) {
        url = urlMatch[1];
      }

      if (line.includes('payload') && line.includes('=')) {
        const payloadMatch = codeContent.match(/payload\s*=\s*\{[\s\S]*?\}/);
        if (payloadMatch) {
          try {
            const jsonPayload = payloadMatch[0]
              .replace(/payload\s*=\s*/, '')
              .replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=>/g, '"$1":')
              .replace(/=>/g, ':');
            payload = JSON.parse(jsonPayload);
          } catch (e) {
            payload = payloadMatch[0];
          }
        }
      }
    }

    const responseMatch = codeContent.match(/response.*?{[\s\S]*?}/i);
    if (responseMatch) {
      try {
        const jsonResponse = responseMatch[0].replace(/.*?{/, '{');
        response = JSON.parse(jsonResponse);
      } catch (e) {
        response = responseMatch[0];
      }
    }

    if (!url) {
      return null;
    }

    const section = await this.findParentSection(page, table);

    return {
      url,
      method,
      authentication: this.detectAuthenticationFromCode(codeContent),
      queryParams: this.extractQueryParamsFromCode(codeContent),
      payload,
      response,
      description: this.extractDescriptionFromCode(codeContent),
      section,
    };
  }

  private detectAuthenticationFromCode(codeContent: string): string | null {
    if (codeContent.includes('Authorization') || codeContent.includes('Bearer')) {
      return 'bearer_token';
    }

    if (codeContent.includes('api_token') || codeContent.includes('api_key')) {
      return 'api_key';
    }

    if (codeContent.includes('oauth')) {
      return 'oauth';
    }

    return null;
  }

  private extractQueryParamsFromCode(
    codeContent: string
  ): Array<{ name: string; type: string; description: string; required: boolean }> {
    const params: Array<{ name: string; type: string; description: string; required: boolean }> = [];

    const lines = codeContent.split('\n');

    for (const line of lines) {
      const paramMatch = line.match(/[#\/]*\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*[-:]?\s*(.+)/);
      if (paramMatch && line.includes('#')) {
        const name = paramMatch[1];
        const description = paramMatch[2];

        if (name && description) {
          params.push({
            name,
            type: 'string',
            description,
            required: description.toLowerCase().includes('required'),
          });
        }
      }
    }

    return params;
  }

  private extractDescriptionFromCode(codeContent: string): string {
    const commentBlocks = codeContent.match(/^#\s*(.+)/gm);
    if (commentBlocks && commentBlocks.length > 0) {
      return commentBlocks[0].replace(/^#\s*/, '');
    }

    return '';
  }

  private formatEndpointForOutput(endpoint: EndpointData): any {
    return {
      endpoint: {
        url: endpoint.url,
        method: endpoint.method,
        section: endpoint.section,
        description: endpoint.description,
      },
      authentication: endpoint.authentication
        ? {
            type: endpoint.authentication,
            required: endpoint.authentication !== null,
          }
        : null,
      parameters: {
        query: endpoint.queryParams,
        total: endpoint.queryParams.length,
      },
      request: {
        payload: endpoint.payload,
        contentType: endpoint.payload ? 'application/json' : null,
      },
      response: {
        example: endpoint.response,
        format: endpoint.response ? 'application/json' : null,
      },
      metadata: {
        extractedAt: new Date().toISOString(),
        source: 'iNaturalist API Documentation',
      },
    };
  }

  async crawl(urls: string[]): Promise<void> {
    log.info(`Starting crawl of ${urls.length} URLs`);

    await this.crawler.run(urls);

    log.info('Crawl completed');
  }

  async crawlOne(url: string): Promise<void> {
    await this.crawl([url]);
  }
}
