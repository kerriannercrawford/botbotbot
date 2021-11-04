const puppeteer = require('puppeteer-extra');
require('dotenv').config()

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin())
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const mainController = {};

mainController.get = async (req, res, next) => {
  const { url } = req.body;
  await checkout(url)
  next();
};

// const playstationUrl = 'https://www.bestbuy.com/site/sony-playstation-5-console/6426149.p?skuId=6426149';
const loginUrl = 'https://www.walmart.com/account/login'

async function initBrowser() {
  const browser = await puppeteer.launch({ headless: false });
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

async function hitContinue(page) {
  await page.evaluate(() => {
    let elems = document.getElementsByClassName('w_C8 w_DA w_DD w_DF')
    for (let elem of elems) {
      console.log(elem)
      if (elem.innerText === 'Continue') {
        elem.click()
      }
    }
  })
}

async function login(page) {
  await page.evaluate((loginInfo) => {
    let div = document.getElementsByClassName('form-field')
    console.log(div, 'div')
    let emailField = document.getElementById('email')
    console.log(emailField, 'email')
    // emailField.value = loginInfo[0];
    let passwordField = document.getElementById('password')
    console.log(passwordField, 'password')
    // passwordField.value = loginInfo[1];
    let submit = document.getElementsByClassName('button m-margin-top text-inherit')
    for (let elem of submit) {
      if (elem.innerHTML === 'Sign in') {
        // elem.click()
      }
    }
  }, [process.env.EMAIL, process.env.PASSWORD])
}

async function pullUpItem(page, url) {
  await page.goto(url)
  return page;
}

async function cvv(page) {
  await page.evaluate((cvvVal) => {
    let elem = document.getElementById('ld_select_2')
    elem.value = cvvVal
  }, process.env.CVV)
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


async function checkout(url) {
  let page = await initBrowser();
  await Promise.all([login(page), timeout(3000)])
  // page = await pullUpItem(page, url)
  // await addToCart(page)
  // await openCart(page)
  // await Promise.all([continueToCheckout(page), timeout(3000)])
  // await Promise.all([hitContinue(page), timeout(3000)])
  // await cvv(page)
  // await submitOrder(page)
}
module.exports = mainController;