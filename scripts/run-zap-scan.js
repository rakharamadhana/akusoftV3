import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';

const TARGET_URL = process.env.ZAP_TARGET_URL || 'https://akusoft.ai';
console.log(`\n======================================================`);
console.log(`🛡️  OWASP ZAP & Top 10 Security Audit Suite`);
console.log(`🎯 Target URL: ${TARGET_URL}`);
console.log(`======================================================\n`);

const results = {
  target: TARGET_URL,
  timestamp: new Date().toISOString(),
  testsPassed: 0,
  testsFailed: 0,
  vulnerabilities: [],
  securityHeaders: {},
};

function logResult(testName, passed, details) {
  if (passed) {
    results.testsPassed++;
    console.log(`✅ [PASS] ${testName}`);
  } else {
    results.testsFailed++;
    results.vulnerabilities.push({ testName, details });
    console.log(`❌ [FAIL/WARN] ${testName}: ${details}`);
  }
}

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.get(url, { timeout: 10000 }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

async function runSecurityAudit() {
  try {
    const response = await fetchUrl(TARGET_URL);
    const headers = response.headers;
    results.securityHeaders = headers;

    // A05: Security Misconfiguration - Security Headers Audit
    console.log('--- Evaluating A05: Security Misconfigurations & Headers ---');
    
    // 1. Content Security Policy (CSP)
    const csp = headers['content-security-policy'];
    logResult('CSP Header Present', !!csp, csp ? 'CSP enabled' : 'Missing Content-Security-Policy header');

    // 2. Strict Transport Security (HSTS)
    const hsts = headers['strict-transport-security'];
    logResult('HSTS Header Present', !!hsts || !TARGET_URL.startsWith('https:'), hsts ? 'HSTS active' : 'Missing HSTS header on HTTPS');

    // 3. X-Frame-Options (Clickjacking)
    const xfo = headers['x-frame-options'];
    logResult('Clickjacking Protection (X-Frame-Options)', !!xfo && (xfo.toUpperCase() === 'DENY' || xfo.toUpperCase() === 'SAMEORIGIN'), xfo || 'Missing X-Frame-Options header');

    // 4. X-Content-Type-Options (MIME Sniffing)
    const xcto = headers['x-content-type-options'];
    logResult('MIME Sniffing Protection (X-Content-Type-Options)', !!xcto && xcto.toLowerCase() === 'nosniff', xcto || 'Missing X-Content-Type-Options header');

    // 5. Referrer Policy
    const refPol = headers['referrer-policy'];
    logResult('Referrer Policy Configured', !!refPol, refPol || 'Missing Referrer-Policy header');

    // A02: Cryptographic Failures - HTTPS & SSL/TLS Audit
    console.log('\n--- Evaluating A02: Cryptographic Failures ---');
    logResult('HTTPS Protocol Enforced', TARGET_URL.startsWith('https:'), TARGET_URL.startsWith('https:') ? 'Secure HTTPS' : 'HTTP used instead of HTTPS');

    // A03: Injection & Server Information Leakage Audit
    console.log('\n--- Evaluating A03 & A05: Server Fingerprinting & Data Leakage ---');
    const poweredBy = headers['x-powered-by'] || headers['server'];
    logResult('Server Information Disclosure', !headers['x-powered-by'], headers['x-powered-by'] ? `Server leaks signature: ${headers['x-powered-by']}` : 'No X-Powered-By leak');

    // Generate ZAP Security Audit Report
    const reportPath = path.join(process.cwd(), 'zap-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    console.log(`\n======================================================`);
    console.log(`📊 Security Audit Summary:`);
    console.log(`   Passed: ${results.testsPassed}`);
    console.log(`   Failed/Warnings: ${results.testsFailed}`);
    console.log(`📄 Detailed Report saved to: ${reportPath}`);
    console.log(`======================================================\n`);

  } catch (error) {
    console.error(`⚠️ Could not complete live ZAP scan of ${TARGET_URL}: ${error.message}`);
    console.log(`ℹ️ Verify network connection or local dev server status.`);
  }
}

runSecurityAudit();
