// Concurrent scrapper
class PuppeteerManager {
	/* initialize */
	constructor({ url, commands, nrOfPages }) {
		this.url = url;
		this.existingCommands = commands; // instructions on DOM
		this.nrOfPages = nrOfPages;
		this.allProducts = [];
		this.productDetails = {};
	}

	async runPuppeteer() {
		const puppeteer = require("puppeteer");
		let commands = [];
		if (this.nrOfPages > 1) {
			for (let i = 0; i < this.nrOfPages; i++) {
				if (i < this.nrOfPages - 1) {
					commands.push(...this.existingCommands);
				} else {
					commands.push(this.existingCommands[0]);
				}
			}
		} else {
			commands = this.existingCommands;
		}
		console.log("commands length", commands.length);
		const browser = await puppeteer.launch({
			headless: false,
			args: ["--no-sandbox", "--disable-gpu", "--start-maximized"],
			defaultViewport: null,
		});
		let page = await browser.newPage();
		// await this.preparePageForTests(page);
		page.on("console", (msg) => {
			for (let i = 0; i < msg._args.lengths; ++i) {
				msg._args[i].jsonValue().then((result) => {
					console.log(result);
				});
			}
		});

		await page.goto(this.url, { waitUntil: "networkidle2" });
		const delay = 3000;
		let preCount = 0;
		let postCount = 0;
		// await page.screenshot({ path: "./screenshot2.jpg", type: "jpeg", fullPage: true });
		let timeout = 5000;
		let commandIndex = 0;
		while (commandIndex < commands.length) {
			try {
				console.log(`command ${commandIndex + 1}/${commands.length}`);
				let frames = await page.frames();
				await frames[0].waitForSelector(commands[commandIndex].locatorCss, { timeout: timeout });

				/* Scroll event */
				do {
					preCount = await this.getCount(page, commands[commandIndex].locatorCss);
					console.log(`precount:`,preCount)
					await this.scrollDown(page, commands[commandIndex].locatorCss);
					await page.waitFor(delay);
					postCount = await this.getCount(page, commands[commandIndex].locatorCss);
					console.log(`postcount:`,preCount)
				} while (postCount > preCount);

				await this.executeCommand(frames[0], commands[commandIndex]);
				await this.sleep(1000);
				// console.log(
				// 	"executing with locatorCss",
				// 	commands[commandIndex].locatorCss,
				// 	"and command type",
				// 	commands[commandIndex].type
				// ); /* test */
			} catch (error) {
				console.log(error);
				break;
			}
			commandIndex++;
		}
		console.log("done");
		// await browser.close();
	}

	async executeCommand(frame, command) {
		console.log(command.type, command.locatorCss);
		switch (command.type) {
			case "click":
				try {
					await frame.$eval(command.locatorCss, (elem) => elem.click());
					return true;
				} catch (error) {
					console.log("error", error);
					return false;
				}
			case "getItems":
				try {
					let products = await frame
						.evaluate((command) => {
							const convertStar = async (div) => {

							}
							try {
								let parsedItems = [];
								let items = document.querySelectorAll(command.locatorCss);
								items.forEach(async (item) => {
									let ratingList = [];
									let link = "https://shopee.sg" + item.querySelector("a").getAttribute("href");
									let imageUrl = item.querySelector("._39-Tsj._1tDEiO > img").getAttribute("src");
									let productTitle = item.querySelector("._1NoI8_.A6gE1J._1co5xN").innerText.trim();
									let price = item.querySelector("._1xk7ak").innerText.trim();
									let ratings = item.querySelectorAll(".shopee-rating-stars__star-wrapper");
									await ratings.forEach(async (star) => {
										let width = star.querySelector(".shopee-rating-stars__lit").getAttribute("style");
										let re = /(\d+\.\d+)|(\d+)/g;
										let matched = await width.match(re);
										if(matched.length > 0) {
											ratingList.push(matched[0]);
										}
									})
									let product = {
										productTitle: productTitle,
										price: parseFloat(price.replace(/,/g, '')),
										link: link,
										imageUrl: imageUrl,
										ratings: ratingList
									};
									// console.log(product);
									parsedItems.push(product);
								});
								return parsedItems;
							} catch (error) {
								console.log(error);
							}
						}, command)
						.then((result) => {
							this.allProducts.push.apply(this.allProducts, result);
							console.log("allProducts length", this.allProducts.length);
						});
					return true;
				} catch (error) {
					console.log("error", error);
					return false;
				}
			case "getItemDetails":
				break;
			default:
				console.log("error");
				break;
		}
	}

	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async getAllProducts() {
		await this.runPuppeteer();
		return this.allProducts;
	}

	async getProductDetails() {
		return null;
	}
	// async preparePageForTests(page) {
	// 	// Pass the User-Agent Test.
	// 	const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
	// 	  'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
	// 	await page.setUserAgent(userAgent);
	// }

	async getCount(page, locatorCss) {
		return await page.$$eval(locatorCss, (a) => a.length);
	}

	async scrollDown(page, locatorCss) {
		await page.$eval(`${locatorCss}:last-child`, (e) => {
			e.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
		});
	}
}

module.exports = { PuppeteerManager };
