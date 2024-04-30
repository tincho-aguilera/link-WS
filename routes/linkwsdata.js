let express = require('express');
let router = express.Router();
const playwright = require('playwright')
/* GET home page. */
router.get('/', function (req, res) {
  res.send('hello world')
})
/* POST home page. */
router.post('/',async function(req, res, next) {
  const browser = await playwright.firefox.launch({ headless: true });
  // Crear un nuevo contexto de página
  const context = await browser.newContext();
  
  // Abrir una nueva página
  const page = await context.newPage();
  
  // Navegar a la página de inicio de sesión
  await page.goto('https://linkedin.com/login');
  
  // Esperar a que aparezca el campo de usuario y escribir el nombre de usuario
  await page.waitForSelector('#username');
  await page.type('#username', process.env.USERNAME);
  
  // Esperar a que aparezca el campo de contraseña y escribir la contraseña
  await page.waitForSelector('#password');
  await page.type('#password', process.env.PASSWORD);

  await page.click('button[data-litms-control-urn="login-submit"]');
  await page.waitForLoadState('load');

  if (page.url().includes("checkpoint/challenge")) {
    res.json({
      error : "Captcha page! Aborting due to headless mode..."
    });
  }

  // Hacer algo después de iniciar sesión

  await page.goto(
    `https://www.linkedin.com/pub/dir?firstName=${req.body.name}&lastName=${req.body.lastname}&trk=people-guest_people-search-bar_search-submit`
  )
  const people = await page.$$eval(
      '.reusable-search__result-container',
      (results)=>(
          results.map(el=>{
              const title = el.querySelector('span[aria-hidden="true"]')?.innerText
              if (!title) return null;
              const link = el.querySelector('.app-aware-link')?.getAttribute('href');
              const image = el.querySelector('.presence-entity__image')?.getAttribute('src')
              const location = el.querySelector('.entity-result__secondary-subtitle')?.innerText
              const profession = el.querySelector('.entity-result__primary-subtitle')?.innerText
              return {title,image,location,profession,link}
          })
      )
  )
  // Cerrar el navegador
  await browser.close();
  res.json(people);
});

module.exports = router;