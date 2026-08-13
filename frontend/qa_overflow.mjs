import { chromium } from 'playwright';

const url = 'http://localhost:5173';
const routes = ['/', '/catalog', '/login', '/register'];
const viewports = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 }
];

async function runQA() {
  console.log('Starting Responsive QA Audit...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  for (const route of routes) {
    console.log(`\n--- Testing Route: ${route} ---`);
    for (const vp of viewports) {
      const page = await context.newPage();
      await page.setViewportSize(vp);
      try {
        await page.goto(`${url}${route}`, { waitUntil: 'networkidle', timeout: 5000 });
        
        // Let any animations finish
        await page.waitForTimeout(1000);
        
        const overflowResult = await page.evaluate(() => {
          const docW = document.documentElement.scrollWidth;
          const winW = document.documentElement.clientWidth;
          const hasOverflow = docW > winW;
          
          let offendingElements = [];
          if (hasOverflow) {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              // Exclude head, script, style, etc.
              if (rect.right > winW && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE' && el.tagName !== 'LINK') {
                offendingElements.push({
                  tag: el.tagName,
                  className: el.className,
                  right: rect.right,
                  text: el.innerText ? el.innerText.substring(0, 30).replace(/\n/g, ' ') : ''
                });
              }
            }
          }
          return { hasOverflow, docW, winW, offendingElements };
        });
        
        if (overflowResult.hasOverflow) {
          console.log(`[FAIL] Viewport ${vp.width}x${vp.height} -> Overflow! (Scroll: ${overflowResult.docW}, Client: ${overflowResult.winW})`);
          // Print only the deepest children that cause the issue (or just the first 3)
          console.log(`   Offending elements (sample):`);
          overflowResult.offendingElements.slice(-3).forEach(el => {
             console.log(`   - <${el.tag.toLowerCase()} class="${el.className}"> ${el.text}`);
          });
        } else {
          console.log(`[PASS] Viewport ${vp.width}x${vp.height} -> OK`);
        }
      } catch (err) {
        console.log(`[ERROR] Viewport ${vp.width}x${vp.height} -> ${err.message}`);
      }
      await page.close();
    }
  }
  
  await browser.close();
  console.log('\nAudit complete.');
}

runQA();
