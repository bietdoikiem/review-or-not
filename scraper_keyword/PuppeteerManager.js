// Concurrent scrapper
class PuppeteerManager {
	/* initialize */
	constructor({ url, commands, nrOfPages }) {
		this.url = url;
		this.existingCommands = commands; // instructions on DOM
		this.nrOfPages = nrOfPages;
		this.allProducts = [];
		this.productDetails = {};
		this.productReviews = [];
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
		// console.log("commands length", commands.length);
		const browser = await puppeteer.launch({
			headless: false,
			args: ["--no-sandbox", "--disable-gpu", "--start-maximized", "--window-size=1920,1080"],
		});
		let page = await browser.newPage();
		await page.setViewport({
			width: 1920,
			height: 1080,
		});
		// await this.preparePageForTests(page);
		page.on("console", (msg) => {
			for (let i = 0; i < msg._args.lengths; ++i) {
				msg._args[i].jsonValue().then((result) => {
					// console.log(result);
				});
			}
		});
		await page.goto(
			this.url,
			{ waitUntil: "networkidle2" }
			// ,function () {
			//   console.log(this.url);
			// }
		);

		let commandIndex = 0;
		const timeout = 5000;
		let preCount = 0;
		let postCount = 0;
		const delay = 3000;
		if (commands[0].type == "getItems") {
			while (commandIndex < commands.length) {
				try {
					console.log(`command ${commandIndex + 1}/${commands.length}`);
					let frames = await page.frames();
					await frames[0].waitForSelector(commands[commandIndex].locatorCss, { timeout: timeout });

					/* Scroll event */
					do {
						preCount = await this.getCount(page, commands[commandIndex].locatorCss);
						console.log(`precount:`, preCount);
						await this.scrollDown(page, commands[commandIndex].locatorCss);
						await page.waitFor(delay);
						postCount = await this.getCount(page, commands[commandIndex].locatorCss);
						console.log(`postcount:`, preCount);
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
		} else if (commands[0].type == "getItemDetails" || commands[0].type == "getItemReviews") {
			while (commandIndex < commands.length) {
				try {
					// console.log(`command ${commandIndex + 1}/${commands.length}`);
					let frames = await page.frames();

					/* Scroll event for Get Reviews*/
						// Click the "I AM OVER 18" if the dialog shows in the page
						if ((await page.$(".shopee-alert-popup__message")) !== null)
						  await page.click(".shopee-alert-popup__btn");
						const bodyHandle = await page.$("body");
						const { height } = await bodyHandle.boundingBox();
						await bodyHandle.dispose();

						const viewportHeight = page.viewport().height;
						let viewportIncr = 0;
						while (viewportIncr + viewportHeight < height) {
							await page.evaluate((_viewportHeight) => {
								window.scrollBy(0, _viewportHeight);
							}, viewportHeight);
							await this.sleep(1500);
							viewportIncr = viewportIncr + viewportHeight;
						}
					

					await this.executeCommand(page, commands[commandIndex]);

				} catch (error) {
					console.log(error);
					break;
				}
				commandIndex++;
			}
		} else {
			await this.executeCommand(page, commands[commandIndex]);
		}
		// console.log("done");
		await browser.close();
	}

	async executeCommand(frame, command) {
		// console.log(command.type, command.locatorCss);
		switch (command.type) {
			case "click":
				try {
					await frame.$eval(command.locatorCss, (elem) => elem.click());
					return true;
				} catch (error) {
					console.log("error", error);
					return false;
				}
			case "getItems" /* Selector: .col-xs-2-4.shopee-search-item-result__item */:
				try {
					let products = await frame
						.evaluate((command) => {
							const convertStar = async (ratingList) => {
								let actualRating = 0;
								for (const rating of ratingList) {
									nmlRating = rating / 100;
									actualRating += nmlRating;
								}
								return parseFloat(actualRating.toFixed(1));
							};
							try {
								let parsedItems = [];
								let items = document.querySelectorAll(command.locatorCss);
								items.forEach(async (item) => {
									try {
										let ratingList = [];
										let link =
											"https://shopee.sg" + (await item.querySelector("a").getAttribute("href"));
										let imageUrl = await item
											.querySelector("._39-Tsj._1tDEiO > img")
											.getAttribute("src");
										let productTitle = await item
											.querySelector("._1NoI8_.A6gE1J._1co5xN")
											.innerText.trim();
										let price = await item.querySelector("._1xk7ak").innerText;
										let ratings = await item.querySelectorAll(".shopee-rating-stars__star-wrapper");
										let discountPercent = (await item
											.querySelector("span.percent"))
											? item.querySelector("span.percent").innerText
											: "0%";
										await ratings.forEach(async (star) => {
											let width = star
												.querySelector(".shopee-rating-stars__lit")
												.getAttribute("style");
											let re = /(\d+\.\d+)|(\d+)/g;
											let matched = await width.match(re);
											if (matched.length > 0) {
												ratingList.push(parseFloat(matched[0]));
											}
										});
										let actualRating = await convertStar(ratingList);
										let soldUnit = await item.querySelector("._245-SC").innerText.replace("sold", "").trim();
										soldUnit = soldUnit ? soldUnit : 0;
										let product = {
											productTitle: productTitle,
											price: parseFloat(price.replace(/,/g, "")),
											link: link,
											imageUrl: imageUrl,
											ratings: actualRating,
											discount: discountPercent,
											soldUnit: soldUnit
										};
										// console.log(product);
										parsedItems.push(product);
									} catch (error) {
										console.log(error);
									}
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
			case "getItemReviews" /* Selector: .shopee-product-rating */:
try {
					this.productReviews = await frame.evaluate(async (command) => {
						console.log(command.locatorCss);
						try {
							function wait(ms) {
								return new Promise((resolve) => setTimeout(() => resolve(), ms));
							}
							let commentFilter = document.getElementsByClassName("product-rating-overview__filter--with-comment")[0]
							await commentFilter.click()
							let results = [];
							let pages = document.getElementsByClassName("shopee-icon-button--right");
							let trackingPage = 1;
							let nextPage = 1;
							// Condition checking if there are reviews for the product
							while (trackingPage == nextPage && pages[0] != undefined) {
								// Scrape review's content
								let items = document.querySelectorAll(command.locatorCss);
								for (let elem of items) {
									let review = {}; // Review object
									let userReview = elem.getElementsByClassName("shopee-product-rating__main")[0];
									review["author"] = userReview.getElementsByClassName(
										"shopee-product-rating__author-name"
									)[0].innerText; // Add review author
									review["time"] = userReview.getElementsByClassName(
										"shopee-product-rating__time"
									)[0].innerText;
									//Check variation
									let reviewVariation = userReview.getElementsByClassName(
										"shopee-product-rating__variation"
									)[0];
									if (reviewVariation != undefined) {
										let a = reviewVariation.innerText.replace("Variation: ", "").split(",");
										review["variation"] = a; // Add review variation
									}
									review["content"] = userReview.getElementsByClassName(
										"shopee-product-rating__content"
									)[0].innerText; // Add review content
									review["rating"] = userReview.getElementsByClassName(
										"icon-rating-solid--active"
									).length; // Add review rating
									results.push(review); // Add to the result list
								}
								await pages[0].click();
								trackingPage = parseInt(
									document.getElementsByClassName(
										"shopee-button-solid shopee-button-solid--primary"
									)[0].innerText
								);
								nextPage++;
								await wait(1000);
								pages = null;
								pages = document.getElementsByClassName("shopee-icon-button--right");
							}
							return results;
						} catch (error) {
							console.log(error);
							return error;
						}
					}, command);
					// console.log(this.productReviews);
					return true;
				} catch (error) {
					console.log("error", error);
					return false;
				}
			case "getItemDetails" /* Selector: null */:
				try {
					this.productDetails = await frame.evaluate(async () => {

						try {
							// Change number if containing "k" character
							function changeNum(string) {
								if(string.includes("k")) {
									const numString = string.slice(0, -1);
									return (parseFloat(numString) * 1000);
								}
								else return (parseFloat(string));
							}

              // Get all Specifications
              const specifications = [];
              const specif = document.querySelectorAll("._1-gNZm");
              for (var i = 2; i < specif.length; i++)
                specifications.push(specif[i].innerText);

              // Get all Details in Product Specifications Section
              const details = [];
              const det = document.querySelectorAll("._2gVYdB > div");
              for (var i = 1; i < det.length; i++)
                details.push(det[i].innerText);

              // Array to hold all our results
              let detail = {};

              // Take each element and store it
              // Title
              detail["title"] = document
                .querySelectorAll("._3ZV7fL")[0]
                .getElementsByTagName("span")[0].innerText;

              // URL product
              const productUrl = document.querySelectorAll("link");
              detail["productUrl"] = productUrl[productUrl.length - 2].baseURI;

              // URL image
              const imgUrl = document
                .querySelector("._39-Tsj > div")
                .getAttribute("style");
              detail["imageUrl"] = imgUrl.substring(
                23,
                imgUrl.indexOf(")") - 1
              );

              // Rating details
              if (document.querySelector("._3WXigY") !== null) {
								detail["rating"] = parseFloat(document.querySelectorAll("._3WXigY")[0].innerText);
								detail["numOfRatings"] = changeNum(document.querySelectorAll("._3WXigY")[1].innerText);
								detail["ratingDetail"] = {};
								const ratings = document.querySelectorAll(".product-rating-overview__filter");
								detail["ratingDetail"]["rating1"] = changeNum(ratings[5].innerText.substring(8, ratings[5].innerText.length-1));
								detail["ratingDetail"]["rating2"] = changeNum(ratings[4].innerText.substring(8, ratings[4].innerText.length-1));
								detail["ratingDetail"]["rating3"] = changeNum(ratings[3].innerText.substring(8, ratings[3].innerText.length-1));
								detail["ratingDetail"]["rating4"] = changeNum(ratings[2].innerText.substring(8, ratings[2].innerText.length-1));
								detail["ratingDetail"]["rating5"] = changeNum(ratings[1].innerText.substring(8, ratings[1].innerText.length-1));
							}
							else {
                detail["rating"] = null;
                detail["numOfRatings"] = null;
                detail["ratingDetail"] = null;
              }

              // Price
              detail["price"] = document.querySelectorAll(
                ".AJyN7v"
              )[0].innerText;

              // Category
              let cates = document.querySelectorAll("._2gVYdB > ._1qYtEg > a");
              detail["category"] = [];
              for (var i = 1; i < cates.length; i++)
                detail["category"].push(cates[i].innerText);

              // Brand
              detail["brand"] = document.querySelectorAll(
                "._3yEY86"
              )[0].innerText;
              if (detail["brand"] == "No Brand") detail["brand"] = null;

              // Stock
              for (var i = 0; i < specifications.length; i++) {
                if (specifications[i] == "Stock") {
                  detail["stock"] = parseInt(
                    details[details.length - specifications.length + i]
                  );
                  details.splice(details.length - specifications.length + i, 1);
                  specifications.splice(i, 1);
                  break;
                }
              }

              // Other specifications
              if (details.length == 0) detail["specification"] = null;
              else {
                detail["specification"] = {};
                for (var i = details.length - 1; i >= 0; i--) {
                  index = details.length - 1 - i;
                  detail["specification"][
                    specifications[
                      specifications.length - details.length + i
                    ].toLowerCase()
                  ] = details[i];
                }
                if (specifications.length != details.length)
                  detail["specification"]["model"] = document.querySelectorAll(
                    "._3yEY86"
                  )[1].innerText;
              }

              // Description
              detail["description"] = document.querySelector(
                "._36_A1j > span"
              ).innerText;

              return detail;
            } catch (error) {
							console.log(error);
							return error;
						}
					}, command);
					return true;
				} catch (error) {
					console.log("error", error);
					return false;
				}
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

	async getProductReviews() {
		await this.runPuppeteer();
		return this.productReviews;
	}

	async getProductDetails() {
		await this.runPuppeteer();
		return this.productDetails;
	}

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