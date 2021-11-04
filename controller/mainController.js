const puppeteer = require('puppeteer-extra');

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin())
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const mainController = {};

mainController.get = async (req, res, next) => {
  const { email, password, url, cvvVal } = req.body;
  await checkout(email, password, url, cvvVal)
  next();
};

// const playstationUrl = 'https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149';
const loginUrl = 'https://www.walmart.com/account/login'

async function initBrowser() {
  const browser = await puppeteer.launch({ headless: false, executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15')
  await page.goto(loginUrl);
  return page;
}

async function addToCart(page) {
  await page.evaluate(() => {
    let elems = document.getElementsByClassName('w_C8 w_DA w_DF')
    for (let elem of elems) {
      if (elem.ariaLabel.includes('Add to cart') && elem.className === 'w_C8 w_DA w_DF') {
        elem.click()
      }
    }
  })
}

async function openCart(page) {
  const promise = await Promise.all([pageEval(page), timeout(3000)])
  return promise
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function pageEval(page) {
  await page.evaluate(() => {
    let elems = document.getElementsByClassName('bn bg-transparent br2 db flex flex-column items-center pa0 pointer relative sans-serif white')
    for (let elem of elems) {
      if (elem.ariaLabel.includes('Cart contains')) {
        elem.click()
      }
    }
  })
}

async function continueToCheckout(page) {
  await page.evaluate(() => {
    let elems = document.getElementsByClassName('w_C8 w_DA w_DD w_DF')
    console.log(elems)
    for (let elem of elems) {
      if (elem.id === 'Continue to checkout button') {
        elem.click()
      }
    }
  })
}

async function login(page, email, pass) {
  console.log(email, pass)
  await page.evaluate((loginInfo) => {
    let emailField = document.getElementById('email')
    emailField.value = loginInfo[0];
    let passwordField = document.getElementById('password')
    passwordField.value = loginInfo[1];
    let submit = document.getElementsByClassName('button m-margin-top text-inherit')
    for (let elem of submit) {
      if (elem.innerHTML === 'Sign in') {
        elem.click()
      }
    }
  }, [email, pass])
}

async function pullUpItem(page, url) {
  await page.goto(url)
  return page;
}

async function cvv(page, cvvVal) {
  console.log(cvvVal)
  await page.evaluate((cvvVal) => {
    let elem = document.getElementById('ld_select_2')
    elem.value = cvvVal
  }, cvvVal)
}

async function submitOrder(page) {
  await page.evaluate(() => {
    let elems = document.getElementsByClassName('w_y w_0 w_3 w_6')
    for (let elem of elems) {
      if (elem.ariaLabel.includes('Place order')) {
        elem.click()
      }
    }
  })
}


async function checkout(email, pass, url, cvvVal) {
  let page = await initBrowser();
  await Promise.all([login(page, email, pass), timeout(3000)])
  page = await pullUpItem(page, url)
  await addToCart(page)
  await openCart(page)
  await Promise.all([continueToCheckout(page), timeout(3000)])
  await cvv(page, cvvVal)
  // await submitOrder(page)
}
module.exports = mainController;