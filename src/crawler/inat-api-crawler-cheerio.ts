import { CheerioCrawler, log } from 'crawlee';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

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

export class INaturalistAPICrawlerCheerio {
  private crawler: CheerioCrawler;
  private outputDir: string;
  private savedFiles: Set<string>;

  constructor() {
    this.outputDir = './storage/datasets/inat-endpoints';
    this.savedFiles = new Set();
    this.crawler = new CheerioCrawler({
      requestHandler: async ({ request, $, body }) => {
        log.info(`Processing page: ${request.url}`);

        await this.extractEndpoints($, request.url);
      },
      failedRequestHandler: async ({ request, error }) => {
        log.error(`Request failed for ${request.url}: ${error instanceof Error ? error.message : String(error)}`);
      },
      maxRequestsPerCrawl: 1000,
      maxConcurrency: 1,
      requestHandlerTimeoutSecs: 120,
      additionalMimeTypes: ['text/html', 'application/xhtml+xml'],
      preNavigationHooks: [
        async ({ request, session }) => {
          if (session) {
            session.userData.headers = {
              'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate',
              Connection: 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
            };
          }
        },
      ],
    });
  }

  private async extractEndpoints($: any, url: string): Promise<void> {
    const endpoints: EndpointData[] = [];

    $('h2, h3, h4').each((_: number, element: any) => {
      const $heading = $(element);
      const headingText = $heading.text().trim();

      if (!this.isEndpointHeading(headingText)) {
        return;
      }

      const endpoint = this.extractEndpointFromSection($, $heading);
      if (endpoint) {
        endpoints.push(endpoint);
      }
    });

    $('table.highlight[data-hpc]').each((_: number, element: any) => {
      const $table = $(element);
      const endpoint = this.extractEndpointFromHighlightTable($, $table);
      if (endpoint) {
        endpoints.push(endpoint);
      }
    });

    $('pre, code').each((_: number, element: any) => {
      const $element = $(element);
      const content = $element.text().trim();

      const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      for (const method of httpMethods) {
        if (content.includes(method) && (content.includes('http') || content.includes('RestClient'))) {
          const endpoint = this.extractEndpointFromCodeBlock($, $element, method);
          if (endpoint) {
            endpoints.push(endpoint);
          }
        }
      }
    });

    const authEndpoints = this.extractAuthenticationEndpoints($);
    log.info(`Found ${authEndpoints.length} authentication endpoints`);
    endpoints.push(...authEndpoints);

    const uniqueEndpoints = endpoints.filter(
      (endpoint, index, self) => index === self.findIndex(e => e.url === endpoint.url && e.method === endpoint.method)
    );

    for (const endpoint of uniqueEndpoints) {
      const formattedEndpoint = this.formatEndpointForOutput(endpoint);
      this.saveEndpointToFile(formattedEndpoint);
    }

    log.info(`Extracted ${uniqueEndpoints.length} unique endpoints from ${url}`);
  }

  private isEndpointHeading(text: string): boolean {
    const endpointPatterns = [/^(GET|POST|PUT|DELETE|PATCH)\s+/i, /\/[a-zA-Z0-9_\-\/{}:]+/, /endpoint/i, /api/i];

    return endpointPatterns.some(pattern => pattern.test(text));
  }

  private extractEndpointFromSection($: any, $heading: any): EndpointData | null {
    const headingText = $heading.text().trim();
    const section = this.findParentSection($, $heading);

    const methodMatch = headingText.match(/^(GET|POST|PUT|DELETE|PATCH)\s+(.+)/i);
    let method = 'GET';
    let url = '';

    if (methodMatch) {
      method = methodMatch[1].toUpperCase();
      url = methodMatch[2].trim();
    } else {
      const urlMatch = headingText.match(/\/[a-zA-Z0-9_\-\/{}:]+/);
      if (urlMatch) {
        url = urlMatch[0];
      }
    }

    if (!url) {
      return null;
    }

    const authentication = this.extractAuthentication($, $heading);
    const queryParams = this.extractParameters($, $heading);
    const { payload, response } = this.extractPayloadAndResponse($, $heading);
    const description = this.extractDescription($, $heading);

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

  private extractEndpointFromHighlightTable($: any, $table: any): EndpointData | null {
    let codeContent = '';

    $table.find('tr').each((_: number, row: any) => {
      const $row = $(row);
      const codeCell = $row.find('td.blob-code');
      if (codeCell.length > 0) {
        codeContent += codeCell.text() + '\n';
      }
    });

    codeContent = codeContent.trim();

    if (!codeContent) {
      return null;
    }

    const lines = codeContent.split('\n');

    let method = 'GET';
    let url = '';
    let payload = null;
    let response = null;

    for (const line of lines) {
      const methodMatch = line.match(/RestClient\.(get|post|put|delete|patch)\s*\(/i);
      if (methodMatch && methodMatch[1]) {
        method = methodMatch[1].toUpperCase();
      }

      const urlMatch = line.match(/["']([^"']*\/[^"']*?)["']/);
      if (urlMatch && urlMatch[1]) {
        url = urlMatch[1];
      }

      if (line.includes('payload') && line.includes('=')) {
        const payloadMatch = codeContent.match(/payload\s*=\s*\{[\s\S]*?\}/);
        if (payloadMatch) {
          try {
            const jsonPayload = payloadMatch[0]
              .replace(/payload\s*=\s*/, '')
              .replace(/:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=>/g, '"$1":')
              .replace(/=>/g, ':')
              .replace(/'/g, '"');
            payload = JSON.parse(jsonPayload);
          } catch (e) {
            payload = payloadMatch[0];
          }
        }
      }
    }

    const responseMatch = codeContent.match(/#\s*response.*?{[\s\S]*?}/i);
    if (responseMatch) {
      try {
        const jsonResponse = responseMatch[0].replace(/.*?{/, '{').replace(/'/g, '"');
        response = JSON.parse(jsonResponse);
      } catch (e) {
        response = responseMatch[0];
      }
    }

    if (!url) {
      return null;
    }

    const section = this.findParentSection($, $table);

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

  private extractEndpointFromCodeBlock($: any, $element: any, method: string): EndpointData | null {
    const content = $element.text().trim();
    const lines = content.split('\n');

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

    if (content.includes('{') && content.includes('}')) {
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

    if (content.includes('response') || content.includes('returns')) {
      const responseMatch = content.match(/response[:\s]*\{[\s\S]*\}/i);
      if (responseMatch) {
        try {
          response = JSON.parse(responseMatch[0].replace(/^response[:\s]*/i, ''));
        } catch (e) {
          response = responseMatch[0].replace(/^response[:\s]*/i, '');
        }
      }
    }

    const section = this.findParentSection($, $element);

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

  private findParentSection($: any, $element: any): string {
    const $parent = $element.prevAll('h1, h2, h3').first();
    return $parent.length > 0 ? $parent.text().trim() : 'Unknown';
  }

  private extractAuthentication($: any, $heading: any): string | null {
    const $section = $heading.nextUntil('h1, h2, h3, h4');
    const sectionText = $section.text().toLowerCase();

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

  private extractParameters(
    $: any,
    $heading: any
  ): Array<{ name: string; type: string; description: string; required: boolean }> {
    const params: Array<{ name: string; type: string; description: string; required: boolean }> = [];

    const $section = $heading.nextUntil('h1, h2, h3, h4');

    $section.find('table').each((_: number, table: any) => {
      const $table = $(table);

      const headerText = $table.find('thead tr, tr:first-child').text().toLowerCase();
      if (headerText.includes('parameter') || headerText.includes('param') || headerText.includes('field')) {
        $table.find('tbody tr, tr:not(:first-child)').each((_: number, row: any) => {
          const $row = $(row);
          const cells = $row
            .find('td, th')
            .map((_: number, cell: any) => $(cell).text().trim())
            .get();

          if (cells.length >= 2) {
            const name = cells[0];
            const description = cells[cells.length - 1];
            const type = cells.length >= 3 ? cells[1] : 'string';

            if (name && description) {
              const required =
                description.toLowerCase().includes('required') || description.toLowerCase().includes('mandatory');

              params.push({
                name,
                type,
                description,
                required,
              });
            }
          }
        });
      }
    });

    $section.find('ul, ol').each((_: number, list: any) => {
      const $list = $(list);
      const listText = $list.text().toLowerCase();

      if (listText.includes('parameter') || listText.includes('accepts')) {
        $list.find('li').each((_: number, item: any) => {
          const $item = $(item);
          const text = $item.text().trim();

          const paramMatch = text.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:\(([^)]+)\))?\s*:?\s*(.+)$/);
          if (paramMatch) {
            const name = paramMatch[1];
            const type = paramMatch[2] || 'string';
            const description = paramMatch[3];

            if (name && description) {
              const required = description.toLowerCase().includes('required');

              params.push({
                name,
                type,
                description,
                required,
              });
            }
          }
        });
      }
    });

    return params;
  }

  private extractPayloadAndResponse($: any, $heading: any): { payload: any; response: any } {
    const $section = $heading.nextUntil('h1, h2, h3, h4');
    let payload: any = null;
    let response: any = null;

    $section.find('pre, code').each((_: number, element: any) => {
      const $element = $(element);
      const content = $element.text().trim();

      if (content.includes('{') && content.includes('}')) {
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[0]);

            const context = $element.prev().text().toLowerCase();
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
            const context = $element.prev().text().toLowerCase();
            if (context.includes('request') || context.includes('payload')) {
              payload = jsonMatch[0];
            } else {
              response = jsonMatch[0];
            }
          }
        }
      }
    });

    return { payload, response };
  }

  private extractDescription($: any, $heading: any): string {
    const $section = $heading.nextUntil('h1, h2, h3, h4');

    const $firstParagraph = $section.find('p').first();
    if ($firstParagraph.length > 0) {
      return $firstParagraph.text().trim();
    }

    const textNodes = $section.contents().filter((_: number, node: any) => {
      return node.nodeType === 3 && $(node).text().trim().length > 0;
    });

    if (textNodes.length > 0) {
      return $(textNodes[0]).text().trim();
    }

    return '';
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

  private extractAuthenticationEndpoints($: any): EndpointData[] {
    const authEndpoints: EndpointData[] = [];

    const bodyText = $('body').text();

    const oauthPatterns = [
      { url: '/oauth/authorize', method: 'GET', description: 'OAuth authorization endpoint' },
      { url: '/oauth/token', method: 'POST', description: 'OAuth token exchange endpoint' },
      { url: '/users/api_token', method: 'GET', description: 'Get user API token' },
      { url: '/oauth/applications', method: 'GET', description: 'List OAuth applications' },
      { url: '/oauth/applications/new', method: 'GET', description: 'Create new OAuth application' },
    ];

    log.debug(`Body text contains ${bodyText.length} characters`);

    const oauthUrlPatterns = [
      /\/oauth\/authorize/gi,
      /\/oauth\/token/gi,
      /\/users\/api_token/gi,
      /\/oauth\/applications/gi,
    ];

    for (const urlPattern of oauthUrlPatterns) {
      const matches = bodyText.match(urlPattern);
      if (matches) {
        for (const match of matches) {
          const normalizedUrl = match.toLowerCase();

          let method = 'GET';
          if (normalizedUrl.includes('/token')) {
            method = 'POST';
          }

          log.debug(`Found OAuth endpoint via regex: ${normalizedUrl}`);

          if (!authEndpoints.find(e => e.url === normalizedUrl)) {
            authEndpoints.push({
              url: normalizedUrl,
              method: method,
              authentication: normalizedUrl.includes('/oauth/token') ? null : 'oauth',
              queryParams: this.extractOAuthParams(bodyText, normalizedUrl),
              payload: this.extractOAuthPayload(bodyText, normalizedUrl),
              response: this.extractOAuthResponse(bodyText, normalizedUrl),
              description: this.getOAuthDescription(normalizedUrl),
              section: 'Authentication',
            });
          }
        }
      }
    }

    const knownOAuthEndpoints = [
      { url: '/oauth/authorize', method: 'GET' },
      { url: '/oauth/token', method: 'POST' },
      { url: '/users/api_token', method: 'GET' },
    ];

    for (const endpoint of knownOAuthEndpoints) {
      if (!authEndpoints.find(e => e.url === endpoint.url)) {
        log.debug(`Adding standard OAuth endpoint: ${endpoint.url}`);
        authEndpoints.push({
          url: endpoint.url,
          method: endpoint.method,
          authentication: endpoint.url.includes('/oauth/token') ? null : 'oauth',
          queryParams: this.extractOAuthParams(bodyText, endpoint.url),
          payload: this.extractOAuthPayload(bodyText, endpoint.url),
          response: this.extractOAuthResponse(bodyText, endpoint.url),
          description: this.getOAuthDescription(endpoint.url),
          section: 'Authentication',
        });
      }
    }

    const authSections = $('h1, h2, h3, h4').filter((_: number, el: any) => {
      const text = $(el).text().toLowerCase();
      return text.includes('auth') || text.includes('oauth') || text.includes('token');
    });

    authSections.each((_: number, element: any) => {
      const $section = $(element).nextUntil('h1, h2, h3, h4');
      const sectionText = $section.text();

      const urlMatches = sectionText.match(/\/[a-zA-Z0-9_\-\/{}:]+/g);
      if (urlMatches) {
        for (const url of urlMatches) {
          if (!authEndpoints.find(e => e.url === url) && this.isAuthenticationUrl(url)) {
            authEndpoints.push({
              url,
              method: 'GET',
              authentication: 'oauth',
              queryParams: [],
              payload: null,
              response: null,
              description: 'Authentication-related endpoint',
              section: 'Authentication',
            });
          }
        }
      }
    });

    return authEndpoints;
  }

  private isAuthenticationUrl(url: string): boolean {
    const authPatterns = [/oauth/i, /auth/i, /token/i, /login/i, /session/i, /api_token/i];

    return authPatterns.some(pattern => pattern.test(url));
  }

  private extractOAuthParams(
    content: string,
    url: string
  ): Array<{ name: string; type: string; description: string; required: boolean }> {
    const params: Array<{ name: string; type: string; description: string; required: boolean }> = [];

    if (url.includes('/oauth/authorize')) {
      params.push(
        { name: 'client_id', type: 'string', description: 'The client identifier', required: true },
        { name: 'redirect_uri', type: 'string', description: 'Redirect URI after authorization', required: true },
        { name: 'response_type', type: 'string', description: 'Response type (code)', required: true },
        { name: 'code_challenge', type: 'string', description: 'PKCE code challenge', required: false },
        { name: 'code_challenge_method', type: 'string', description: 'PKCE challenge method (S256)', required: false },
        { name: 'scope', type: 'string', description: 'Requested scopes', required: false }
      );
    } else if (url.includes('/oauth/token')) {
      params.push(
        { name: 'client_id', type: 'string', description: 'The client identifier', required: true },
        { name: 'code', type: 'string', description: 'Authorization code', required: true },
        { name: 'redirect_uri', type: 'string', description: 'Redirect URI used in authorization', required: true },
        { name: 'grant_type', type: 'string', description: 'Grant type (authorization_code)', required: true },
        { name: 'code_verifier', type: 'string', description: 'PKCE code verifier', required: false }
      );
    }

    return params;
  }

  private extractOAuthPayload(content: string, url: string): any {
    const lines = content.split('\n');
    const urlIndex = lines.findIndex(line => line.includes(url));

    if (urlIndex !== -1) {
      for (let i = Math.max(0, urlIndex - 10); i < Math.min(lines.length, urlIndex + 10); i++) {
        const line = lines[i];
        if (line && line.includes('{') && line.includes('}')) {
          try {
            const jsonMatch = line.match(/\{[^}]*\}/);
            if (jsonMatch) {
              return jsonMatch[0];
            }
          } catch (e) {}
        }
      }
    }

    return null;
  }

  private extractOAuthResponse(content: string, url: string): any {
    if (url.includes('/oauth/token')) {
      const tokenResponseMatch = content.match(/\{\s*"access_token"[^}]*\}/);
      if (tokenResponseMatch) {
        return tokenResponseMatch[0];
      }

      return {
        access_token: 'string',
        token_type: 'bearer',
        expires_in: 'number or null',
        refresh_token: 'string or null',
        scope: 'string',
      };
    }

    return null;
  }

  private getOAuthDescription(url: string): string {
    const descriptions: { [key: string]: string } = {
      '/oauth/authorize': 'OAuth authorization endpoint - redirects user to authorize your application',
      '/oauth/token': 'OAuth token exchange endpoint - exchange authorization code for access token',
      '/users/api_token': 'Get user API token for authenticated requests',
      '/oauth/applications': 'List OAuth applications',
      '/oauth/applications/new': 'Create new OAuth application',
    };

    return descriptions[url] || 'OAuth authentication endpoint';
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

  private generateFileName(endpoint: any): string {
    const method = endpoint.endpoint.method.toLowerCase();
    const url = endpoint.endpoint.url;

    const segments = url.replace(/^\//, '').split('/');
    let firstSegment = segments[0] || 'root';

    firstSegment = firstSegment
      .replace(/[{}:]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();

    let fileName = `${method}_${firstSegment}.json`;

    let counter = 1;
    const baseFileName = fileName;

    while (this.savedFiles.has(fileName)) {
      if (segments.length > counter) {
        let nextSegment = segments[counter]
          .replace(/[{}:]/g, '')
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .toLowerCase();
        fileName = `${method}_${firstSegment}_${nextSegment}.json`;
        counter++;
      } else {
        const baseName = baseFileName.replace('.json', '');
        fileName = `${baseName}_${counter}.json`;
        counter++;
      }
    }

    this.savedFiles.add(fileName);
    return fileName;
  }

  private cleanupOldFiles(): void {
    if (existsSync(this.outputDir)) {
      log.info('Cleaning up previous endpoint files...');
      rmSync(this.outputDir, { recursive: true, force: true });
    }

    mkdirSync(this.outputDir, { recursive: true });
    this.savedFiles.clear();
    log.info(`Created output directory: ${this.outputDir}`);
  }

  private saveEndpointToFile(endpoint: any): void {
    const fileName = this.generateFileName(endpoint);
    const filePath = join(this.outputDir, fileName);

    try {
      writeFileSync(filePath, JSON.stringify(endpoint, null, 2));
      log.debug(`Saved endpoint to: ${fileName}`);
    } catch (error) {
      log.error(`Failed to save endpoint ${fileName}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async crawl(urls: string[]): Promise<void> {
    log.info(`Starting crawl of ${urls.length} URLs`);

    this.cleanupOldFiles();

    await this.crawler.run(urls);

    log.info('Crawl completed');
  }

  async crawlOne(url: string): Promise<void> {
    await this.crawl([url]);
  }
}
